'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { io } from 'socket.io-client'

const PermissionContext = createContext()

export function PermissionProvider({ children }) {
  const [permissions, setPermissions] = useState([])
  const [socket, setSocket] = useState(null)
  const { user, token } = useAuth()

  useEffect(() => {
    if (user && token) {
      fetchPermissions()
      initSocket()
    }
  }, [user, token])

  const fetchPermissions = async () => {
    try {
      const response = await fetch('/api/auth/permissions', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setPermissions(data.permissions || [])
    } catch (error) {
      console.error('Failed to fetch permissions:', error)
    }
  }

  const initSocket = () => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      auth: { token }
    })

    newSocket.on('connect', () => {
      newSocket.emit('join_room', `user_${user.id}`)
    })

    newSocket.on('permissions_updated', (data) => {
      setPermissions(data.permissions)
    })

    setSocket(newSocket)

    return () => newSocket.close()
  }

  const hasPermission = (resource, action) => {
    if (user?.role === 'ADMIN') return true
    return permissions.includes(`${resource}:${action}`)
  }

  return (
    <PermissionContext.Provider value={{ permissions, hasPermission, fetchPermissions }}>
      {children}
    </PermissionContext.Provider>
  )
}

export const usePermissions = () => {
  const context = useContext(PermissionContext)
  if (!context) {
    throw new Error('usePermissions must be used within PermissionProvider')
  }
  return context
}