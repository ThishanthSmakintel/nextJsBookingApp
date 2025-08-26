'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { driver } from 'driver.js'
import { Lock, Mail, LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', otp: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  useEffect(() => {
    if (!localStorage.getItem('login-tour')) {
      const driverObj = driver({
        showProgress: true,
        showButtons: ['next', 'previous', 'close'],
        nextBtnText: 'Next →',
        prevBtnText: '← Previous',
        doneBtnText: 'Start Booking!',
        steps: [
          { 
            element: '#email-input', 
            popover: { 
              title: 'Enter Your Email', 
              description: 'Use the email address you registered with to access your account and bookings.',
              side: 'top'
            } 
          },
          { 
            element: '#password-input', 
            popover: { 
              title: 'Secure Password', 
              description: 'Enter your password to securely access your dashboard and manage bookings.',
              side: 'top'
            } 
          },
          { 
            element: '#login-btn', 
            popover: { 
              title: 'Access Dashboard', 
              description: 'Click to login and access your personalized dashboard with booking history.',
              side: 'top'
            } 
          }
        ],
        onDestroyed: () => {
          localStorage.setItem('login-tour', 'completed')
        }
      })
      setTimeout(() => {
        driverObj.drive()
      }, 800)
    }
  }, [])

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
        router.push('/dashboard')
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
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
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            >
              {loading ? 'Sending OTP...' : 'Login with OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="alert alert-info mb-4">
              <span>OTP sent to {formData.email}</span>
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
                className="input input-bordered input-primary"
                value={formData.otp}
                onChange={(e) => setFormData({...formData, otp: e.target.value})}
                maxLength={6}
                required
              />
            </div>

            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setOtpSent(false)}
                className="btn btn-outline flex-1"
              >
                Back
              </button>
              <button 
                type="submit" 
                className={`btn btn-primary flex-1 ${loading ? 'loading' : ''}`}
              >
                {loading ? 'Verifying...' : 'Login'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}