import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

async function seedExtendedData() {
  const prisma = new PrismaClient()

  try {
    // Clear existing data
    await prisma.booking.deleteMany()
    await prisma.driver.deleteMany()
    await prisma.car.deleteMany()
    await prisma.customer.deleteMany()
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
      }),
      prisma.location.create({
        data: { name: 'Negombo', address: 'Negombo Beach', lat: 7.2084, lng: 79.8380 }
      }),
      prisma.location.create({
        data: { name: 'Jaffna', address: 'Jaffna City', lat: 9.6615, lng: 80.0255 }
      })
    ])

    // Create 50 cars across different categories
    const carData = [
      // Economy cars
      { make: 'Toyota', model: 'Vitz', category: 'economy', dailyRate: 25, kmRate: 0.3, capacity: 4 },
      { make: 'Suzuki', model: 'Alto', category: 'economy', dailyRate: 20, kmRate: 0.25, capacity: 4 },
      { make: 'Nissan', model: 'March', category: 'economy', dailyRate: 22, kmRate: 0.28, capacity: 4 },
      { make: 'Honda', model: 'Fit', category: 'economy', dailyRate: 28, kmRate: 0.32, capacity: 4 },
      { make: 'Perodua', model: 'Axia', category: 'economy', dailyRate: 18, kmRate: 0.22, capacity: 4 },
      
      // Compact cars
      { make: 'Toyota', model: 'Yaris', category: 'compact', dailyRate: 35, kmRate: 0.4, capacity: 5 },
      { make: 'Honda', model: 'City', category: 'compact', dailyRate: 38, kmRate: 0.42, capacity: 5 },
      { make: 'Nissan', model: 'Sunny', category: 'compact', dailyRate: 32, kmRate: 0.38, capacity: 5 },
      { make: 'Suzuki', model: 'Swift', category: 'compact', dailyRate: 30, kmRate: 0.35, capacity: 5 },
      { make: 'Mazda', model: '2', category: 'compact', dailyRate: 36, kmRate: 0.41, capacity: 5 },
      
      // Sedan cars
      { make: 'Toyota', model: 'Corolla', category: 'sedan', dailyRate: 45, kmRate: 0.5, capacity: 5 },
      { make: 'Honda', model: 'Civic', category: 'sedan', dailyRate: 48, kmRate: 0.52, capacity: 5 },
      { make: 'Nissan', model: 'Sylphy', category: 'sedan', dailyRate: 42, kmRate: 0.48, capacity: 5 },
      { make: 'Toyota', model: 'Camry', category: 'sedan', dailyRate: 55, kmRate: 0.6, capacity: 5 },
      { make: 'Honda', model: 'Accord', category: 'sedan', dailyRate: 58, kmRate: 0.62, capacity: 5 },
      
      // SUV cars
      { make: 'Toyota', model: 'RAV4', category: 'suv', dailyRate: 65, kmRate: 0.7, capacity: 7 },
      { make: 'Honda', model: 'CR-V', category: 'suv', dailyRate: 68, kmRate: 0.72, capacity: 7 },
      { make: 'Nissan', model: 'X-Trail', category: 'suv', dailyRate: 62, kmRate: 0.68, capacity: 7 },
      { make: 'Mitsubishi', model: 'Outlander', category: 'suv', dailyRate: 60, kmRate: 0.65, capacity: 7 },
      { make: 'Mazda', model: 'CX-5', category: 'suv', dailyRate: 70, kmRate: 0.75, capacity: 7 },
      
      // Luxury cars
      { make: 'BMW', model: '320i', category: 'luxury', dailyRate: 120, kmRate: 1.2, capacity: 5 },
      { make: 'Mercedes', model: 'C200', category: 'luxury', dailyRate: 125, kmRate: 1.25, capacity: 5 },
      { make: 'Audi', model: 'A4', category: 'luxury', dailyRate: 115, kmRate: 1.15, capacity: 5 },
      { make: 'Lexus', model: 'ES250', category: 'luxury', dailyRate: 110, kmRate: 1.1, capacity: 5 },
      { make: 'BMW', model: 'X3', category: 'luxury', dailyRate: 140, kmRate: 1.4, capacity: 7 },
      
      // Van/Minibus
      { make: 'Toyota', model: 'Hiace', category: 'van', dailyRate: 80, kmRate: 0.8, capacity: 12 },
      { make: 'Nissan', model: 'Caravan', category: 'van', dailyRate: 75, kmRate: 0.75, capacity: 10 },
      { make: 'Mitsubishi', model: 'Rosa', category: 'van', dailyRate: 90, kmRate: 0.9, capacity: 15 },
      { make: 'Toyota', model: 'Coaster', category: 'van', dailyRate: 100, kmRate: 1.0, capacity: 20 },
      { make: 'Isuzu', model: 'Journey', category: 'van', dailyRate: 85, kmRate: 0.85, capacity: 14 }
    ]

    const cars = []
    for (let i = 0; i < carData.length; i++) {
      const car = carData[i]
      for (let j = 0; j < 2; j++) { // 2 cars of each model
        const newCar = await prisma.car.create({
          data: {
            ...car,
            year: 2020 + (i % 4),
            licensePlate: `CAR${String(i * 2 + j + 1).padStart(3, '0')}`,
            locationId: locations[i % locations.length].id,
            features: {
              ac: true,
              gps: car.category !== 'economy',
              bluetooth: car.category === 'luxury' || car.category === 'suv',
              sunroof: car.category === 'luxury',
              leather: car.category === 'luxury'
            }
          }
        })
        cars.push(newCar)
      }
    }

    // Create 30 drivers
    const drivers = []
    for (let i = 1; i <= 30; i++) {
      const driver = await prisma.driver.create({
        data: {
          name: `Driver ${i}`,
          phone: `+94${String(700000000 + i).slice(-9)}`,
          licenseNumber: `DL${String(100000 + i)}`,
          currentCarId: cars[i % cars.length].id,
          active: Math.random() > 0.2 // 80% active
        }
      })
      drivers.push(driver)
    }

    // Create 20 customers
    const customers = []
    for (let i = 1; i <= 20; i++) {
      const hashedPassword = await bcrypt.hash('password123', 12)
      const customer = await prisma.customer.create({
        data: {
          userId: `customer${i}@example.com`,
          fullName: `Customer ${i}`,
          email: `customer${i}@example.com`,
          phone: `+94${String(710000000 + i).slice(-9)}`,
          password: hashedPassword
        }
      })
      customers.push(customer)
    }

    // Create bookings for the past 4 months
    const bookings = []
    const now = new Date()
    const fourMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 4, 1)
    
    for (let i = 0; i < 200; i++) { // 200 bookings over 4 months
      const startDate = new Date(fourMonthsAgo.getTime() + Math.random() * (now.getTime() - fourMonthsAgo.getTime()))
      const endDate = new Date(startDate.getTime() + (1 + Math.random() * 6) * 24 * 60 * 60 * 1000) // 1-7 days
      
      const car = cars[Math.floor(Math.random() * cars.length)]
      const customer = customers[Math.floor(Math.random() * customers.length)]
      const driver = Math.random() > 0.3 ? drivers[Math.floor(Math.random() * drivers.length)] : null
      
      const pricingMode = Math.random() > 0.5 ? 'daily' : 'km'
      const hours = (endDate - startDate) / (1000 * 60 * 60)
      const estimatedKm = pricingMode === 'km' ? 50 + Math.random() * 200 : null
      const totalPrice = pricingMode === 'daily' 
        ? Math.ceil(hours / 24) * car.dailyRate
        : estimatedKm * car.kmRate

      const statuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
      const status = startDate < now ? 
        (Math.random() > 0.1 ? 'COMPLETED' : 'CANCELLED') : 
        statuses[Math.floor(Math.random() * 2)] // PENDING or CONFIRMED for future

      const booking = await prisma.booking.create({
        data: {
          carId: car.id,
          customerId: customer.id,
          driverId: driver?.id,
          startTime: startDate,
          endTime: endDate,
          pricingMode,
          estimatedKm,
          totalPrice,
          status,
          createdAt: new Date(startDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Created up to 7 days before start
        }
      })
      bookings.push(booking)
    }

    console.log('✅ Extended database seeded successfully')
    console.log(`Created: ${locations.length} locations, ${cars.length} cars, ${drivers.length} drivers, ${customers.length} customers, ${bookings.length} bookings`)
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Extended database seeding failed:', error.message)
    process.exit(1)
  }
}

seedExtendedData()