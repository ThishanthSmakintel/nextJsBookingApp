'use client'
import { useState, useEffect } from 'react'
import { usePermissions } from '@/hooks/usePermissions'
import { Shield, Eye, Plus, Edit, Trash2, X } from 'lucide-react'

export default function PermissionTester() {
  const [isOpen, setIsOpen] = useState(false)
  const [updateCount, setUpdateCount] = useState(0)
  const { permissions, role, can } = usePermissions()
  
  useEffect(() => {
    const handleUpdate = () => {
      setUpdateCount(prev => prev + 1)
    }
    
    window.addEventListener('permissions-changed', handleUpdate)
    return () => window.removeEventListener('permissions-changed', handleUpdate)
  }, [])

  const testPermissions = [
    { resource: 'Driver', action: 'read', icon: Eye },
    { resource: 'Driver', action: 'create', icon: Plus },
    { resource: 'Driver', action: 'update', icon: Edit },
    { resource: 'Driver', action: 'delete', icon: Trash2 },
    { resource: 'Booking', action: 'read', icon: Eye },
    { resource: 'Booking', action: 'create', icon: Plus },
    { resource: 'Car', action: 'read', icon: Eye },
    { resource: 'User', action: 'read', icon: Eye }
  ]

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          className="btn btn-circle btn-primary shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <Shield className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <div className="card bg-base-100 shadow-xl border">
        <div className="card-body p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">Permission Tester</h3>
            <button 
              className="btn btn-ghost btn-xs"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-xs mb-3">
            <div className="badge badge-sm badge-primary">{role}</div>
            <div className="text-base-content/70 mt-1">
              {permissions.length} permissions
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {testPermissions.map(({ resource, action, icon: Icon }) => {
              const hasAccess = can(action, resource)
              return (
                <div 
                  key={`${resource}-${action}`}
                  className={`flex items-center gap-2 p-2 rounded text-xs ${
                    hasAccess ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="flex-1">{action} {resource}</span>
                  <span className="font-mono">
                    {hasAccess ? '✓' : '✗'}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="text-xs text-base-content/50 mt-2">
            Updates in real-time
          </div>
        </div>
      </div>
    </div>
  )
}