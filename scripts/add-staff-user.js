import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function addStaffUser() {
  try {
    const hashedPassword = await bcrypt.hash('staff123', 10)

    const staff = await prisma.user.create({
      data: {
        name: 'John Staff',
        email: 'john@staff.com',
        password: hashedPassword,
        phone: '1234567890',
        role: 'STAFF'
      }
    })

    console.log('✅ Staff user created:')
    console.log(`📋 Name: ${staff.name}`)
    console.log(`📧 Email: ${staff.email}`)
    console.log(`👤 Role: ${staff.role}`)

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️ Staff user already exists')
    } else {
      console.error('❌ Error:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

addStaffUser()