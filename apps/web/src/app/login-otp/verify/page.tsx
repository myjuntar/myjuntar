'use client'

import { useState, useEffect } from 'react'
import { loginOtpVerify } from '@/lib/api'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth'

export default function OtpVerifyPage() {
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
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Enter OTP</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          {loading ? 'Verifying...' : 'Verify & Login'}
        </button>
      </form>
    </div>
  )
}
