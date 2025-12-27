'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useStore from '@/store/useStore'
import Navbar from '@/components/Navbar'
import PostCard from '@/components/PostCard'
import { api } from '@/lib/api'

export default function Search() {
  const router = useRouter()
  const user = useStore((state) => state.user)
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'users' | 'posts'>('users')
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])

  const handleSearch = async () => {
    if (!query.trim()) return

    try {
      if (tab === 'users') {
        const { data } = await api.get(`/users/search/query?q=${query}`)
        setUsers(data)
      } else {
        const { data } = await api.get(`/posts/search?q=${query}`)
        setPosts(data)
      }
    } catch (error) {
      console.error('Search failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setTab('users')}
              className={`px-4 py-2 rounded-lg ${tab === 'users' ? 'bg-ju-blue text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              Users
            </button>
            <button
              onClick={() => setTab('posts')}
              className={`px-4 py-2 rounded-lg ${tab === 'posts' ? 'bg-ju-blue text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              Posts
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder={`Search ${tab}...`}
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-ju-blue text-white rounded-lg hover:bg-ju-darkBlue"
            >
              Search
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {tab === 'users' && users.map((u: any) => (
            <div
              key={u._id}
              onClick={() => router.push(`/profile/${u._id}`)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-ju-blue text-white flex items-center justify-center font-bold">
                  {u.name[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{u.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{u.year}</p>
                </div>
              </div>
            </div>
          ))}

          {tab === 'posts' && posts.map((post: any) => (
            <PostCard key={post._id} post={post} />
          ))}

          {((tab === 'users' && users.length === 0) || (tab === 'posts' && posts.length === 0)) && query && (
            <p className="text-center text-gray-500 dark:text-gray-400">No results found</p>
          )}
        </div>
      </div>
    </div>
  )
}