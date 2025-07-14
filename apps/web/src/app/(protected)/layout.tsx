// app/(protected)/layout.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { decodeJwt } from '@/lib/utils'
import { toast } from 'sonner'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    if (!token) {
      router.replace('/login')
      return
    }

    try {
      const decoded: any = decodeJwt(token)
      const exp = decoded.exp * 1000
      if (Date.now() >= exp) {
        toast.error('Session expired. Please login again.')
        logout()
        router.replace('/login')
      }
    } catch (err) {
      logout()
      router.replace('/login')
    }
  }, [token, logout, router])

  return <>{children}</>
}
