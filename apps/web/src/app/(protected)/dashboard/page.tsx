'use client'

import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <p>Welcome to the protected dashboard page!</p>
    </div>
  )
}
