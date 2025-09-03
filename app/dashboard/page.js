'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import QuickActions from '@/components/admin/QuickActions'
import PermissionWrapper from '@/components/PermissionWrapper'
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates'
import { LayoutDashboard, Users, Car, Calendar, DollarSign } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({ bookings: 0, users: 0, cars: 0, revenue: 0 })
  const [recentActivity, setRecentActivity] = useState([])

  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useRealTimeUpdates({
    onBookingUpdate: (data) => {
      setRecentActivity(prev => [{
        id: Date.now(),
        message: `Booking ${data.type.split('.')[1]}`,
        time: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 4)])
    }
  })

  useEffect(() => {
    setLoading(false)
  }, [user])

  if (loading) {
    return <div className="flex justify-center items-center min-h-96"><span className="loading loading-spinner loading-lg"></span></div>
  }

  // Admin/Staff Dashboard
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <LayoutDashboard className="w-8 h-8" />
          Dashboard
        </h1>
        <p className="text-base-content/70 mt-1">Overview of your car booking system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat bg-base-100 shadow">
          <div className="stat-figure text-primary">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Bookings</div>
          <div className="stat-value">{stats.bookings}</div>
        </div>
        
        <div className="stat bg-base-100 shadow">
          <div className="stat-figure text-secondary">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title">Active Users</div>
          <div className="stat-value">{stats.users}</div>
        </div>
        
        <div className="stat bg-base-100 shadow">
          <div className="stat-figure text-accent">
            <Car className="w-8 h-8" />
          </div>
          <div className="stat-title">Available Cars</div>
          <div className="stat-value">{stats.cars}</div>
        </div>
        
        <div className="stat bg-base-100 shadow">
          <div className="stat-figure text-success">
            <DollarSign className="w-8 h-8" />
          </div>
          <div className="stat-title">Revenue</div>
          <div className="stat-value">${stats.revenue}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PermissionWrapper resource="dashboard" action="read" showDisabled={false} fallback={
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Access Restricted</h3>
              <p className="text-sm text-base-content/70">You don't have permission to access quick actions.</p>
            </div>
          </div>
        }>
          <QuickActions />
        </PermissionWrapper>
        
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-base-content/70">No recent activity</p>
              ) : (
                recentActivity.map(activity => (
                  <div key={activity.id} className="flex justify-between text-sm">
                    <span>{activity.message}</span>
                    <span className="text-base-content/50">{activity.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}