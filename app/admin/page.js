'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    totalCars: 0,
    availableCars: 0,
    totalCustomers: 0,
    totalDrivers: 0
  })
  const [bookings, setBookings] = useState([])
  const [cars, setCars] = useState([])
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
      const [bookingsRes, carsRes, statsRes] = await Promise.all([
        fetch('/api/admin/bookings'),
        fetch('/api/admin/cars'),
        fetch('/api/admin/stats')
      ])
      
      const bookingsData = await bookingsRes.json()
      const carsData = await carsRes.json()
      const statsData = await statsRes.json()
      
      setBookings(bookingsData)
      setCars(carsData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to fetch admin data')
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await fetch(`/api/admin/bookings/${bookingId}`, {
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
          <a className="btn btn-ghost text-xl">Admin Dashboard</a>
        </div>
        <div className="flex-none">
          <button className="btn btn-ghost" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="container mx-auto p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="stat bg-base-100 shadow">
            <div className="stat-title">Total Bookings</div>
            <div className="stat-value text-primary">{stats.totalBookings}</div>
          </div>
          <div className="stat bg-base-100 shadow">
            <div className="stat-title">Active Bookings</div>
            <div className="stat-value text-secondary">{stats.activeBookings}</div>
          </div>
          <div className="stat bg-base-100 shadow">
            <div className="stat-title">Total Cars</div>
            <div className="stat-value">{stats.totalCars}</div>
          </div>
          <div className="stat bg-base-100 shadow">
            <div className="stat-title">Available Cars</div>
            <div className="stat-value text-success">{stats.availableCars}</div>
          </div>
          <div className="stat bg-base-100 shadow">
            <div className="stat-title">Customers</div>
            <div className="stat-value">{stats.totalCustomers}</div>
          </div>
          <div className="stat bg-base-100 shadow">
            <div className="stat-title">Drivers</div>
            <div className="stat-value">{stats.totalDrivers}</div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Car</th>
                    <th>Start Date</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td>{booking.id.slice(-8)}</td>
                      <td>{booking.customer?.fullName}</td>
                      <td>{booking.car?.make} {booking.car?.model}</td>
                      <td>{new Date(booking.startTime).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${
                          booking.status === 'CONFIRMED' ? 'badge-success' :
                          booking.status === 'PENDING' ? 'badge-warning' :
                          booking.status === 'CANCELLED' ? 'badge-error' : 'badge-info'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>${booking.totalPrice}</td>
                      <td>
                        <div className="dropdown">
                          <label tabIndex={0} className="btn btn-sm">Actions</label>
                          <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}>Confirm</a></li>
                            <li><a onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}>Cancel</a></li>
                            <li><a onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}>Complete</a></li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cars Management */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Car Fleet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cars.map(car => (
                <div key={car.id} className="card bg-base-200 shadow">
                  <div className="card-body">
                    <h3 className="card-title text-sm">{car.make} {car.model}</h3>
                    <p className="text-xs">License: {car.licensePlate}</p>
                    <p className="text-xs">Location: {car.location?.name}</p>
                    <div className="card-actions justify-end">
                      <span className={`badge ${car.isActive ? 'badge-success' : 'badge-error'}`}>
                        {car.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}