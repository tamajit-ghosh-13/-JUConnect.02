'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useStore from '@/store/useStore'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    year: '1st yr IT'
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const setUser = useStore((state) => state.setUser)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email.endsWith('@jaduniv.edu.in')) {
      toast.error('Please use your JU email (@jaduniv.edu.in)')
      return
    }

    setLoading(true)

    try {
      const { data } = await api.post('/auth/signup', formData)
      setUser(data)
      localStorage.setItem('token', data.token)
      toast.success('Account created successfully!')
      router.push('/feed')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-4xl font-bold text-ju-blue">
            Join JUConnect
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Create your account to connect with JU students
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-ju-blue focus:border-ju-blue"
              placeholder="Full Name"
            />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-ju-blue focus:border-ju-blue"
              placeholder="Email (@jaduniv.edu.in)"
            />
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-ju-blue focus:border-ju-blue"
              placeholder="Password (min 6 characters)"
            />
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-ju-blue focus:border-ju-blue"
            >
              <option value="1st yr IT">1st Year IT</option>
              <option value="2nd yr IT">2nd Year IT</option>
              <option value="3rd yr IT">3rd Year IT</option>
              <option value="4th yr IT">4th Year IT</option>
              <option value="1st yr CSE">1st Year CSE</option>
              <option value="2nd yr CSE">2nd Year CSE</option>
              <option value="3rd yr CSE">3rd Year CSE</option>
              <option value="4th yr CSE">4th Year CSE</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-ju-blue hover:bg-ju-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ju-blue disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="font-medium text-ju-blue hover:text-ju-darkBlue"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}