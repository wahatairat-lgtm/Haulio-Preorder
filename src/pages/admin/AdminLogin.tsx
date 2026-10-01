import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    const from = (location.state as { from?: string } | null)?.from ?? '/admin/orders'
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/admin/orders', { replace: true })
    } catch {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <h1 className="mb-6 text-lg font-semibold text-gray-900">เข้าสู่ระบบแอดมิน</h1>
      <form onSubmit={handleSubmit} className="w-full space-y-3">
        <input
          required
          type="email"
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <input
          required
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  )
}
