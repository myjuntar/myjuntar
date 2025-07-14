'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { setPassword } from '@/lib/api'
import { toast } from 'sonner'

export default function SetPasswordPage() {
  const [password, setPasswordValue] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const e = searchParams.get('email')
    if (e) setEmail(e)
    else {
      toast.error('Missing email. Please restart signup.')
      router.push('/signup')
    }
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await setPassword(email, password)
      toast.success('Password set successfully!')
      router.push('/login')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to set password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Set Your Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPasswordValue(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? 'Setting...' : 'Set Password'}
        </button>
      </form>
    </div>
  )
}
