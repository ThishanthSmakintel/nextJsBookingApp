import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupTestUsers() {
  try {
    console.log('🧹 Removing test users...')

    // Find test users
    const testUsers = await prisma.user.findMany({
      where: {
        OR: [
          { email: 'staff@test.com' },
          { email: 'admin@test.com' }
        ]
      }
    })

    // Delete their permissions first
    for (const user of testUsers) {
      await prisma.userPermission.deleteMany({
        where: { userId: user.id }
      })
    }

    // Delete test users
    const deleted = await prisma.user.deleteMany({
      where: {
        OR: [
          { email: 'staff@test.com' },
          { email: 'admin@test.com' }
        ]
      }
    })

    console.log(`✅ Removed ${deleted.count} test users`)
    console.log('📋 Remaining real users only')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupTestUsers()