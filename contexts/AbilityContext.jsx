'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { defineAbilityFor } from '@/lib/casl'
import { useAuth } from '@/contexts/AuthContext'
import { usePermissionStore } from '@/stores/permissions'
import { useSocket } from '@/contexts/SocketContext'

const AbilityContext = createContext()

export const useAbility = () => {
  const context = useContext(AbilityContext)
  if (!context) {
    throw new Error('useAbility must be used within AbilityProvider')
  }
  return context
}

export const AbilityProvider = ({ children }) => {
  const { user } = useAuth()
  const { socket } = useSocket()
  const [ability, setAbility] = useState(() => defineAbilityFor(null, []))
  const [version, setVersion] = useState(0)
  const { permissions, loading, lastUpdate, initializePermissions, refreshPermissions, reset } = usePermissionStore()

  // Initialize permissions when user changes
  useEffect(() => {
    if (user?.id) {
      console.log('AbilityContext: User loaded, initializing permissions for:', user.id)
      // Small delay to ensure user is fully loaded
      setTimeout(() => {
        initializePermissions(user.id)
      }, 100)
    } else {
      console.log('AbilityContext: No user, resetting')
      reset()
    }
  }, [user?.id, initializePermissions, reset])

  // Listen for Socket.IO permission updates
  useEffect(() => {
    if (!socket || !user?.id) return

    const handlePermissionUpdate = (data) => {
      console.log('AbilityContext: Socket permission update received:', data)
      
      // Show notification
      const toast = document.createElement('div')
      toast.className = 'toast toast-top toast-end z-50'
      toast.innerHTML = `
        <div class="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>🔔 Your permissions have been updated! You now have ${data.permissions?.length || 'new'} permissions.</span>
          <button class="btn btn-sm btn-ghost" onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
      `
      document.body.appendChild(toast)
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast)
        }
      }, 5000)
      
      // Force refresh permissions from server
      usePermissionStore.getState().forceRefresh(user.id)
    }

    socket.on('permission_update', handlePermissionUpdate)
    return () => socket.off('permission_update', handlePermissionUpdate)
  }, [socket, user?.id, refreshPermissions])

  // Update ability when permissions change
  useEffect(() => {
    console.log('AbilityContext: Permissions changed, updating ability:', permissions.length, permissions)
    const userAbility = defineAbilityFor(user, permissions)
    setAbility(userAbility)
    
    // Force React re-render by updating version
    setVersion(prev => prev + 1)
    
    // Dispatch event for components that need it
    window.dispatchEvent(new Event('permissions-changed'))
  }, [user, permissions])

  return (
    <AbilityContext.Provider value={{ 
      ability, 
      permissions, 
      loading, 
      user, 
      lastUpdate,
      version,
      refreshPermissions: () => {
        console.log('AbilityContext: Manual refresh triggered')
        return refreshPermissions(user?.id)
      },
      forceRefresh: () => {
        console.log('AbilityContext: Force refresh triggered')
        return usePermissionStore.getState().forceRefresh(user?.id)
      }
    }}>
      {children}
    </AbilityContext.Provider>
  )
}