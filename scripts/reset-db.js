import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Resetting database...')
  
  // Delete all records in reverse order of dependencies
  await prisma.booking.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.car.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.addOn.deleteMany()
  await prisma.location.deleteMany()
  
  console.log('Database reset complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })