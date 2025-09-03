'use client'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function PermissionRefresh() {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    
    // Permission refresh is handled by storage event listener
    
    // Listen for permission updates from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'permissions_updated') {
        // Instead of full page reload, navigate to current path
        if (typeof window !== 'undefined') {
          window.location.href = window.location.pathname
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [user])

  return null
}