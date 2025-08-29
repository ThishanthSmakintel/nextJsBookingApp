'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { defineAbilityFor } from '@/lib/casl'
import { useAuth } from '@/contexts/AuthContext'

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
  const [ability, setAbility] = useState(() => defineAbilityFor(null, []))
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPermissions = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/permissions', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        const userPermissions = data.permissions || []
        setPermissions(userPermissions)
        
        // Create ability with permissions
        const userAbility = defineAbilityFor(user, userPermissions)
        setAbility(userAbility)
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPermissions()
  }, [user])

  useEffect(() => {
    if (!user) return
    
    // Listen for permission updates
    const handlePermissionUpdate = () => {
      const userPermissions = localStorage.getItem(`permissions_${user.id}`)
      if (userPermissions) {
        const perms = JSON.parse(userPermissions)
        setPermissions(perms)
        const userAbility = defineAbilityFor(user, perms)
        setAbility(userAbility)
        console.log('Ability updated:', perms)
        // Force re-render
        window.dispatchEvent(new Event('permissions-changed'))
      }
    }
    
    const handleStorageChange = (e) => {
      if (e.key === `permissions_${user.id}` || e.key === 'permissions_updated') {
        handlePermissionUpdate()
      }
    }
    
    const handlePermissionChange = () => {
      handlePermissionUpdate()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('permissions-changed', handlePermissionChange)
    const interval = setInterval(handlePermissionUpdate, 500)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('permissions-changed', handlePermissionChange)
      clearInterval(interval)
    }
  }, [user])

  return (
    <AbilityContext.Provider value={{ ability, permissions, loading, user }}>
      {children}
    </AbilityContext.Provider>
  )
}