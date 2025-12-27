'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function CreatePost({ onPostCreated }: { onPostCreated: (post: any) => void }) {
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('content', content)
      if (image) formData.append('image', image)

      const { data } = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      onPostCreated(data)
      setContent('')
      setImage(null)
      toast.success('Post created!')
    } catch (error) {
      toast.error('Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-ju-blue focus:border-ju-blue dark:bg-gray-700 dark:text-white resize-none"
          placeholder="What's on your mind?"
          rows={3}
          maxLength={500}
        />
        <div className="flex items-center justify-between mt-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="text-sm text-gray-600 dark:text-gray-400"
          />
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="px-6 py-2 bg-ju-blue text-white rounded-lg hover:bg-ju-darkBlue disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {content.length}/500 characters
        </p>
      </form>
    </div>
  )
}