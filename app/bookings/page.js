'use client'
import { useState, useEffect } from 'react'

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token')
      
      try {
        const res = await fetch('/api/user/bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        const data = await res.json()
        setBookings(data)
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'badge-warning'
      case 'CONFIRMED': return 'badge-success'
      case 'CANCELLED': return 'badge-error'
      case 'COMPLETED': return 'badge-info'
      default: return 'badge-neutral'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return '⏳'
      case 'CONFIRMED': return '✅'
      case 'CANCELLED': return '❌'
      case 'COMPLETED': return '🏁'
      default: return '❓'
    }
  }

  const filteredBookings = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">📅 My Bookings</h1>
        <div className="badge badge-primary badge-lg">{filteredBookings.length} bookings</div>
      </div>
      
      <div className="tabs tabs-boxed mb-6">
        <a className={`tab ${filter === 'all' ? 'tab-active' : ''}`} onClick={() => setFilter('all')}>
          All ({bookings.length})
        </a>
        <a className={`tab ${filter === 'PENDING' ? 'tab-active' : ''}`} onClick={() => setFilter('PENDING')}>
          ⏳ Pending ({bookings.filter(b => b.status === 'PENDING').length})
        </a>
        <a className={`tab ${filter === 'CONFIRMED' ? 'tab-active' : ''}`} onClick={() => setFilter('CONFIRMED')}>
          ✅ Confirmed ({bookings.filter(b => b.status === 'CONFIRMED').length})
        </a>
        <a className={`tab ${filter === 'COMPLETED' ? 'tab-active' : ''}`} onClick={() => setFilter('COMPLETED')}>
          🏁 Completed ({bookings.filter(b => b.status === 'COMPLETED').length})
        </a>
      </div>
      
      {filteredBookings.length === 0 ? (
        <div className="hero min-h-96">
          <div className="hero-content text-center">
            <div>
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-bold mb-2">No bookings found</h2>
              <p className="text-base-content/70 mb-4">Start by booking your first car</p>
              <a href="/" className="btn btn-primary">🔍 Search Cars</a>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="card-title text-2xl">
                        {booking.car.make} {booking.car.model}
                      </h2>
                      <div className={`badge ${getStatusColor(booking.status)} gap-2`}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="badge badge-outline">📍 {booking.car.location.name}</div>
                      <div className="badge badge-outline">🚗 {booking.car.category}</div>
                      <div className="badge badge-outline">💰 {booking.pricingMode}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">${booking.totalPrice}</div>
                    <div className="text-sm text-base-content/70">Total Cost</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-title">📅 Start Date</div>
                    <div className="stat-value text-lg">{new Date(booking.startTime).toLocaleDateString()}</div>
                    <div className="stat-desc">{new Date(booking.startTime).toLocaleTimeString()}</div>
                  </div>
                  
                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-title">📅 End Date</div>
                    <div className="stat-value text-lg">{new Date(booking.endTime).toLocaleDateString()}</div>
                    <div className="stat-desc">{new Date(booking.endTime).toLocaleTimeString()}</div>
                  </div>
                </div>
                
                {booking.driver && (
                  <div className="alert alert-info mt-4">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">👨‍✈️</div>
                      <div>
                        <div className="font-bold">Driver Assigned: {booking.driver.name}</div>
                        <div className="text-sm">📞 {booking.driver.phone}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="card-actions justify-end mt-4">
                  {booking.status === 'PENDING' && (
                    <button className="btn btn-error btn-outline">❌ Cancel</button>
                  )}
                  <button className="btn btn-primary btn-outline">📋 View Details</button>
                  <button className="btn btn-secondary">💬 Contact Support</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}