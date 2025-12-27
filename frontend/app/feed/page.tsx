'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useStore from '@/store/useStore'
import Navbar from '@/components/Navbar'
import CreatePost from '@/components/CreatePost'
import PostCard from '@/components/PostCard'
import FriendRequestCard from '@/components/FriendRequestCard'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function Feed() {
  const router = useRouter()
  const user = useStore((state) => state.user)
  const [posts, setPosts] = useState([])
  const [friendRequests, setFriendRequests] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchFeed()
    fetchFriendRequests()
  }, [user, router])

  const fetchFeed = async () => {
    if (loading) return
    setLoading(true)
    try {
      const { data } = await api.get(`/posts/feed?page=${page}`)
      setPosts((prev: any) => [...prev, ...data.posts])
      setHasMore(data.hasMore)
      setPage((prev) => prev + 1)
    } catch (error) {
      toast.error('Failed to load feed')
    } finally {
      setLoading(false)
    }
  }

  const fetchFriendRequests = async () => {
    try {
      const { data } = await api.get('/friends/requests')
      setFriendRequests(data)
    } catch (error) {
      console.error('Failed to load friend requests')
    }
  }

  const handlePostCreated = (newPost: any) => {
    setPosts([newPost, ...posts])
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Friend Requests */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sticky top-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Friend Requests
              </h2>
              {friendRequests.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No pending requests
                </p>
              ) : (
                <div className="space-y-3">
                  {friendRequests.map((req: any) => (
                    <FriendRequestCard
                      key={req._id}
                      request={req}
                      onAccept={() => {
                        setFriendRequests(friendRequests.filter((r: any) => r._id !== req._id))
                        toast.success('Friend request accepted')
                      }}
                      onReject={() => {
                        setFriendRequests(friendRequests.filter((r: any) => r._id !== req._id))
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main feed */}
          <div className="lg:col-span-2">
            <CreatePost onPostCreated={handlePostCreated} />
            <div className="space-y-4 mt-6">
              {posts.map((post: any) => (
                <PostCard key={post._id} post={post} />
              ))}
              {hasMore && (
                <button
                  onClick={fetchFeed}
                  disabled={loading}
                  className="w-full py-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 text-ju-blue font-medium disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}