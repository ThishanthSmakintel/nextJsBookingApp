'use client'
import { useState } from 'react'
import { usePermissions } from '@/hooks/usePermissions'
import { Shield, Check, X, Eye, EyeOff } from 'lucide-react'

export default function RBACStatus() {
  const [isOpen, setIsOpen] = useState(false)
  const { permissions, role, hasPermission } = usePermissions()

  const protectedResources = [
    { resource: 'bookings', actions: ['create', 'read', 'update', 'delete'], label: 'Bookings' },
    { resource: 'cars', actions: ['create', 'read', 'update', 'delete'], label: 'Cars' },
    { resource: 'customers', actions: ['create', 'read', 'update', 'delete'], label: 'Customers' },
    { resource: 'drivers', actions: ['create', 'read', 'update', 'delete'], label: 'Drivers' },
    { resource: 'staff', actions: ['create', 'read', 'update', 'delete'], label: 'Staff' },
    { resource: 'reports', actions: ['read'], label: 'Reports' },
    { resource: 'maintenance', actions: ['create', 'read', 'update'], label: 'Maintenance' },
    { resource: 'leaves', actions: ['create', 'read', 'update'], label: 'Leave Management' }
  ]

  if (!isOpen) {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <button 
          className="btn btn-circle btn-accent shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <Shield className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 w-96 bg-base-100 shadow-xl border rounded-lg max-h-80 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" />
            RBAC Protection Status
          </h3>
          <button 
            className="btn btn-ghost btn-xs"
            onClick={() => setIsOpen(false)}
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-xs mb-3">
          <div className="badge badge-sm badge-primary">{role}</div>
          <div className="text-base-content/70 mt-1">
            {permissions.length} active permissions
          </div>
        </div>

        <div className="space-y-2">
          {protectedResources.map(({ resource, actions, label }) => (
            <div key={resource} className="border rounded p-2">
              <div className="font-semibold text-xs mb-1">{label}</div>
              <div className="grid grid-cols-4 gap-1">
                {actions.map(action => {
                  const hasAccess = role === 'ADMIN' || hasPermission(resource, action)
                  return (
                    <div 
                      key={action}
                      className={`text-xs px-1 py-0.5 rounded flex items-center gap-1 ${
                        hasAccess ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                      }`}
                    >
                      {hasAccess ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {action.charAt(0).toUpperCase()}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-base-content/50 mt-3 text-center">
          🔒 All components are RBAC protected
        </div>
      </div>
    </div>
  )
}