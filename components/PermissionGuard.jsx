'use client'
import { usePermissions } from '@/hooks/usePermissions'
import { Shield, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function PermissionGuard({ resource, action, children, fallback }) {
  const { hasPermission, loading, role } = usePermissions()
  const [forceShow, setForceShow] = useState(false)

  // Timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('PermissionGuard loading timeout, forcing show')
        setForceShow(true)
      }
    }, 5000) // 5 second timeout
    
    return () => clearTimeout(timeout)
  }, [loading])

  if (loading && !forceShow) {
    return (
      <div className="flex items-center justify-center p-4">
        <span className="loading loading-spinner loading-sm"></span>
      </div>
    )
  }

  // Admin users bypass all permission checks
  if (role === 'ADMIN') {
    return children
  }

  if (!hasPermission(resource, action)) {
    return fallback || (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <AlertTriangle className="w-16 h-16 mx-auto text-error mb-4" />
          <h2 className="card-title justify-center text-error">Access Denied</h2>
          <p className="text-base-content/70">
            You don't have permission to {action} {resource}.
          </p>
          <p className="text-sm text-base-content/50 mt-2">
            Contact your administrator to request access.
          </p>
        </div>
      </div>
    )
  }

  return children
}