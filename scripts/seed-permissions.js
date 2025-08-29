import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const permissions = [
  // Bookings
  { resource: 'bookings', action: 'create' },
  { resource: 'bookings', action: 'read' },
  { resource: 'bookings', action: 'update' },
  { resource: 'bookings', action: 'delete' },
  
  // Cars
  { resource: 'cars', action: 'create' },
  { resource: 'cars', action: 'read' },
  { resource: 'cars', action: 'update' },
  { resource: 'cars', action: 'delete' },
  
  // Customers
  { resource: 'customers', action: 'create' },
  { resource: 'customers', action: 'read' },
  { resource: 'customers', action: 'update' },
  { resource: 'customers', action: 'delete' },
  
  // Drivers
  { resource: 'drivers', action: 'create' },
  { resource: 'drivers', action: 'read' },
  { resource: 'drivers', action: 'update' },
  { resource: 'drivers', action: 'delete' },
  
  // Staff
  { resource: 'staff', action: 'create' },
  { resource: 'staff', action: 'read' },
  { resource: 'staff', action: 'update' },
  { resource: 'staff', action: 'delete' },
  
  // Reports
  { resource: 'reports', action: 'read' },
  
  // Schedule
  { resource: 'schedule', action: 'read' },
  { resource: 'schedule', action: 'update' },
  
  // RBAC
  { resource: 'rbac', action: 'read' },
  { resource: 'rbac', action: 'update' }
]

async function seedPermissions() {
  try {
    console.log('Seeding permissions...')
    
    for (const perm of permissions) {
      await prisma.permission.upsert({
        where: {
          resource_action: {
            resource: perm.resource,
            action: perm.action
          }
        },
        update: {},
        create: perm
      })
    }
    
    // Assign default permissions to staff users
    const staffUsers = await prisma.user.findMany({
      where: { role: 'STAFF' }
    })
    
    const staffPermissions = [
      'bookings:create', 'bookings:read', 'bookings:update',
      'cars:read', 'customers:read', 'drivers:read'
    ]
    
    for (const user of staffUsers) {
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
    
    console.log('Permissions seeded successfully')
  } catch (error) {
    console.error('Error seeding permissions:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedPermissions()