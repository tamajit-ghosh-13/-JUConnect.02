import { create } from 'zustand'

interface User {
  _id: string
  name: string
  email: string
  year: string
  bio?: string
  profilePic?: string
  isAdmin?: boolean
}

interface Store {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

const useStore = create<Store>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null })
}))

export default useStore