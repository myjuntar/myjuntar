'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { loginOtpVerify } from '@/lib/api'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth'

export default function Form() {
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const setToken = useAuthStore((state) => state.setToken)
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    const e = searchParams.get('email')
    if (e) setEmail(e)
    else {
      toast.error('Missing email')
      router.push('/login-otp')
    }
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await loginOtpVerify(email, otp)
      const { token, user } = res.data
      setToken(token)
      setUser(user)
      localStorage.setItem('token', token)
      toast.success('Login successful')
      router.push(user.role === 'super_admin' ? '/dashboard' : '/account')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } }
        toast.error(axiosErr.response?.data?.message || 'Login failed')
      } else {
        toast.error('Unexpected error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold text-center mb-4">Verify OTP</h1>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
        className="w-full border border-gray-300 p-2 rounded text-center"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white font-semibold py-2 rounded"
      >
        {loading ? 'Verifying...' : 'Verify & Login'}
      </button>
    </form>
  )
}
