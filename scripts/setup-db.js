import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$connect()
    console.log('Database connection successful!')
    
    // Test the connection
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('Database query test:', result)
    
  } catch (error) {
    console.error('Database setup failed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })