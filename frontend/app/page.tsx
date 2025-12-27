'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useStore from '@/store/useStore'

export default function Home() {
  const router = useRouter()
  const user = useStore((state) => state.user)

  useEffect(() => {
    if (user) {
      router.push('/feed')
    } else {
      router.push('/login')
    }
  }, [user, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-ju-blue mb-4">JUConnect</h1>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
}