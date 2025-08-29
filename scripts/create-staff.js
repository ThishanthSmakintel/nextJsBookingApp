import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createStaff() {
  try {
    const existingStaff = await prisma.user.findUnique({
      where: { email: 'staff@carbook.com' }
    })

    if (existingStaff) {
      console.log('Staff user already exists')
      return
    }

    const hashedPassword = await bcrypt.hash('staff123', 10)
    const staff = await prisma.user.create({
      data: {
        email: 'staff@carbook.com',
        name: 'Staff User',
        phone: '+1234567891',
        password: hashedPassword,
        role: 'STAFF',
        isActive: true
      }
    })

    console.log('Staff user created:', staff.email)
    console.log('Password: staff123')
  } catch (error) {
    console.error('Error creating staff:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createStaff()