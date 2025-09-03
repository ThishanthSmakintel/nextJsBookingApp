'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = res.headers.get('content-type')?.includes('application/json') 
        ? await res.json() 
        : { error: 'Invalid response format' }

      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/dashboard')
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card bg-base-100 shadow-2xl">
      <div className="card-body">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-primary">🎉 Join CarBook</h2>
          <p className="text-base-content/70">Create your account to start booking</p>
        </div>
        
        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">👤 Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="input input-bordered input-primary"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">📱 Phone</span>
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="input input-bordered input-primary"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">📧 Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="input input-bordered input-primary"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">🔒 Password</span>
            </label>
            <input
              type="password"
              placeholder="Create a secure password"
              className="input input-bordered input-primary"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <div className="form-control">
            <label className="cursor-pointer label">
              <input type="checkbox" className="checkbox checkbox-primary" required />
              <span className="label-text ml-2">I agree to the Terms of Service and Privacy Policy</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading && <span className="loading loading-spinner loading-sm"></span>}
            {loading ? 'Creating Account...' : '🚀 Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}