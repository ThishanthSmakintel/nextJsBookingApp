'use client'
import { usePermissions } from '@/hooks/usePermissions'

export default function PermissionButton({ 
  resource, 
  action, 
  children, 
  className = '', 
  onClick,
  disabled = false,
  ...props 
}) {
  const { hasPermission, role } = usePermissions()
  
  const hasAccess = role === 'ADMIN' || hasPermission(resource, action)
  const isDisabled = disabled || !hasAccess

  return (
    <button
      className={`${className} ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={hasAccess ? onClick : undefined}
      disabled={isDisabled}
      title={!hasAccess ? `Access denied - need ${action} permission for ${resource}` : ''}
      {...props}
    >
      {children}
      {!hasAccess && <span className="ml-2 text-xs">🔒</span>}
    </button>
  )
}