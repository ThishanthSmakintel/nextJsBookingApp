import { redis } from '../lib/redis.js'
import { prisma } from '../lib/db.js'

const cleanupExpiredLocks = async () => {
  const keys = await redis.keys('car:*:lock:*')
  console.log(`Cleaning up ${keys.length} lock keys`)
}

const cleanupExpiredBookings = async () => {
  const expiredBookings = await prisma.booking.findMany({
    where: {
      status: 'PENDING',
      createdAt: { lt: new Date(Date.now() - 15 * 60 * 1000) }
    }
  })
  
  for (const booking of expiredBookings) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'CANCELLED' }
    })
  }
  
  console.log(`Cancelled ${expiredBookings.length} expired bookings`)
}

setInterval(cleanupExpiredLocks, 5 * 60 * 1000)
setInterval(cleanupExpiredBookings, 2 * 60 * 1000)

console.log('Cleanup worker started')