'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DriverDashboard() {
  const [bookings, setBookings] = useState([])
  const [currentBooking, setCurrentBooking] = useState(null)
  const [driverInfo, setDriverInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [bookingsRes, driverRes] = await Promise.all([
        fetch('/api/driver/bookings'),
        fetch('/api/driver/profile')
      ])
      
      const bookingsData = await bookingsRes.json()
      const driverData = await driverRes.json()
      
      setBookings(bookingsData)
      setDriverInfo(driverData)
      setCurrentBooking(bookingsData.find(b => b.status === 'CONFIRMED'))
    } catch (error) {
      console.error('Failed to fetch driver data')
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await fetch(`/api/driver/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      fetchData()
    } catch (error) {
      console.error('Failed to update booking')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="loading loading-spinner loading-lg"></div></div>

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Driver Dashboard</a>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost">
              {driverInfo?.name}
            </label>
            <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Profile</a></li>
              <li><a onClick={logout}>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        {/* Current Booking */}
        {currentBooking && (
          <div className="alert alert-info mb-6">
            <div>
              <h3 className="font-bold">Current Booking</h3>
              <div className="text-xs">
                Customer: {currentBooking.customer?.fullName} | 
                Car: {currentBooking.car?.make} {currentBooking.car?.model} |
                Phone: {currentBooking.customer?.phone}
              </div>
            </div>
            <div className="flex-none">
              <button 
                className="btn btn-sm btn-success"
                onClick={() => updateBookingStatus(currentBooking.id, 'COMPLETED')}
              >
                Complete Trip
              </button>
            </div>
          </div>
        )}

        {/* Driver Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="stat bg-base-100 shadow">
            <div className="stat-title">Total Trips</div>
            <div className="stat-value text-primary">{bookings.length}</div>
          </div>
          <div className="stat bg-base-100 shadow">
            <div className="stat-title">Completed</div>
            <div className="stat-value text-success">
              {bookings.filter(b => b.status === 'COMPLETED').length}
            </div>
          </div>
          <div className="stat bg-base-100 shadow">
            <div className="stat-title">Current Car</div>
            <div className="stat-value text-sm">{driverInfo?.currentCar?.licensePlate}</div>
          </div>
          <div className="stat bg-base-100 shadow">
            <div className="stat-title">Status</div>
            <div className="stat-value text-sm">
              <span className={`badge ${driverInfo?.active ? 'badge-success' : 'badge-error'}`}>
                {driverInfo?.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">My Bookings</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Car</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Earnings</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td>{new Date(booking.startTime).toLocaleDateString()}</td>
                      <td>
                        <div>
                          <div className="font-bold">{booking.customer?.fullName}</div>
                          <div className="text-sm opacity-50">{booking.customer?.phone}</div>
                        </div>
                      </td>
                      <td>{booking.car?.make} {booking.car?.model}</td>
                      <td>
                        {Math.round((new Date(booking.endTime) - new Date(booking.startTime)) / (1000 * 60 * 60))}h
                      </td>
                      <td>
                        <span className={`badge ${
                          booking.status === 'CONFIRMED' ? 'badge-success' :
                          booking.status === 'PENDING' ? 'badge-warning' :
                          booking.status === 'CANCELLED' ? 'badge-error' : 'badge-info'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>${(booking.totalPrice * 0.7).toFixed(2)}</td>
                      <td>
                        {booking.status === 'CONFIRMED' && (
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                          >
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}