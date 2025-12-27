'use client'

import { useState } from 'react'
import useStore from '@/store/useStore'
import { api } from '@/lib/api'

export default function EventCard({ event }: { event: any }) {
  const user = useStore((state) => state.user)
  const [attending, setAttending] = useState(event.attendees.some((a: any) => a._id === user?._id))
  const [count, setCount] = useState(event.attendees.length)

  const handleRSVP = async () => {
    try {
      const { data } = await api.post(`/events/${event._id}/rsvp`)
      setAttending(data.attending)
      setCount(data.attendeesCount)
    } catch (error) {
      console.error('Failed to RSVP')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>
      <p className="text-gray-700 dark:text-gray-300 mb-3">{event.description}</p>
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <span>📅 {new Date(event.date).toLocaleString()}</span>
        <span>📍 {event.location}</span>
        <span>👥 {count} attending</span>
      </div>
      <button
        onClick={handleRSVP}
        className={`px-6 py-2 rounded-lg ${
          attending
            ? 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            : 'bg-ju-blue text-white hover:bg-ju-darkBlue'
        }`}
      >
        {attending ? 'Cancel RSVP' : 'RSVP'}
      </button>
    </div>
  )
}