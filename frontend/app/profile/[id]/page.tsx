'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import useStore from '@/store/useStore'
import Navbar from '@/components/Navbar'
import PostCard from '@/components/PostCard'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function Profile() {
  const params = useParams()
  const router = useRouter()
  const currentUser = useStore((state) => state.user)
  const [profile, setProfile] = useState<any>(null)
  const [posts, setPosts] = useState([])
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState('')
  const [image, setImage] = useState<File | null>(null)

  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
      return
    }
    fetchProfile()
  }, [params.id, currentUser, router])

  const fetchProfile = async () => {
    try {
      const { data } = await api.get(`/users/${params.id}`)
      setProfile(data.user)
      setPosts(data.posts)
      setBio(data.user.bio || '')
    } catch (error) {
      toast.error('Failed to load profile')
    }
  }

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData()
      formData.append('bio', bio)
      if (image) formData.append('profilePic', image)

      await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Profile updated!')
      setEditing(false)
      fetchProfile()
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  if (!profile) return <div>Loading...</div>

  const isOwnProfile = currentUser?._id === profile._id

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-ju-blue text-white flex items-center justify-center text-3xl font-bold">
              {profile.name[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{profile.year}</p>
              {editing ? (
                <div className="mt-4 space-y-3">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Bio"
                    maxLength={200}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="block"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateProfile}
                      className="px-4 py-2 bg-ju-blue text-white rounded-lg hover:bg-ju-darkBlue"
                    >
                      Save
                    </button>
                    <button
                      onClick={()etEditing(false)}
className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg"
>
Cancel
</button>
</div>
</div>
) : (
<>
<p className="mt-3 text-gray-700 dark:text-gray-300">
{profile.bio || 'No bio yet'}
</p>
{isOwnProfile && (
<button
onClick={() => setEditing(true)}
className="mt-3 px-4 py-2 bg-ju-blue text-white rounded-lg hover:bg-ju-darkBlue"
>
Edit Profile
</button>
)}
</>
)}
</div>
</div>
</div>
    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Posts</h2>
    <div className="space-y-4">
      {posts.map((post: any) => (
        <PostCard key={post._id} post={post} />
      ))}
      {posts.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">No posts yet</p>
      )}
    </div>
  </div>
</div>
)
}