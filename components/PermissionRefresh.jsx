'use client'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function PermissionRefresh() {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    
    // Trigger permission refresh across tabs/windows
    const triggerRefresh = () => {
      localStorage.setItem('permissions_updated', Date.now().toString())
    }
    
    // Listen for permission updates from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'permissions_updated') {
        window.location.reload()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [user])

  return null
}