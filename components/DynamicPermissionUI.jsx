'use client'
import { useState, useEffect } from 'react'
import { useAbility } from '@/contexts/AbilityContext'

export function PermissionButton({ action, subject, children, className = '', ...props }) {
  const { ability, version } = useAbility()
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    setIsEnabled(ability.can(action, subject))
  }, [ability, action, subject, version])

  useEffect(() => {
    const handlePermissionUpdate = () => {
      setIsEnabled(ability.can(action, subject))
    }

    window.addEventListener('permissions-changed', handlePermissionUpdate)
    return () => window.removeEventListener('permissions-changed', handlePermissionUpdate)
  }, [ability, action, subject])

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
  const { ability, version } = useAbility()
  const [isReadOnly, setIsReadOnly] = useState(true)

  useEffect(() => {
    setIsReadOnly(!ability.can(action, subject))
  }, [ability, action, subject, version])

  useEffect(() => {
    const handlePermissionUpdate = () => {
      setIsReadOnly(!ability.can(action, subject))
    }

    window.addEventListener('permissions-changed', handlePermissionUpdate)
    return () => window.removeEventListener('permissions-changed', handlePermissionUpdate)
  }, [ability, action, subject])

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
  const { ability, version } = useAbility()
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    setHasAccess(ability.can(action, subject))
  }, [ability, action, subject, version])

  useEffect(() => {
    const handlePermissionUpdate = () => {
      setHasAccess(ability.can(action, subject))
    }

    window.addEventListener('permissions-changed', handlePermissionUpdate)
    return () => window.removeEventListener('permissions-changed', handlePermissionUpdate)
  }, [ability, action, subject])

  if (!hasAccess) {
    return fallback
  }

  return children
}