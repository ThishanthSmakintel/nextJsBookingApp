'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Car, Calendar, MapPin, Clock, CreditCard } from 'lucide-react'
import { format } from 'date-fns'
import Breadcrumb from '@/components/Breadcrumb'

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const res = await fetch('/api/user/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (res.ok) {
          const data = await res.json()
          setBookings(data)
        } else {
          setBookings([])
        }
      } catch (error) {
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [router])

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'badge-warning'
      case 'CONFIRMED': return 'badge-success'
      case 'CANCELLED': return 'badge-error'
      default: return 'badge-neutral'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Breadcrumb items={[
        { label: 'My Bookings' }
      ]} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold flex items-center">
          <Calendar className="w-10 h-10 mr-3" />
          My Bookings
        </h1>
        <div className="badge badge-primary badge-lg">{bookings.length} bookings</div>
      </div>

      {bookings.length === 0 ? (
        <div className="hero min-h-96">
          <div className="hero-content text-center">
            <div>
              <Car className="w-24 h-24 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold mb-2">No bookings found</h2>
              <p className="text-base-content/70 mb-4">You haven't made any bookings yet</p>
              <button 
                onClick={() => router.push('/search')}
                className="btn btn-primary"
              >
                Book Your First Car
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                      <Car className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{booking.car.make} {booking.car.model}</h3>
                      <p className="text-sm text-gray-600">{booking.car.year} • {booking.car.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`badge badge-lg ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </div>
                  </div>
                </div>

                <div className="divider my-4"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-medium">
                        {booking.startTime ? format(new Date(booking.startTime), 'dd/MM/yyyy') : 'N/A'} - {booking.endTime ? format(new Date(booking.endTime), 'dd/MM/yyyy') : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="font-medium">
                        {booking.startTime ? format(new Date(booking.startTime), 'HH:mm') : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium">{booking.car.location?.name || 'Main Location'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="font-bold text-lg text-green-600">${booking.totalPrice}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Booked on {booking.createdAt ? format(new Date(booking.createdAt), 'dd/MM/yyyy') : 'N/A'}
                  </div>
                  <div className="text-sm font-medium">
                    Booking ID: {booking.id.slice(-8).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}