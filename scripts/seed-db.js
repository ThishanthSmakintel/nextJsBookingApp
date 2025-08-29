import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create locations
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Colombo',
        address: 'Colombo, Sri Lanka',
        city: 'Colombo'
      }
    }),
    prisma.location.create({
      data: {
        name: 'Kandy',
        address: 'Kandy, Sri Lanka',
        city: 'Kandy'
      }
    }),
    prisma.location.create({
      data: {
        name: 'Galle',
        address: 'Galle, Sri Lanka',
        city: 'Galle'
      }
    })
  ])

  // Create cars
  const cars = await Promise.all([
    prisma.car.create({
      data: {
        make: 'Toyota',
        model: 'Prius',
        year: 2022,
        licensePlate: 'CAR-001',
        pricePerHour: 50
      }
    }),
    prisma.car.create({
      data: {
        make: 'BMW',
        model: 'X5',
        year: 2023,
        licensePlate: 'CAR-002',
        pricePerHour: 150
      }
    }),
    prisma.car.create({
      data: {
        make: 'Honda',
        model: 'CR-V',
        year: 2022,
        licensePlate: 'CAR-003',
        pricePerHour: 80
      }
    })
  ])

  // Create drivers
  const drivers = await Promise.all([
    prisma.driver.create({
      data: {
        name: 'John Silva',
        phone: '+94771234567',
        licenseNumber: 'DL001'
      }
    }),
    prisma.driver.create({
      data: {
        name: 'Priya Sharma',
        phone: '+94771234568',
        licenseNumber: 'DL002'
      }
    })
  ])

  // Create permissions
  const permissions = await Promise.all([
    prisma.permission.create({
      data: {
        resource: 'booking',
        action: 'create',
        description: 'Create bookings'
      }
    }),
    prisma.permission.create({
      data: {
        resource: 'booking',
        action: 'read',
        description: 'View bookings'
      }
    }),
    prisma.permission.create({
      data: {
        resource: 'car',
        action: 'manage',
        description: 'Manage cars'
      }
    })
  ])

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })