import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addDriverScheduleTable() {
  try {
    console.log('Adding DriverSchedule table...')
    
    // The table will be created when you run: npx prisma db push
    // This script is for seeding sample schedules
    
    const drivers = await prisma.driver.findMany()
    
    for (const driver of drivers) {
      // Create default Monday-Friday 9-5 schedule
      const defaultSchedules = [
        { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isActive: true }, // Monday
        { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isActive: true }, // Tuesday
        { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isActive: true }, // Wednesday
        { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isActive: true }, // Thursday
        { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isActive: true }, // Friday
      ]
      
      for (const schedule of defaultSchedules) {
        await prisma.driverSchedule.upsert({
          where: {
            driverId_dayOfWeek: {
              driverId: driver.id,
              dayOfWeek: schedule.dayOfWeek
            }
          },
          update: {},
          create: {
            driverId: driver.id,
            ...schedule
          }
        })
      }
    }
    
    console.log('Driver schedules added successfully!')
  } catch (error) {
    console.error('Error adding driver schedules:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addDriverScheduleTable()