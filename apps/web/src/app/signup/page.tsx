'use client'

import { useState } from 'react'
import { signupRequest } from '@/lib/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !fullName) return toast.error('All fields are required.')
    setLoading(true)
    try {
      await signupRequest({ email, full_name: fullName })
      toast.success('OTP sent to your email')
      router.push(`/verify?email=${email}`)
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
    <div className="max-w-md mx-auto p-6 mt-10 border rounded shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Your Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Sending OTP...' : 'Signup'}
        </button>
      </form>

      <p className="text-sm text-center mt-6">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Login here
        </a>
      </p>
    </div>
  )
}
