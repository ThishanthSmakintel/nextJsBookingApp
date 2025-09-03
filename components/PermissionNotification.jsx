'use client'
import { useState, useEffect } from 'react'

export default function PermissionNotification() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const timeouts = new Map()
    
    const handlePermissionUpdate = (event) => {
      const notification = {
        id: Date.now(),
        message: `Your permissions have been updated! You now have ${event.detail.permissions.length} permissions.`,
        type: 'success'
      }
      
      setNotifications(prev => [...prev, notification])
      
      // Auto remove after 5 seconds
      const timeoutId = setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id))
        timeouts.delete(notification.id)
      }, 5000)
      
      timeouts.set(notification.id, timeoutId)
    }

    window.addEventListener('permissions-updated', handlePermissionUpdate)
    
    return () => {
      window.removeEventListener('permissions-updated', handlePermissionUpdate)
      timeouts.forEach(timeoutId => clearTimeout(timeoutId))
      timeouts.clear()
    }
  }, [])

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="toast toast-top toast-end z-50">
      {notifications.map(notification => (
        <div key={notification.id} className="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{notification.message}</span>
          <button 
            className="btn btn-sm btn-ghost"
            onClick={() => removeNotification(notification.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}