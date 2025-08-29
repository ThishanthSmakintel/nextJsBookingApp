import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@carbook.com' }
    })

    if (existingAdmin) {
      // Update existing admin with password
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await prisma.user.update({
        where: { email: 'admin@carbook.com' },
        data: {
          password: hashedPassword,
          role: 'ADMIN',
          isActive: true
        }
      })
      console.log('Admin user updated with password')
      return
    }

    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.create({
      data: {
        email: 'admin@carbook.com',
        name: 'Admin User',
        phone: '+1234567890',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true
      }
    })

    console.log('Admin user created:', admin.email)
    console.log('Password: admin123')
  } catch (error) {
    console.error('Error creating admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()