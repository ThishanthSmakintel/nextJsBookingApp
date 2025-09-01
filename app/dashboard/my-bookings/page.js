'use client'
import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, User } from 'lucide-react'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyBookings()
  }, [])

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/driver/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading loading-spinner loading-lg"></div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Bookings</h1>
      
      <div className="grid gap-4">
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No bookings assigned yet</p>
          </div>
        ) : (
          bookings.map(booking => (
            <div key={booking.id} className="card bg-base-100 shadow">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{booking.car?.make} {booking.car?.model}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <User className="w-4 h-4" />
                      {booking.customer?.fullName}
                    </div>
                  </div>
                  <div className={`badge ${booking.status === 'CONFIRMED' ? 'badge-success' : 'badge-warning'}`}>
                    {booking.status}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(booking.startTime).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {booking.pickupLocation}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}