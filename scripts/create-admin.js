import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@carbook.com' }
    })

    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    const admin = await prisma.user.create({
      data: {
        email: 'admin@carbook.com',
        name: 'Admin User',
        phone: '+1234567890',
        role: 'admin',
        emailVerified: true
      }
    })

    console.log('Admin user created:', admin.email)
  } catch (error) {
    console.error('Error creating admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()