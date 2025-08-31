import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createTestAdmin() {
  try {
    console.log('🔧 Creating test admin user...')

    const hashedPassword = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.create({
      data: {
        name: 'Test Admin',
        email: 'admin@test.com',
        password: hashedPassword,
        phone: '0987654321',
        role: 'ADMIN'
      }
    })

    console.log('✅ Test admin created successfully!')
    console.log(`📋 Name: ${admin.name}`)
    console.log(`📧 Email: ${admin.email}`)
    console.log(`🔑 Password: admin123`)
    console.log(`👤 Role: ${admin.role}`)
    console.log(`🆔 ID: ${admin.id}`)

    console.log('\n🎯 You can now:')
    console.log('1. Login with admin@test.com / admin123')
    console.log('2. Visit /rbac-demo to manage permissions')
    console.log('3. Change staff permissions in real-time')

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Test admin already exists!')
      const existing = await prisma.user.findUnique({
        where: { email: 'admin@test.com' }
      })
      console.log(`📋 Existing admin ID: ${existing.id}`)
    } else {
      console.error('❌ Error creating test admin:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createTestAdmin()