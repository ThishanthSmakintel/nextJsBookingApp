'use client'
import { usePermissions } from '@/hooks/usePermissions'

export default function PermissionWrapper({ 
  resource, 
  action, 
  children, 
  fallback = null,
  showDisabled = true 
}) {
  const { hasPermission, role } = usePermissions()
  
  const hasAccess = role === 'ADMIN' || hasPermission(resource, action)

  if (!hasAccess && !showDisabled) {
    return fallback
  }

  if (!hasAccess && showDisabled) {
    return (
      <div className="relative">
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded">
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
            🔒 Access Denied
          </span>
        </div>
      </div>
    )
  }

  return children
}