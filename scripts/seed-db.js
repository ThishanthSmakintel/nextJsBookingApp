import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create locations
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Colombo',
        address: 'Colombo, Sri Lanka',
        lat: 6.9271,
        lng: 79.8612
      }
    }),
    prisma.location.create({
      data: {
        name: 'Kandy',
        address: 'Kandy, Sri Lanka',
        lat: 7.2906,
        lng: 80.6337
      }
    }),
    prisma.location.create({
      data: {
        name: 'Galle',
        address: 'Galle, Sri Lanka',
        lat: 6.0535,
        lng: 80.2210
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
        category: 'economy',
        dailyRate: 50,
        kmRate: 0.5,
        capacity: 5,
        locationId: locations[0].id,
        features: { aircon: true, gps: true }
      }
    }),
    prisma.car.create({
      data: {
        make: 'BMW',
        model: 'X5',
        year: 2023,
        licensePlate: 'CAR-002',
        category: 'luxury',
        dailyRate: 150,
        kmRate: 1.5,
        capacity: 7,
        locationId: locations[0].id,
        features: { aircon: true, gps: true, leather: true }
      }
    }),
    prisma.car.create({
      data: {
        make: 'Honda',
        model: 'CR-V',
        year: 2022,
        licensePlate: 'CAR-003',
        category: 'suv',
        dailyRate: 80,
        kmRate: 0.8,
        capacity: 5,
        locationId: locations[1].id,
        features: { aircon: true, gps: true }
      }
    })
  ])

  // Create drivers
  const drivers = await Promise.all([
    prisma.driver.create({
      data: {
        name: 'John Silva',
        phone: '+94771234567',
        licenseNumber: 'DL001',
        currentCarId: cars[0].id,
        skills: { languages: ['English', 'Sinhala'] }
      }
    }),
    prisma.driver.create({
      data: {
        name: 'Priya Sharma',
        phone: '+94771234568',
        licenseNumber: 'DL002',
        currentCarId: cars[1].id,
        skills: { languages: ['English', 'Hindi'] }
      }
    })
  ])

  // Create add-ons
  await Promise.all([
    prisma.addOn.create({
      data: {
        name: 'Child Seat',
        priceType: 'FLAT',
        price: 10
      }
    }),
    prisma.addOn.create({
      data: {
        name: 'GPS Navigation',
        priceType: 'FLAT',
        price: 5
      }
    }),
    prisma.addOn.create({
      data: {
        name: 'Extra Driver',
        priceType: 'PER_PERSON',
        price: 15
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