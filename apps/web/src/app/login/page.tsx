'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/api'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth'
import { GoogleLogin } from '@react-oauth/google'
import { socialLogin } from '@/lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const setToken = useAuthStore((s) => s.setToken)
  const setUser = useAuthStore((s) => s.setUser)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await login(email, password)
      const { token, user } = res.data
      setToken(token)
      setUser(user)
      remember
        ? localStorage.setItem('token', token)
        : sessionStorage.setItem('token', token)
      toast.success('Login successful')
      router.push(user.role === 'super_admin' ? '/dashboard' : '/account')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential
    if (!idToken) return toast.error('Login failed')
    try {
      const res = await socialLogin(idToken)
      const { token, user } = res.data
      setToken(token)
      setUser(user)
      localStorage.setItem('token', token)
      toast.success('Google login successful')
      router.push(user.role === 'super_admin' ? '/dashboard' : '/account')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10 border rounded shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Login to My Juntar</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded"
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="accent-blue-600"
            />
            Remember me
          </label>
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="text-center my-4 text-gray-400">OR</div>

      <div className="text-center">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => toast.error('Google login failed')}
        />
      </div>

      <p className="text-sm text-center mt-6">
        Don’t have an account?{' '}
        <a href="/signup" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  )
}
