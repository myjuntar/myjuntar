'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { loginOtpRequest } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function LoginOtpRequestPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await loginOtpRequest(email)
      toast.success('OTP sent to your email')
      router.push(`/login-otp/verify?email=${email}`)
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } }
        toast.error(axiosError.response?.data?.message || 'Failed to send OTP')
      } else {
        toast.error('Unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login with OTP</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </form>
    </div>
  )
}
