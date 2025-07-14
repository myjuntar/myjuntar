'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { setPassword } from '@/lib/api'
import { toast } from 'sonner'

export default function Form() {
  const [password, setPasswordValue] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const e = searchParams.get('email')
    if (e) {
      setEmail(e)
      const payload = localStorage.getItem('signup-payload')
      if (payload) {
        try {
          const parsed = JSON.parse(payload)
          if (parsed.phone_number) {
            setPhoneNumber(parsed.phone_number)
          }
        } catch {
          toast.error('Corrupted signup session')
        }
      }
    } else {
      toast.error('Missing email. Please restart signup.')
      router.push('/signup')
    }
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await setPassword(email, password, phoneNumber)
      toast.success('Password set successfully!')
      localStorage.removeItem('signup-payload') // ✅ clean session
      router.push('/login')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } }
        toast.error(axiosErr.response?.data?.message || 'Failed to set password.')
      } else {
        toast.error('Unexpected error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
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
    </>
  )
}
