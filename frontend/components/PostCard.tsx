'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CommentSection from './CommentSection'
import { api } from '@/lib/api'
import useStore from '@/store/useStore'

export default function PostCard({ post }: { post: any }) {
  const router = useRouter()
  const user = useStore((state) => state.user)
  const [liked, setLiked] = useState(post.likes.includes(user?._id))
  const [likesCount, setLikesCount] = useState(post.likes.length)
  const [showComments, setShowComments] = useState(false)

  const handleLike = async () => {
    try {
      const { data } = await api.post(`/posts/${post._id}/like`)
      setLiked(data.liked)
      setLikesCount(data.likes)
    } catch (error) {
      console.error('Failed to like post')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return
    try {
      await api.delete(`/admin/posts/${post._id}`)
      window.location.reload()
    } catch (error) {
      console.error('Failed to delete post')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-start gap-3 mb-3">
        <div
          onClick={() => router.push(`/profile/${post.author._id}`)}
          className="w-10 h-10 rounded-full bg-ju-blue text-white flex items-center justify-center font-bold cursor-pointer"
        >
          {post.author.name[0]}
        </div>
        <div className="flex-1">
          <h3
            onClick={() => router.push(`/profile/${post.author._id}`)}
            className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:underline"
          >
            {post.author.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{post.author.year}</p>
        </div>
        {user?.isAdmin && (
          <button onClick={handleDelete} className="text-red-500 text-sm">
            Delete
          </button>
        )}
      </div>

      <p className="text-gray-800 dark:text-gray-200 mb-3">{post.content}</p>

      {post.image && (
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}${post.image}`}
          alt="Post"
          className="w-full rounded-lg mb-3 max-h-96 object-cover"
        />
      )}

      <div className="flex items-center gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 ${liked ? 'text-ju-blue' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <span>{liked ? '❤️' : '🤍'}</span>
          <span>{likesCount}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-gray-600 dark:text-gray-400"
        >
          💬 Comments
        </button>
      </div>

      {showComments && <CommentSection postId={post._id} />}
    </div>
  )
}