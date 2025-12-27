'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/posts/${postId}/comments`)
      setComments(data.comments)
    } catch (error) {
      console.error('Failed to load comments')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, {
        content: newComment
      })
      setComments([data, ...comments])
      setNewComment('')
    } catch (error) {
      toast.error('Failed to post comment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm"
            placeholder="Write a comment..."
            maxLength={300}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-ju-blue text-white rounded-lg hover:bg-ju-darkBlue text-sm disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {comments.map((comment: any) => (
          <div key={comment._id} className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-ju-blue text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              {comment.author.name[0]}
            </div>
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
              <p className="font-semibold text-sm text-gray-900 dark:text-white">
                {comment.author.name}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}