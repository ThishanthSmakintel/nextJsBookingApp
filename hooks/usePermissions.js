'use client'
import { useAbility } from '@/contexts/AbilityContext'

export function usePermissions() {
  const { ability, permissions, loading, user, lastUpdate, refreshPermissions } = useAbility()

  const can = (action, subject) => {
    try {
      if (!ability) return false
      return ability.can(action, subject)
    } catch (error) {
      console.error('CASL can error:', error)
      return false
    }
  }

  const cannot = (action, subject) => {
    try {
      if (!ability) return true
      return ability.cannot(action, subject)
    } catch (error) {
      console.error('CASL cannot error:', error)
      return true
    }
  }

  const hasPermission = (resource, action) => {
    if (!user) return false
    if (user.role === 'ADMIN') return true
    return permissions.includes(`${resource}:${action}`)
  }

  return { 
    ability, 
    can, 
    cannot, 
    hasPermission, 
    permissions, 
    loading, 
    role: user?.role,
    lastUpdate,
    refreshPermissions
  }
}