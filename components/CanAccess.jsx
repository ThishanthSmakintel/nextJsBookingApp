'use client'
import { useAbility } from '@/contexts/AbilityContext'
import { AlertTriangle } from 'lucide-react'

export default function CanAccess({ action, subject, children, fallback }) {
  const { ability } = useAbility()
  
  const canAccess = ability ? ability.can(action, subject) : false
  
  if (!canAccess) {
    return fallback || (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <AlertTriangle className="w-16 h-16 mx-auto text-error mb-4" />
          <h2 className="card-title justify-center text-error">Access Denied</h2>
          <p className="text-base-content/70">
            You don't have permission to {action} {subject}.
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