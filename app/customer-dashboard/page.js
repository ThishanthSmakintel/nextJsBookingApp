'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Calendar, Car, CreditCard, Clock, MapPin, User, Mail, Shield } from 'lucide-react'
import { format } from 'date-fns'

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect non-customers
    if (user && user.role !== 'CUSTOMER' && user.role !== 'customer') {
      router.push('/dashboard')
      return
    }
    
    if (!user) {
      router.push('/login')
      return
    }

    fetchBookings()
  }, [user, router])

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/user/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setBookings(data.slice(0, 3))
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'badge-warning'
      case 'CONFIRMED': return 'badge-success'
      case 'CANCELLED': return 'badge-error'
      default: return 'badge-neutral'
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-96"><span className="loading loading-spinner loading-lg"></span></div>
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-2xl text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name || user?.fullName}! 👋</h1>
        <p className="text-white/80 text-lg">Ready to book your next ride?</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl">
          <div className="stat-figure text-blue-600">
            <Calendar className="w-10 h-10" />
          </div>
          <div className="stat-title text-blue-800">Total Bookings</div>
          <div className="stat-value text-blue-900">{bookings.length}</div>
          <div className="stat-desc text-blue-600">All time</div>
        </div>
        
        <div className="stat bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl">
          <div className="stat-figure text-green-600">
            <Car className="w-10 h-10" />
          </div>
          <div className="stat-title text-green-800">Active Bookings</div>
          <div className="stat-value text-green-900">
            {bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length}
          </div>
          <div className="stat-desc text-green-600">Current</div>
        </div>
        
        <div className="stat bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl">
          <div className="stat-figure text-purple-600">
            <CreditCard className="w-10 h-10" />
          </div>
          <div className="stat-title text-purple-800">Total Spent</div>
          <div className="stat-value text-purple-900">
            ${bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)}
          </div>
          <div className="stat-desc text-purple-600">All time</div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card bg-base-100 shadow-xl border-0">
        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              Recent Bookings
            </h2>
            <button 
              onClick={() => router.push('/bookings')}
              className="btn btn-primary btn-sm gap-2"
            >
              View All
              <Calendar className="w-4 h-4" />
            </button>
          </div>
          
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Car className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
              <p className="text-base-content/70 mb-6">Start your journey by booking your first car</p>
              <button 
                onClick={() => router.push('/search')}
                className="btn btn-primary btn-lg gap-2"
              >
                <Car className="w-5 h-5" />
                Book Your First Car
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-base-200 to-base-300 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Car className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{booking.car?.make} {booking.car?.model}</p>
                      <div className="flex items-center gap-4 text-sm text-base-content/70">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {booking.startTime ? format(new Date(booking.startTime), 'dd MMM yyyy') : 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {booking.startTime ? format(new Date(booking.startTime), 'HH:mm') : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`badge badge-lg ${getStatusColor(booking.status)} mb-2`}>
                      {booking.status}
                    </div>
                    <p className="text-lg font-bold text-success">${booking.totalPrice || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions & Account Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl border-0">
          <div className="card-body">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Car className="w-5 h-5 text-primary" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/search')}
                className="btn btn-primary w-full btn-lg gap-3 hover:scale-105 transition-transform"
              >
                <Car className="w-5 h-5" />
                Book a New Car
              </button>
              <button 
                onClick={() => router.push('/bookings')}
                className="btn btn-outline w-full btn-lg gap-3 hover:scale-105 transition-transform"
              >
                <Calendar className="w-5 h-5" />
                View All Bookings
              </button>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl border-0">
          <div className="card-body">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Account Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-base-content/70">Full Name</p>
                  <p className="font-semibold">{user?.name || user?.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-base-content/70">Email Address</p>
                  <p className="font-semibold">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-base-content/70">Account Type</p>
                  <p className="font-semibold">Premium Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}