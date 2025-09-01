import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function debugStaffPermissions() {
  try {
    console.log('=== DEBUG STAFF PERMISSIONS ===')
    
    // Find all staff users
    const staffUsers = await prisma.user.findMany({
      where: { role: 'STAFF' },
      include: {
        permissions: {
          include: { permission: true }
        }
      }
    })
    
    console.log(`Found ${staffUsers.length} staff users:`)
    
    for (const user of staffUsers) {
      console.log(`\nUser: ${user.email} (ID: ${user.id}, Role: ${user.role})`)
      console.log(`Permissions count: ${user.permissions.length}`)
      
      if (user.permissions.length > 0) {
        console.log('Permissions:')
        user.permissions.forEach(up => {
          console.log(`  - ${up.permission.resource}:${up.permission.action} (granted: ${up.granted})`)
        })
      } else {
        console.log('No permissions found!')
      }
    }
    
    // Check all permissions in system
    const allPermissions = await prisma.permission.findMany()
    console.log(`\nTotal permissions in system: ${allPermissions.length}`)
    
    // Check user permissions table
    const allUserPermissions = await prisma.userPermission.findMany({
      include: {
        user: true,
        permission: true
      }
    })
    console.log(`Total user-permission assignments: ${allUserPermissions.length}`)
    
    const staffPermissions = allUserPermissions.filter(up => up.user.role === 'STAFF')
    console.log(`Staff permission assignments: ${staffPermissions.length}`)
    
  } catch (error) {
    console.error('Debug error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugStaffPermissions()