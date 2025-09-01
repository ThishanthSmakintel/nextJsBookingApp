import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const staffPermissions = [
  'bookings:create',
  'bookings:read', 
  'bookings:update',
  'bookings:delete',
  'cars:create',
  'cars:read',
  'cars:update',
  'cars:delete',
  'customers:create',
  'customers:read',
  'customers:update',
  'customers:delete',
  'drivers:create',
  'drivers:read',
  'drivers:update',
  'drivers:delete',
  'schedule:read',
  'schedule:update',
  'leaves:read',
  'leaves:create',
  'leaves:update',
  'maintenance:read',
  'maintenance:create',
  'maintenance:update',
  'reports:read',
  'rbac:read',
  'rbac:update',
  'staff:read'
]

async function assignStaffPermissions() {
  try {
    console.log('Assigning permissions to staff users...')
    
    const staffUsers = await prisma.user.findMany({
      where: { role: 'STAFF' }
    })
    
    console.log(`Found ${staffUsers.length} staff users`)
    
    for (const user of staffUsers) {
      console.log(`Assigning permissions to ${user.email}`)
      
      for (const permStr of staffPermissions) {
        const [resource, action] = permStr.split(':')
        
        const permission = await prisma.permission.findUnique({
          where: { resource_action: { resource, action } }
        })
        
        if (permission) {
          await prisma.userPermission.upsert({
            where: {
              userId_permissionId: {
                userId: user.id,
                permissionId: permission.id
              }
            },
            update: { granted: true },
            create: {
              userId: user.id,
              permissionId: permission.id,
              granted: true
            }
          })
        }
      }
    }
    
    console.log('Staff permissions assigned successfully')
  } catch (error) {
    console.error('Error assigning staff permissions:', error)
  } finally {
    await prisma.$disconnect()
  }
}

assignStaffPermissions()