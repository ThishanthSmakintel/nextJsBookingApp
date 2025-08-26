'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [stats, setStats] = useState({ totalBookings: 0, activeBookings: 0, completedBookings: 0 })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (!userData || !token) {
      router.push('/login')
      return
    }
    
    setUser(JSON.parse(userData))

    const fetchData = async () => {
      try {
        const res = await fetch('/api/user/bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        const bookings = await res.json()
        setRecentBookings(bookings.slice(0, 3))
        
        setStats({
          totalBookings: bookings.length,
          activeBookings: bookings.filter(b => ['PENDING', 'CONFIRMED'].includes(b.status)).length,
          completedBookings: bookings.filter(b => b.status === 'COMPLETED').length
        })
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">👋 Welcome back, {user.fullName}!</h1>
          <p className="text-base-content/70 mt-2">Manage your car bookings and account</p>
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a href="/profile">👤 Profile</a></li>
            <li><a href="/bookings">📅 My Bookings</a></li>
            <li><a onClick={handleLogout}>🚪 Logout</a></li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat bg-gradient-to-r from-primary to-primary-focus text-primary-content rounded-2xl shadow-xl">
          <div className="stat-figure text-primary-content/50">
            <div className="text-3xl">📊</div>
          </div>
          <div className="stat-title text-primary-content/80">Total Bookings</div>
          <div className="stat-value">{stats.totalBookings}</div>
          <div className="stat-desc text-primary-content/60">All time bookings</div>
        </div>

        <div className="stat bg-gradient-to-r from-secondary to-secondary-focus text-secondary-content rounded-2xl shadow-xl">
          <div className="stat-figure text-secondary-content/50">
            <div className="text-3xl">⚡</div>
          </div>
          <div className="stat-title text-secondary-content/80">Active Bookings</div>
          <div className="stat-value">{stats.activeBookings}</div>
          <div className="stat-desc text-secondary-content/60">Pending & confirmed</div>
        </div>

        <div className="stat bg-gradient-to-r from-accent to-accent-focus text-accent-content rounded-2xl shadow-xl">
          <div className="stat-figure text-accent-content/50">
            <div className="text-3xl">✅</div>
          </div>
          <div className="stat-title text-accent-content/80">Completed</div>
          <div className="stat-value">{stats.completedBookings}</div>
          <div className="stat-desc text-accent-content/60">Successfully completed</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">📅 Recent Bookings</h2>
            {recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🚗</div>
                <p className="text-base-content/70">No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex justify-between items-center p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
                    <div>
                      <p className="font-semibold">{booking.car.make} {booking.car.model}</p>
                      <p className="text-sm text-base-content/70">{new Date(booking.startTime).toLocaleDateString()}</p>
                    </div>
                    <div className={`badge ${
                      booking.status === 'CONFIRMED' ? 'badge-success' : 
                      booking.status === 'PENDING' ? 'badge-warning' : 
                      booking.status === 'COMPLETED' ? 'badge-info' : 'badge-error'
                    }`}>
                      {booking.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="card-actions justify-end">
              <a href="/bookings" className="btn btn-primary btn-sm">View All Bookings</a>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">🚀 Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <a href="/" className="btn btn-outline btn-lg">
                <div className="text-2xl mr-2">🔍</div>
                <div className="text-left">
                  <div className="font-bold">Search Cars</div>
                  <div className="text-xs opacity-70">Find available vehicles</div>
                </div>
              </a>
              <a href="/bookings" className="btn btn-outline btn-lg">
                <div className="text-2xl mr-2">📋</div>
                <div className="text-left">
                  <div className="font-bold">My Bookings</div>
                  <div className="text-xs opacity-70">View booking history</div>
                </div>
              </a>
              <button className="btn btn-outline btn-lg">
                <div className="text-2xl mr-2">💬</div>
                <div className="text-left">
                  <div className="font-bold">Support</div>
                  <div className="text-xs opacity-70">Get help & assistance</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}