import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const driverPermissions = [
  'bookings:read'
]

async function assignDriverPermissions() {
  try {
    console.log('Assigning permissions to driver users...')
    
    const driverUsers = await prisma.user.findMany({
      where: { role: 'DRIVER' }
    })
    
    console.log(`Found ${driverUsers.length} driver users`)
    
    for (const user of driverUsers) {
      console.log(`Assigning permissions to ${user.email}`)
      
      for (const permStr of driverPermissions) {
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
    
    console.log('Driver permissions assigned successfully')
  } catch (error) {
    console.error('Error assigning driver permissions:', error)
  } finally {
    await prisma.$disconnect()
  }
}

assignDriverPermissions()