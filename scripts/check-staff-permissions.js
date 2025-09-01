import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkStaffPermissions() {
  try {
    const staffUser = await prisma.user.findFirst({
      where: { role: 'STAFF' },
      include: {
        permissions: {
          include: {
            permission: true
          },
          where: { granted: true }
        }
      }
    })

    if (staffUser) {
      console.log(`\n📋 Permissions for ${staffUser.email}:`)
      console.log('=' .repeat(50))
      
      const permissions = staffUser.permissions.map(up => 
        `${up.permission.resource}:${up.permission.action}`
      ).sort()
      
      permissions.forEach(perm => {
        console.log(`✅ ${perm}`)
      })
      
      console.log(`\n📊 Total permissions: ${permissions.length}`)
      
      // Check specific permissions
      const hasLocations = permissions.some(p => p.startsWith('locations:'))
      const hasPricing = permissions.some(p => p.startsWith('pricing:'))
      const hasSettings = permissions.some(p => p.startsWith('settings:'))
      
      console.log('\n🔍 Access Check:')
      console.log(`   Locations: ${hasLocations ? '❌ NO ACCESS' : '✅ NO ACCESS (correct)'}`)
      console.log(`   Pricing: ${hasPricing ? '❌ NO ACCESS' : '✅ NO ACCESS (correct)'}`)
      console.log(`   Settings: ${hasSettings ? '❌ NO ACCESS' : '✅ NO ACCESS (correct)'}`)
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkStaffPermissions()