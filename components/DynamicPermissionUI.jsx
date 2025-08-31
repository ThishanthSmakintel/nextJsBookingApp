'use client'
import { useState, useEffect } from 'react'
import { useRealTimePermissions } from '@/contexts/RealTimePermissionContext'

export function PermissionButton({ action, subject, children, className = '', ...props }) {
  const { can } = useRealTimePermissions()
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    setIsEnabled(can(action, subject))
  }, [can, action, subject])

  useEffect(() => {
    const handlePermissionUpdate = () => {
      setIsEnabled(can(action, subject))
    }

    window.addEventListener('permissions-updated', handlePermissionUpdate)
    return () => window.removeEventListener('permissions-updated', handlePermissionUpdate)
  }, [can, action, subject])

  if (!isEnabled) {
    return (
      <button 
        disabled 
        className={`${className} opacity-50 cursor-not-allowed`}
        title={`Access denied: Cannot ${action} ${subject}`}
        {...props}
      >
        {children}
      </button>
    )
  }

  return (
    <button className={className} {...props}>
      {children}
    </button>
  )
}

export function PermissionForm({ action, subject, children, className = '' }) {
  const { can } = useRealTimePermissions()
  const [isReadOnly, setIsReadOnly] = useState(true)

  useEffect(() => {
    setIsReadOnly(!can(action, subject))
  }, [can, action, subject])

  useEffect(() => {
    const handlePermissionUpdate = () => {
      setIsReadOnly(!can(action, subject))
    }

    window.addEventListener('permissions-updated', handlePermissionUpdate)
    return () => window.removeEventListener('permissions-updated', handlePermissionUpdate)
  }, [can, action, subject])

  return (
    <div className={`${className} ${isReadOnly ? 'pointer-events-none opacity-60' : ''}`}>
      {isReadOnly && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded">
            Access Denied: Cannot {action} {subject}
          </div>
        </div>
      )}
      <div className={isReadOnly ? 'relative' : ''}>
        {children}
      </div>
    </div>
  )
}

export function PermissionSection({ action, subject, children, fallback = null }) {
  const { can } = useRealTimePermissions()
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    setHasAccess(can(action, subject))
  }, [can, action, subject])

  useEffect(() => {
    const handlePermissionUpdate = () => {
      setHasAccess(can(action, subject))
    }

    window.addEventListener('permissions-updated', handlePermissionUpdate)
    return () => window.removeEventListener('permissions-updated', handlePermissionUpdate)
  }, [can, action, subject])

  if (!hasAccess) {
    return fallback
  }

  return children
}