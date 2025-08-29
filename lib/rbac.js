import prisma from './db'

// Default permissions for each role
const DEFAULT_PERMISSIONS = {
  ADMIN: [
    // Full access to everything
    'bookings:create', 'bookings:read', 'bookings:update', 'bookings:delete',
    'cars:create', 'cars:read', 'cars:update', 'cars:delete',
    'customers:create', 'customers:read', 'customers:update', 'customers:delete',
    'drivers:create', 'drivers:read', 'drivers:update', 'drivers:delete',
    'staff:create', 'staff:read', 'staff:update', 'staff:delete',
    'locations:create', 'locations:read', 'locations:update', 'locations:delete',
    'settings:create', 'settings:read', 'settings:update', 'settings:delete',
    'reports:read', 'rbac:create', 'rbac:read', 'rbac:update', 'rbac:delete'
  ],
  STAFF: [
    // Basic operations, customizable via RBAC
    'bookings:create', 'bookings:read', 'bookings:update',
    'cars:read', 'customers:read', 'drivers:read'
  ],
  DRIVER: [
    // Driver-specific permissions
    'bookings:read', 'schedule:read', 'schedule:update'
  ],
  CUSTOMER: [
    // Customer-specific permissions
    'bookings:create', 'bookings:read', 'cars:read'
  ]
}

export async function checkPermission(userId, resource, action) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        permissions: {
          include: { permission: true },
          where: { granted: true }
        }
      }
    })

    if (!user || !user.isActive) {
      console.log('User not found or inactive:', userId)
      return false
    }

    // Admin has all permissions
    if (user.role === 'ADMIN') {
      console.log('Admin user, granting permission:', resource, action)
      return true
    }

    // Check specific permissions
    const hasPermission = user.permissions.some(up => 
      up.permission.resource === resource && up.permission.action === action
    )

    console.log(`Permission check for user ${userId}: ${resource}:${action} = ${hasPermission}`)
    return hasPermission
  } catch (error) {
    console.error('Permission check error:', error)
    return false
  }
}

export async function getUserPermissions(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        permissions: {
          include: { permission: true },
          where: { granted: true }
        }
      }
    })

    if (!user) return []

    if (user.role === 'ADMIN') {
      return DEFAULT_PERMISSIONS.ADMIN
    }

    return user.permissions.map(up => `${up.permission.resource}:${up.permission.action}`)
  } catch (error) {
    console.error('Get permissions error:', error)
    return []
  }
}

export async function assignPermissions(userId, permissions) {
  try {
    // Remove existing permissions
    await prisma.userPermission.deleteMany({
      where: { userId }
    })

    // Add new permissions
    for (const perm of permissions) {
      const [resource, action] = perm.split(':')
      
      let permission = await prisma.permission.findUnique({
        where: { resource_action: { resource, action } }
      })

      if (!permission) {
        permission = await prisma.permission.create({
          data: { resource, action }
        })
      }

      await prisma.userPermission.create({
        data: {
          userId,
          permissionId: permission.id,
          granted: true
        }
      })
    }

    return true
  } catch (error) {
    console.error('Assign permissions error:', error)
    return false
  }
}

export function requirePermission(resource, action) {
  return async (req, res, next) => {
    const userId = req.user?.id
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const hasPermission = await checkPermission(userId, resource, action)
    
    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }

    next()
  }
}