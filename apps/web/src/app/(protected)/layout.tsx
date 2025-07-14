'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { decodeJwt } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  const setToken = useAuthStore((s) => s.setToken)
  const setUser = useAuthStore((s) => s.setUser)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (storedToken && !token) {
      const decoded = decodeJwt(storedToken)
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setToken(storedToken)
        setUser({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        })
      } else {
        router.replace('/login')
      }
    } else if (!storedToken) {
      router.replace('/login')
    }
  }, [token, setToken, setUser, router])

  return <>{children}</>
}
