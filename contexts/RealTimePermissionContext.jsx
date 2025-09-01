'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { defineAbilityFor } from '@/lib/casl'
import { io } from 'socket.io-client'

const RealTimePermissionContext = createContext()

export function RealTimePermissionProvider({ children }) {
  const [permissions, setPermissions] = useState([])
  const [ability, setAbility] = useState(() => defineAbilityFor(null, []))
  const [socket, setSocket] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()

  useEffect(() => {
    if (user && token) {
      initSocket()
      fetchPermissions()
    } else {
      setPermissions([])
      setAbility(defineAbilityFor(null, []))
      setLoading(false)
    }
  }, [user, token])

  const initSocket = () => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      auth: { token }
    })

    newSocket.on('connect', () => {
      console.log('Connected to real-time permissions')
    })

    newSocket.on('permission_update', (data) => {
      console.log('🔔 Permission update received:', data)
      console.log('📋 New permissions:', data.permissions)
      updatePermissions(data.permissions)
      
      // Show immediate notification
      const toast = document.createElement('div')
      toast.className = 'toast toast-top toast-end z-50'
      toast.innerHTML = `
        <div class="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Your permissions have been updated! You now have ${data.permissions.length} permissions.</span>
        </div>
      `
      document.body.appendChild(toast)
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast)
        }
      }, 5000)
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from real-time permissions')
    })

    setSocket(newSocket)

    return () => newSocket.close()
  }

  const fetchPermissions = async () => {
    try {
      const response = await fetch('/api/user/permissions', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        updatePermissions(data.permissions || [])
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const updatePermissions = (newPermissions) => {
    setPermissions(newPermissions)
    const newAbility = defineAbilityFor(user, newPermissions)
    setAbility(newAbility)
    
    // Trigger UI updates
    window.dispatchEvent(new CustomEvent('permissions-updated', {
      detail: { permissions: newPermissions, ability: newAbility }
    }))
  }

  const can = (action, subject) => {
    return ability.can(action, subject)
  }

  const cannot = (action, subject) => {
    return ability.cannot(action, subject)
  }

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [socket])

  return (
    <RealTimePermissionContext.Provider value={{
      permissions,
      ability,
      can,
      cannot,
      loading,
      fetchPermissions
    }}>
      {children}
    </RealTimePermissionContext.Provider>
  )
}

export const useRealTimePermissions = () => {
  const context = useContext(RealTimePermissionContext)
  if (!context) {
    throw new Error('useRealTimePermissions must be used within RealTimePermissionProvider')
  }
  return context
}