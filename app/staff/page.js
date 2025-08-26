'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StaffDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/staff/bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await res.json()
      setBookings(data)
    } catch (error) {
      console.error('Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await fetch(`/api/staff/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      })
      fetchBookings()
    } catch (error) {
      console.error('Failed to update booking')
    }
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="loading loading-spinner loading-lg"></div></div>

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Staff Dashboard</a>
        </div>
        <div className="flex-none">
          <button className="btn btn-ghost" onClick={() => {
            localStorage.removeItem('token')
            router.push('/')
          }}>
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Vehicle Preparation & Handovers</h1>

        <div className="grid gap-4">
          {bookings.map(booking => (
            <div key={booking.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title">
                      {booking.car?.make} {booking.car?.model}
                      <span className={`badge ${
                        booking.status === 'CONFIRMED' ? 'badge-warning' :
                        booking.status === 'ACTIVE' ? 'badge-success' :
                        booking.status === 'COMPLETED' ? 'badge-info' : 'badge-error'
                      }`}>
                        {booking.status}
                      </span>
                    </h2>
                    <p>License: {booking.car?.licensePlate}</p>
                    <p>Customer: {booking.customer?.fullName}</p>
                    <p>Email: {booking.customer?.email}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">${booking.totalPrice}</div>
                    <div className="text-sm opacity-70">
                      {new Date(booking.startTime).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="card-actions justify-end mt-4">
                  {booking.status === 'CONFIRMED' && (
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={() => updateBookingStatus(booking.id, 'ACTIVE')}
                    >
                      Start Trip (Handover)
                    </button>
                  )}
                  {booking.status === 'ACTIVE' && (
                    <button 
                      className="btn btn-info btn-sm"
                      onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                    >
                      Complete Trip (Return)
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl mb-4">No bookings assigned</h2>
            <p>New bookings will appear here automatically</p>
          </div>
        )}
      </div>
    </div>
  )
}