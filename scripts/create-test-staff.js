import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createTestStaff() {
  try {
    console.log('🔧 Creating test staff user...')

    const hashedPassword = await bcrypt.hash('password123', 10)

    const staff = await prisma.user.create({
      data: {
        name: 'Test Staff',
        email: 'staff@test.com',
        password: hashedPassword,
        phone: '1234567890',
        role: 'STAFF'
      }
    })

    console.log('✅ Test staff created successfully!')
    console.log(`📋 Name: ${staff.name}`)
    console.log(`📧 Email: ${staff.email}`)
    console.log(`🔑 Password: password123`)
    console.log(`👤 Role: ${staff.role}`)
    console.log(`🆔 ID: ${staff.id}`)

    console.log('\n🎯 You can now:')
    console.log('1. Login with staff@test.com / password123')
    console.log('2. Visit /rbac-demo to test permissions')
    console.log('3. Use admin to change this user\'s permissions in real-time')

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Test staff already exists!')
      const existing = await prisma.user.findUnique({
        where: { email: 'staff@test.com' }
      })
      console.log(`📋 Existing staff ID: ${existing.id}`)
    } else {
      console.error('❌ Error creating test staff:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createTestStaff()