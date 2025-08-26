import { PrismaClient } from '@prisma/client'

async function seedRevisedData() {
  const prisma = new PrismaClient()

  try {
    // Clear existing data
    await prisma.oTP.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.car.deleteMany()
    await prisma.user.deleteMany()
    await prisma.location.deleteMany()

    // Create locations
    const locations = await Promise.all([
      prisma.location.create({
        data: { name: 'Colombo', address: 'Colombo City Center', lat: 6.9271, lng: 79.8612 }
      }),
      prisma.location.create({
        data: { name: 'Kandy', address: 'Kandy City', lat: 7.2906, lng: 80.6337 }
      }),
      prisma.location.create({
        data: { name: 'Galle', address: 'Galle Fort', lat: 6.0535, lng: 80.2210 }
      })
    ])

    // Create cars
    const cars = await Promise.all([
      prisma.car.create({
        data: {
          make: 'Toyota', model: 'Corolla', year: 2023, licensePlate: 'CAR001',
          category: 'sedan', dailyRate: 45, kmRate: 0.5, capacity: 5,
          locationId: locations[0].id, features: { ac: true, gps: true }
        }
      }),
      prisma.car.create({
        data: {
          make: 'Honda', model: 'CR-V', year: 2022, licensePlate: 'CAR002',
          category: 'suv', dailyRate: 65, kmRate: 0.7, capacity: 7,
          locationId: locations[1].id, features: { ac: true, gps: true, bluetooth: true }
        }
      }),
      prisma.car.create({
        data: {
          make: 'Suzuki', model: 'Alto', year: 2021, licensePlate: 'CAR003',
          category: 'economy', dailyRate: 25, kmRate: 0.3, capacity: 4,
          locationId: locations[2].id, features: { ac: true }
        }
      })
    ])

    // Create users
    const users = await Promise.all([
      prisma.user.create({
        data: {
          fullName: 'Test Customer',
          email: 'customer@example.com',
          phone: '+94771234567',
          role: 'CUSTOMER'
        }
      }),
      prisma.user.create({
        data: {
          fullName: 'Staff Member',
          email: 'staff@example.com',
          phone: '+94771234568',
          role: 'STAFF'
        }
      }),
      prisma.user.create({
        data: {
          fullName: 'Admin User',
          email: 'admin@example.com',
          phone: '+94771234569',
          role: 'ADMIN'
        }
      })
    ])

    // Create sample bookings
    await Promise.all([
      prisma.booking.create({
        data: {
          carId: cars[0].id,
          customerId: users[0].id,
          staffId: users[1].id,
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
          totalPrice: 90,
          status: 'CONFIRMED'
        }
      }),
      prisma.booking.create({
        data: {
          carId: cars[1].id,
          customerId: users[0].id,
          startTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 120 * 60 * 60 * 1000),
          totalPrice: 130,
          status: 'PENDING'
        }
      })
    ])

    console.log('✅ Revised database seeded successfully')
    console.log('Test accounts:')
    console.log('- customer@example.com (Customer)')
    console.log('- staff@example.com (Staff)')
    console.log('- admin@example.com (Admin)')
    console.log('Use OTP flow for authentication')
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Revised database seeding failed:', error.message)
    process.exit(1)
  }
}

seedRevisedData()