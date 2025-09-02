import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create locations first
  const location1 = await prisma.location.create({
    data: {
      name: 'Main Location',
      address: '123 Main St',
      city: 'Colombo',
      availableCars: 10
    }
  })

  const location2 = await prisma.location.create({
    data: {
      name: 'Airport Location', 
      address: 'Airport Road',
      city: 'Katunayake',
      availableCars: 5
    }
  })

  // Create dummy cars
  const cars = [
    {
      make: 'Toyota',
      model: 'Prius',
      year: 2022,
      licensePlate: 'CAR-001',
      pricePerHour: 50,
      dailyRate: 50,
      kmRate: 0.5,
      category: 'economy',
      capacity: 5,
      locationId: location1.id
    },
    {
      make: 'Honda',
      model: 'Civic',
      year: 2023,
      licensePlate: 'CAR-002', 
      pricePerHour: 60,
      dailyRate: 60,
      kmRate: 0.6,
      category: 'economy',
      capacity: 5,
      locationId: location1.id
    },
    {
      make: 'BMW',
      model: 'X5',
      year: 2023,
      licensePlate: 'CAR-003',
      pricePerHour: 120,
      dailyRate: 120,
      kmRate: 1.2,
      category: 'luxury',
      capacity: 7,
      locationId: location2.id
    },
    {
      make: 'Mercedes',
      model: 'C-Class',
      year: 2022,
      licensePlate: 'CAR-004',
      pricePerHour: 100,
      dailyRate: 100,
      kmRate: 1.0,
      category: 'luxury',
      capacity: 5,
      locationId: location1.id
    },
    {
      make: 'Nissan',
      model: 'Altima',
      year: 2021,
      licensePlate: 'CAR-005',
      pricePerHour: 45,
      dailyRate: 45,
      kmRate: 0.45,
      category: 'economy',
      capacity: 5,
      locationId: location2.id
    },
    {
      make: 'Audi',
      model: 'A4',
      year: 2023,
      licensePlate: 'CAR-006',
      pricePerHour: 90,
      dailyRate: 90,
      kmRate: 0.9,
      category: 'luxury',
      capacity: 5,
      locationId: location1.id
    }
  ]

  for (const car of cars) {
    await prisma.car.create({ data: car })
  }

  // Seed completed
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })