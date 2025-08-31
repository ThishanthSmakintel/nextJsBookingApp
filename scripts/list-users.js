import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        permissions: {
          include: { permission: true }
        }
      }
    })

    console.log('👥 All Users:\n')
    
    users.forEach(user => {
      console.log(`📋 ${user.name}`)
      console.log(`   📧 ${user.email}`)
      console.log(`   👤 ${user.role}`)
      console.log(`   🆔 ${user.id}`)
      
      if (user.permissions.length > 0) {
        const perms = user.permissions.map(up => `${up.permission.resource}:${up.permission.action}`)
        console.log(`   🔑 Permissions: ${perms.join(', ')}`)
      } else {
        console.log(`   🔑 No permissions`)
      }
      console.log('')
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listUsers()