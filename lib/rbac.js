import { PrismaClient } from '@prisma/client'
import { emitPermissionUpdate } from './socket.js'

const prisma = new PrismaClient()

export async function checkPermission(userId, resource, action) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        permissions: {
          include: { permission: true }
        }
      }
    })
    
    if (!user) return false
    if (user.role === 'ADMIN') return true
    
    return user.permissions.some(up => 
      up.permission.resource === resource && 
      up.permission.action === action &&
      up.granted
    )
  } catch (error) {
    console.error('Permission check error:', error)
    return false
  }
}

export async function assignPermissions(userId, permissions) {
  try {
    // Clear existing permissions
    await prisma.userPermission.deleteMany({
      where: { userId }
    })
    
    // Add new permissions
    for (const permissionStr of permissions) {
      const [resource, action] = permissionStr.split(':')
      
      // Find or create permission
      let permission = await prisma.permission.findUnique({
        where: { resource_action: { resource, action } }
      })
      
      if (!permission) {
        permission = await prisma.permission.create({
          data: { resource, action }
        })
      }
      
      // Create user permission
      await prisma.userPermission.create({
        data: {
          userId,
          permissionId: permission.id
        }
      })
    }
    
    // Emit real-time update
    emitPermissionUpdate(userId, permissions)
    
    return true
  } catch (error) {
    console.error('Assign permissions error:', error)
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
    return user.permissions.map(up => `${up.permission.resource}:${up.permission.action}`)
  } catch (error) {
    console.error('Get permissions error:', error)
    return []
  }
}

export async function updateUserRole(userId, newRole) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    })
    
    // Get updated permissions
    const permissions = await getUserPermissions(userId)
    emitPermissionUpdate(userId, permissions)
    
    return true
  } catch (error) {
    console.error('Update role error:', error)
    return false
  }
}