'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Lock, Mail, LogIn, AlertCircle, RefreshCw, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', otp: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [countdown])

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })

      const data = await res.json()

      if (res.ok) {
        setOtpSent(true)
        setCountdown(300) // 5 minutes
        setCanResend(false)
      } else if (res.status === 404) {
        setError('User not found. Please register first.')
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/verify-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        login(data.user, data.token)
        // Customers go to customer dashboard, admin/staff/driver go to admin dashboard
        if (data.user.role === 'CUSTOMER' || data.user.role === 'customer') {
          router.push('/customer-dashboard')
        } else {
          router.push('/dashboard')
        }
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })

      const data = await res.json()

      if (res.ok) {
        setCountdown(300)
        setCanResend(false)
        setError('')
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="card bg-base-100 shadow-2xl">
      <div className="card-body">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-3xl font-bold text-primary">Welcome Back</h2>
          </div>
          <p className="text-base-content/70">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="alert alert-error mb-4">
            <AlertCircle className="w-6 h-6" />
            <span>{error}</span>
          </div>
        )}
        
        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </span>
              </label>
              <input
                id="email-input"
                type="email"
                placeholder="Enter your email"
                className="input input-bordered input-primary"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <button 
              id="login-btn"
              type="submit" 
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading && <span className="loading loading-spinner loading-sm"></span>}
              {loading ? 'Sending OTP...' : 'Login with OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="alert alert-info mb-4">
              <Mail className="w-5 h-5" />
              <div>
                <div>OTP sent to {formData.email}</div>
                {countdown > 0 && (
                  <div className="text-sm flex items-center mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    Expires in {formatTime(countdown)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Enter OTP
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="input input-bordered input-primary text-center text-lg tracking-widest"
                value={formData.otp}
                onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/\D/g, '')})}
                maxLength={6}
                required
              />
            </div>

            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => {
                  setOtpSent(false)
                  setCountdown(0)
                  setCanResend(false)
                  setFormData({...formData, otp: ''})
                }}
                className="btn btn-outline flex-1"
              >
                Back
              </button>
              <button 
                type="submit" 
                className="btn btn-primary flex-1"
                disabled={loading || formData.otp.length !== 6}
              >
                {loading && <span className="loading loading-spinner loading-sm"></span>}
                {loading ? 'Verifying...' : 'Login'}
              </button>
            </div>

            <div className="text-center space-y-2">
              {canResend ? (
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="btn btn-ghost btn-sm"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Resend OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false)
                      setCountdown(0)
                      setCanResend(false)
                      setFormData({ email: '', otp: '' })
                      setError('')
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    Try different email
                  </button>
                </div>
              ) : countdown > 0 ? (
                <div className="space-y-1">
                  <span className="text-sm text-base-content/60">
                    Resend available in {formatTime(countdown)}
                  </span>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false)
                        setCountdown(0)
                        setCanResend(false)
                        setFormData({ email: '', otp: '' })
                        setError('')
                      }}
                      className="btn btn-ghost btn-xs"
                    >
                      Use different email
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false)
                    setCountdown(0)
                    setCanResend(false)
                    setFormData({ email: '', otp: '' })
                    setError('')
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  Try different email
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}