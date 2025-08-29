'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import DriverSchedule from '@/components/DriverSchedule'

export default function AdminDriverSchedulePage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(searchParams.get('driverId') || '')

  useEffect(() => {
    fetchDrivers()
    const driverId = searchParams.get('driverId')
    if (driverId) {
      setSelectedDriver(driverId)
    }
  }, [searchParams])

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/drivers', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setDrivers(data)
      }
    } catch (error) {
      console.error('Failed to fetch drivers:', error)
    }
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
    return <div className="text-center p-8">Access denied</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Driver Schedules</h1>
      
      <div className="mb-6">
        <select 
          className="select select-bordered w-full max-w-xs"
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
        >
          <option value="">Select a driver</option>
          {drivers.map(driver => (
            <option key={driver.id} value={driver.id}>
              {driver.name} - {driver.licenseNumber}
            </option>
          ))}
        </select>
      </div>

      {selectedDriver && (
        <DriverSchedule driverId={selectedDriver} isAdmin={true} />
      )}
    </div>
  )
}