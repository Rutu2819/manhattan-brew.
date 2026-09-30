import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = `${import.meta.env.VITE_API_URL}`

export default function Login() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('email') // 'email' | 'otp'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const sendOtp = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStep('otp')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/order')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-login">
      <h2>Login to Manhattan Brew</h2>

      {step === 'email' && (
        <>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOtp} disabled={loading || !email}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      )}

      {step === 'otp' && (
        <>
          <p>Enter the 6-digit code sent to {email}</p>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp} disabled={loading || otp.length !== 6}>
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>
        </>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}