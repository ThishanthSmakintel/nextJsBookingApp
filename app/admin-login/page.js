'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn, Globe, Sun, Moon, Eye, EyeOff } from 'lucide-react'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'
import { LocaleProvider, useLocale } from '@/contexts/LocaleContext'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageSelector from '@/components/LanguageSelector'

function AdminLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/admin')
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="absolute top-4 right-4 flex gap-2">
        <ThemeToggle />
      </div>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-4">
            <LogIn className="w-6 h-6 mr-2" />
            Admin Login
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="admin@carbook.com"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="input input-bordered w-full pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-error mt-4">
                <span>{error}</span>
              </div>
            )}

            <div className="form-control mt-6">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading && <span className="loading loading-spinner loading-sm"></span>}
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function AdminLogin() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AdminLoginForm />
      </LocaleProvider>
    </ThemeProvider>
  )
}