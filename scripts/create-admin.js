import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const adminEmail = 'admin@carbook.com'
    const adminPassword = 'admin123'
    
    // Check if admin already exists
    const existingAdmin = await prisma.customer.findUnique({
      where: { email: adminEmail }
    })
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists with email:', adminEmail)
      return
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    // Create admin user
    const admin = await prisma.customer.create({
      data: {
        userId: adminEmail,
        fullName: 'System Administrator',
        email: adminEmail,
        phone: '+94771234567',
        password: hashedPassword
      }
    })
    
    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', adminEmail)
    console.log('🔑 Password:', adminPassword)
    console.log('⚠️  Please change the password after first login')
    
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()