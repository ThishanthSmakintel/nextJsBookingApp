'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function VerifyOTP() {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [pendingBooking, setPendingBooking] = useState(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    const bookingData = sessionStorage.getItem('pendingBooking')
    
    if (emailParam) setEmail(emailParam)
    if (bookingData) setPendingBooking(JSON.parse(bookingData))
  }, [searchParams])

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Verify OTP
      const verifyRes = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: otp,
          fullName: pendingBooking?.fullName
        })
      })

      if (!verifyRes.ok) {
        throw new Error('Invalid OTP')
      }

      const { token } = await verifyRes.json()
      localStorage.setItem('token', token)

      // Complete booking
      if (pendingBooking) {
        const bookingRes = await fetch('/api/bookings/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            carId: pendingBooking.car.id,
            startTime: pendingBooking.startTime,
            endTime: pendingBooking.endTime,
            totalPrice: pendingBooking.totalPrice
          })
        })

        if (bookingRes.ok) {
          sessionStorage.removeItem('pendingBooking')
          router.push('/dashboard?success=booking-confirmed')
        } else {
          throw new Error('Booking failed')
        }
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body text-center">
          <h1 className="card-title justify-center text-2xl mb-4">Verify Your Email</h1>
          
          <p className="mb-6">
            We've sent a 6-digit code to<br/>
            <strong>{email}</strong>
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                className="input input-bordered w-full text-center text-2xl"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify & Complete Booking'}
            </button>
          </form>

          <div className="divider">Need help?</div>
          
          <button 
            className="btn btn-ghost btn-sm"
            onClick={() => router.back()}
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  )
}