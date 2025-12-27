'use client'

import { api } from '@/lib/api'

export default function FriendRequestCard({
  request,
  onAccept,
  onReject
}: {
  request: any
  onAccept: () => void
  onReject: () => void
}) {
  const handleAccept = async () => {
    try {
      await api.put(`/friends/accept/${request._id}`)
      onAccept()
    } catch (error) {
      console.error('Failed to accept friend request')
    }
  }

  const handleReject = async () => {
    try {
      await api.put(`/friends/reject/${request._id}`)
      onReject()
    } catch (error) {
      console.error('Failed to reject friend request')
    }
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="w-10 h-10 rounded-full bg-ju-blue text-white flex items-center justify-center font-bold">
        {request.requester.name[0]}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm text-gray-900 dark:text-white">
          {request.requester.name}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">{request.requester.year}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          className="px-3 py-1 bg-ju-blue text-white text-xs rounded hover:bg-ju-darkBlue"
        >
          Accept
        </button>
        <button
          onClick={handleReject}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-xs rounded"
        >
          Reject
        </button>
      </div>
    </div>
  )
}