'use client'
import { useAuth } from '@/contexts/AuthContext'
import DriverSchedule from '@/components/DriverSchedule'

export default function DriverSchedulePage() {
  const { user } = useAuth()

  if (!user || user.role !== 'driver') {
    return <div className="text-center p-8">Access denied</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Schedule</h1>
      <DriverSchedule driverId={user.driverId} />
    </div>
  )
}