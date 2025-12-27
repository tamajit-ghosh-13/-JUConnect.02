'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useStore from '@/store/useStore'
import Navbar from '@/components/Navbar'
import EventCard from '@/components/EventCard'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  // Extend as needed
}

interface CreateEventForm {
  title: string;
  description: string;
  date: string;
  location: string;
}

export default function Events() {
  const router = useRouter()
  const user = useStore((state) => state.user)
  const [events, setEvents] = useState<Event[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [formData, setFormData] = useState<CreateEventForm>({
    title: '',
    description: '',
    date: '',
    location: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchEvents()
  }, [user, router])

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events')
      setEvents(data)
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Failed to load events')
    }
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.date || !formData.location.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    try {
      const { data } = await api.post('/events', formData)
      setEvents([data as Event, ...events])
      setShowCreate(false)
      setFormData({ title: '', description: '', date: '', location: '' })
      toast.success('Event created!')
    } catch (error) {
      console.error('Create error:', error)
      toast.error('Failed to create event')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Campus Events
          </h1>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-4 py-2 bg-ju-blue text-white rounded-lg hover:bg-ju-dark-blue"
            aria-label="Toggle create event form"
          >
            {showCreate ? 'Cancel' : 'Create Event'}
          </button>
        </div>

        {showCreate && (
          <form onSubmit={handleCreateEvent} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="sr-only">Event Title</label>
                <input
                  id="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Event Title"
                  maxLength={100}
                />
              </div>
              <div>
                <label htmlFor="description" className="sr-only">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Description"
                  rows={3}
                  maxLength={500}
                />
              </div>
              <div>
                <label htmlFor="date" className="sr-only">Date and Time</label>
                <input
                  id="date"
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label htmlFor="location" className="sr-only">Location</label>
                <input
                  id="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Location"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-ju-blue text-white rounded-lg hover:bg-ju-dark-blue"
              >
                Create Event
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
          {events.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">No upcoming events</p>
          )}
        </div>
      </div>
    </div>
  )
}