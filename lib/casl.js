import { AbilityBuilder, createMongoAbility } from '@casl/ability'

// Module to subject mapping
const MODULE_MAPPING = {
  'bookings': 'Booking',
  'cars': 'Car', 
  'customers': 'Customer',
  'drivers': 'Driver',
  'staff': 'User',
  'reports': 'Report',
  'rbac': 'Permission',
  'locations': 'Location',
  'pricing': 'Pricing'
}

export function defineAbilityFor(user, permissions = []) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility)

  if (!user) {
    // No user, no permissions
    cannot('manage', 'all')
  } else if (user.role === 'ADMIN') {
    // Admin has full access to everything
    can('manage', 'all')
  } else if (user.role === 'STAFF') {
    // Staff permissions based on database
    permissions.forEach(permission => {
      try {
        const [module, action] = permission.split(':')
        const subject = MODULE_MAPPING[module] || module
        
        // Map actions to CASL actions
        const actionMap = {
          'create': 'create',
          'read': 'read', 
          'update': 'update',
          'delete': 'delete'
        }
        
        const caslAction = actionMap[action] || action
        can(caslAction, subject)
      } catch (error) {
        console.error('Error processing permission:', permission, error)
      }
    })
  } else {
    // Unknown role, no permissions
    cannot('manage', 'all')
  }

  return build()
}

export { MODULE_MAPPING }