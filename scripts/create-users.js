import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createUsers() {
  try {
    // Create admin if not exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@carbook.com' }
    })

    if (!existingAdmin) {
      const admin = await prisma.user.create({
        data: {
          email: 'admin@carbook.com',
          name: 'Admin User',
          phone: '+1234567890',
          role: 'ADMIN'
        }
      })
      console.log('Admin created:', admin.email)
    } else {
      console.log('Admin already exists:', existingAdmin.email)
    }

    // Create staff if not exists
    const existingStaff = await prisma.user.findUnique({
      where: { email: 'staff@carbook.com' }
    })

    if (!existingStaff) {
      const staff = await prisma.user.create({
        data: {
          email: 'staff@carbook.com',
          name: 'Staff User',
          phone: '+1234567891',
          role: 'STAFF'
        }
      })
      console.log('Staff created:', staff.email)
    } else {
      console.log('Staff already exists:', existingStaff.email)
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createUsers()