'use client'
import { useState } from 'react'
import { Mail, Lock, User } from 'lucide-react'

export default function EmailAuthModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userExists, setUserExists] = useState(false)
  const [userName, setUserName] = useState('')

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Try login OTP first (for existing users)
      const loginRes = await fetch('/api/auth/login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (loginRes.ok) {
        // User exists, get user info
        const userRes = await fetch('/api/auth/check-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })
        
        if (userRes.ok) {
          const userData = await userRes.json()
          setUserName(userData.name)
        }
        
        setUserExists(true)
        setStep('otp')
      } else if (loginRes.status === 404) {
        // User doesn't exist, send registration OTP
        const regRes = await fetch('/api/auth/request-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })
        
        if (regRes.ok) {
          setUserExists(false)
          setStep('otp')
        } else {
          const regData = await regRes.json()
          setError(regData.error)
        }
      } else {
        const loginData = await loginRes.json()
        setError(loginData.error)
      }
    } catch (err) {
      setError('Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Use different endpoints based on whether user exists
      const endpoint = userExists ? '/api/auth/verify-login-otp' : '/api/auth/verify-otp'
      const body = userExists 
        ? { email, otp }
        : { email, otp, fullName }
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()
      
      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        onSuccess(data.token)
        onClose()
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Verification failed')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          {step === 'email' ? 'Enter Your Email' : 'Verify OTP'}
        </h3>
        
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="modal-action">
              <button type="button" className="btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading && <span className="loading loading-spinner loading-sm"></span>}
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-4">
              <p className="text-sm text-base-content/70">
                OTP sent to {email}.
              </p>
              {userExists && userName && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Welcome back, {userName}!</p>
                  <button 
                    type="button" 
                    className="text-xs text-error hover:underline mt-1"
                    onClick={() => {
                      setStep('email')
                      setEmail('')
                      setUserExists(false)
                      setUserName('')
                    }}
                  >
                    Not you? Login as different user
                  </button>
                </div>
              )}
              {!userExists && (
                <p className="text-sm text-base-content/70 mt-1">Creating your account...</p>
              )}
            </div>

            {!userExists && (
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}
            
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  OTP Code
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
              />
            </div>
            
            <div className="modal-action">
              <button type="button" className="btn" onClick={() => setStep('email')}>
                Back
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading && <span className="loading loading-spinner loading-sm"></span>}
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}