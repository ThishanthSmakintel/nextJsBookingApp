'use client'
import { useState, useEffect } from 'react'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`toast toast-top toast-end z-50`}>
      <div className={`alert ${
        type === 'success' ? 'alert-success' : 
        type === 'error' ? 'alert-error' : 'alert-info'
      }`}>
        <span>{message}</span>
        <button className="btn btn-sm btn-ghost" onClick={onClose}>×</button>
      </div>
    </div>
  )
}

export default function DriverSchedule({ driverId }) {
  const [schedules, setSchedules] = useState(DAYS.map((_, index) => ({
    dayOfWeek: index,
    startTime: '09:00',
    endTime: '17:00',
    isActive: false
  })))
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
  }

  useEffect(() => {
    fetchSchedule()
  }, [driverId])

  const fetchSchedule = async () => {
    if (!driverId) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/drivers/schedule?driverId=${driverId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        const scheduleMap = {}
        data.forEach(schedule => {
          scheduleMap[schedule.dayOfWeek] = schedule
        })
        
        setSchedules(DAYS.map((_, index) => 
          scheduleMap[index] || {
            dayOfWeek: index,
            startTime: '09:00',
            endTime: '17:00',
            isActive: false
          }
        ))
      } else {
        const errorData = await response.json()
        showToast(errorData.error || 'Failed to fetch schedule', 'error')
      }
    } catch (error) {
      showToast('Error loading schedule', 'error')
    }
  }

  const updateSchedule = (dayIndex, field, value) => {
    setSchedules(prev => prev.map((schedule, index) => 
      index === dayIndex ? { ...schedule, [field]: value } : schedule
    ))
  }

  const saveSchedule = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/drivers/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ driverId, schedules })
      })
      
      if (response.ok) {
        showToast('Schedule updated successfully!', 'success')
      } else {
        const errorData = await response.json()
        showToast(errorData.error || 'Failed to update schedule', 'error')
      }
    } catch (error) {
      showToast('Error updating schedule', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
        <h2 className="card-title">Weekly Schedule</h2>
        
        <div className="space-y-4">
          {schedules.map((schedule, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-24">
                <label className="label cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={schedule.isActive}
                    onChange={(e) => updateSchedule(index, 'isActive', e.target.checked)}
                  />
                  <span className="label-text ml-2">{DAYS[index]}</span>
                </label>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="time"
                  className="input input-bordered input-sm"
                  value={schedule.startTime}
                  disabled={!schedule.isActive}
                  onChange={(e) => updateSchedule(index, 'startTime', e.target.value)}
                />
                <span className="self-center">to</span>
                <input
                  type="time"
                  className="input input-bordered input-sm"
                  value={schedule.endTime}
                  disabled={!schedule.isActive}
                  onChange={(e) => updateSchedule(index, 'endTime', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="card-actions justify-end">
          <button 
            className="btn btn-primary"
            onClick={saveSchedule}
            disabled={loading}
          >
            {loading && <span className="loading loading-spinner loading-sm"></span>}
            {loading ? 'Saving...' : 'Save Schedule'}
          </button>
        </div>
        </div>
      </div>
    </>
  )
}