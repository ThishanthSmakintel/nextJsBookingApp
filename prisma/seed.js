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

  const location3 = await prisma.location.create({
    data: {
      name: 'Kandy Branch',
      address: 'Temple Street',
      city: 'Kandy',
      availableCars: 8
    }
  })

  const location4 = await prisma.location.create({
    data: {
      name: 'Galle Fort',
      address: 'Fort Road',
      city: 'Galle',
      availableCars: 6
    }
  })

  // Create realistic car fleet
  const cars = [
    // Economy Cars
    { make: 'Toyota', model: 'Vitz', year: 2023, licensePlate: 'WP-CAR-1001', pricePerHour: 35, dailyRate: 45, kmRate: 0.35, category: 'economy', capacity: 4, locationId: location1.id, isActive: true },
    { make: 'Suzuki', model: 'Alto', year: 2022, licensePlate: 'WP-CAR-1002', pricePerHour: 30, dailyRate: 40, kmRate: 0.30, category: 'economy', capacity: 4, locationId: location1.id, isActive: true },
    { make: 'Nissan', model: 'March', year: 2023, licensePlate: 'WP-CAR-1003', pricePerHour: 38, dailyRate: 48, kmRate: 0.38, category: 'economy', capacity: 4, locationId: location2.id, isActive: true },
    { make: 'Honda', model: 'Fit', year: 2022, licensePlate: 'CP-CAR-2001', pricePerHour: 40, dailyRate: 50, kmRate: 0.40, category: 'economy', capacity: 5, locationId: location3.id, isActive: true },
    { make: 'Toyota', model: 'Yaris', year: 2023, licensePlate: 'SP-CAR-3001', pricePerHour: 42, dailyRate: 52, kmRate: 0.42, category: 'economy', capacity: 5, locationId: location4.id, isActive: true },
    
    // Compact Cars
    { make: 'Toyota', model: 'Axio', year: 2023, licensePlate: 'WP-CAR-1004', pricePerHour: 45, dailyRate: 58, kmRate: 0.45, category: 'compact', capacity: 5, locationId: location1.id, isActive: true },
    { make: 'Honda', model: 'Grace', year: 2022, licensePlate: 'WP-CAR-1005', pricePerHour: 48, dailyRate: 60, kmRate: 0.48, category: 'compact', capacity: 5, locationId: location1.id, isActive: true },
    { make: 'Nissan', model: 'Latio', year: 2023, licensePlate: 'WP-CAR-1006', pricePerHour: 46, dailyRate: 58, kmRate: 0.46, category: 'compact', capacity: 5, locationId: location2.id, isActive: true },
    
    // SUV Cars
    { make: 'Toyota', model: 'Prado', year: 2023, licensePlate: 'WP-CAR-1007', pricePerHour: 85, dailyRate: 110, kmRate: 0.85, category: 'suv', capacity: 7, locationId: location1.id, isActive: true },
    { make: 'Mitsubishi', model: 'Montero', year: 2022, licensePlate: 'CP-CAR-2002', pricePerHour: 80, dailyRate: 105, kmRate: 0.80, category: 'suv', capacity: 7, locationId: location3.id, isActive: true },
    { make: 'Honda', model: 'Vezel', year: 2023, licensePlate: 'WP-CAR-1008', pricePerHour: 65, dailyRate: 85, kmRate: 0.65, category: 'suv', capacity: 5, locationId: location2.id, isActive: true },
    { make: 'Nissan', model: 'X-Trail', year: 2022, licensePlate: 'SP-CAR-3002', pricePerHour: 70, dailyRate: 90, kmRate: 0.70, category: 'suv', capacity: 7, locationId: location4.id, isActive: true },
    
    // Luxury Cars
    { make: 'BMW', model: '320i', year: 2023, licensePlate: 'WP-CAR-1009', pricePerHour: 120, dailyRate: 150, kmRate: 1.20, category: 'luxury', capacity: 5, locationId: location1.id, isActive: true },
    { make: 'Mercedes', model: 'C200', year: 2023, licensePlate: 'WP-CAR-1010', pricePerHour: 125, dailyRate: 155, kmRate: 1.25, category: 'luxury', capacity: 5, locationId: location1.id, isActive: true },
    { make: 'Audi', model: 'A4', year: 2022, licensePlate: 'CP-CAR-2003', pricePerHour: 115, dailyRate: 145, kmRate: 1.15, category: 'luxury', capacity: 5, locationId: location3.id, isActive: true },
    { make: 'Lexus', model: 'ES300', year: 2023, licensePlate: 'WP-CAR-1011', pricePerHour: 130, dailyRate: 165, kmRate: 1.30, category: 'luxury', capacity: 5, locationId: location2.id, isActive: true },
    
    // Van/Minibus
    { make: 'Toyota', model: 'Hiace', year: 2022, licensePlate: 'WP-VAN-1001', pricePerHour: 75, dailyRate: 95, kmRate: 0.75, category: 'van', capacity: 14, locationId: location1.id, isActive: true },
    { make: 'Nissan', model: 'Caravan', year: 2023, licensePlate: 'CP-VAN-2001', pricePerHour: 70, dailyRate: 90, kmRate: 0.70, category: 'van', capacity: 12, locationId: location3.id, isActive: true },
    { make: 'Toyota', model: 'Coaster', year: 2022, licensePlate: 'SP-BUS-3001', pricePerHour: 95, dailyRate: 120, kmRate: 0.95, category: 'van', capacity: 29, locationId: location4.id, isActive: true },
    
    // Some cars under maintenance
    { make: 'Honda', model: 'Civic', year: 2021, licensePlate: 'WP-CAR-1012', pricePerHour: 55, dailyRate: 70, kmRate: 0.55, category: 'compact', capacity: 5, locationId: location1.id, isActive: false },
    { make: 'Toyota', model: 'Camry', year: 2020, licensePlate: 'WP-CAR-1013', pricePerHour: 75, dailyRate: 95, kmRate: 0.75, category: 'luxury', capacity: 5, locationId: location2.id, isActive: false }
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