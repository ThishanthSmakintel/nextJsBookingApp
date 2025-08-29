import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function assignStaffPermissions() {
  try {
    const staffUser = await prisma.user.findUnique({
      where: { email: 'staff@carbook.com' }
    })

    if (!staffUser) {
      console.log('Staff user not found')
      return
    }

    // Basic permissions for staff
    const staffPermissions = [
      'bookings:create', 'bookings:read', 'bookings:update',
      'cars:read', 'customers:read', 'drivers:read',
      'staff:read' // Add staff read permission
    ]

    // Clear existing permissions
    await prisma.userPermission.deleteMany({
      where: { userId: staffUser.id }
    })

    // Assign new permissions
    for (const permStr of staffPermissions) {
      const [resource, action] = permStr.split(':')
      
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
          userId: staffUser.id,
          permissionId: permission.id,
          granted: true
        }
      })
    }

    console.log('Staff permissions assigned successfully')
    console.log('Assigned permissions:', staffPermissions)
  } catch (error) {
    console.error('Error assigning staff permissions:', error)
  } finally {
    await prisma.$disconnect()
  }
}

assignStaffPermissions()