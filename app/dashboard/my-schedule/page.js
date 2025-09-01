'use client'
import { useState, useEffect } from 'react'
import { Clock, Calendar } from 'lucide-react'

export default function MySchedule() {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMySchedule()
  }, [])

  const fetchMySchedule = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/driver/schedule', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setSchedule(data)
      }
    } catch (error) {
      console.error('Error fetching schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  if (loading) {
    return <div className="loading loading-spinner loading-lg"></div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Schedule</h1>
      
      <div className="grid gap-4">
        {days.map((day, index) => {
          const daySchedule = schedule.find(s => s.dayOfWeek === index)
          return (
            <div key={day} className="card bg-base-100 shadow">
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{day}</h3>
                  {daySchedule?.isActive ? (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{daySchedule.startTime} - {daySchedule.endTime}</span>
                      <div className="badge badge-success">Active</div>
                    </div>
                  ) : (
                    <div className="badge badge-ghost">Off</div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}