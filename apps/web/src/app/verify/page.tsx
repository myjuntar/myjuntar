'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifySignupOtp, signupRequest } from '@/lib/api'
import { toast } from 'sonner'

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const e = searchParams.get('email')
    if (e) setEmail(e)
    else {
      toast.error('Missing email. Please restart signup.')
      router.replace('/signup')
    }
  }, [searchParams, router])

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => setResendCooldown((t) => t - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [resendCooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length < 4) return toast.error('OTP must be at least 4 digits')
    setLoading(true)
    try {
      await verifySignupOtp(email, otp)
      toast.success('OTP verified!')
      router.push(`/set-password?email=${email}`)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await signupRequest({ email, full_name: '' }) // backend ignores name on resend
      toast.success('OTP resent to your email')
      setResendCooldown(60)
    } catch {
      toast.error('Could not resend OTP')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10 border rounded shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Verify Your Email</h1>
      <p className="text-center text-gray-500 mb-4">
        We’ve sent a one-time password to <span className="font-medium">{email}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded text-center tracking-widest font-mono"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <div className="text-sm text-center mt-4">
        Didn’t receive the OTP?{' '}
        <button
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className="text-blue-600 hover:underline disabled:opacity-50"
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
        </button>
      </div>
    </div>
  )
}
