'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useStore from '@/store/useStore'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const router = useRouter()
  const { user, clearUser } = useStore()

  const handleLogout = () => {
    localStorage.removeItem('token')
    clearUser()
    router.push('/login')
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/feed" className="text-2xl font-bold text-ju-blue">
            JUConnect
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/feed" className="text-gray-700 dark:text-gray-300 hover:text-ju-blue">
              Feed
            </Link>
            <Link href="/events" className="text-gray-700 dark:text-gray-300 hover:text-ju-blue">
              Events
            </Link>
            <Link href="/search" className="text-gray-700 dark:text-gray-300 hover:text-ju-blue">
              Search
            </Link>
            <Link
              href={`/profile/${user?._id}`}
              className="text-gray-700 dark:text-gray-300 hover:text-ju-blue"
            >
              Profile
            </Link>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}