import { subscribeToChannel } from '../lib/rabbitmq.js'
import { emitEvent, EVENTS } from '../lib/events.js'
import { prisma } from '../lib/db.js'
import { emitToRoom } from '../lib/socket.js'

const assignDriver = async (booking) => {
  const bookingStart = new Date(booking.startTime)
  const dayOfWeek = bookingStart.getDay()
  const timeStr = bookingStart.toTimeString().slice(0, 5) // HH:MM format
  
  const availableDrivers = await prisma.driver.findMany({
    where: {
      active: true,
      bookings: {
        none: {
          startTime: { lte: booking.endTime },
          endTime: { gte: booking.startTime },
          status: { in: ['PENDING', 'CONFIRMED'] }
        }
      }
    }
  })

  if (availableDrivers.length > 0) {
    const driver = availableDrivers[0]
    
    await prisma.booking.update({
      where: { id: booking.id },
      data: { driverId: driver.id, status: 'CONFIRMED' }
    })

    const updatedBooking = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: { car: true, customer: true, driver: true }
    })

    await emitEvent(EVENTS.DRIVER_ASSIGNED, {
      booking: updatedBooking,
      driver,
      customer: updatedBooking.customer
    })

    emitToRoom(`booking_${booking.id}`, 'driver_assigned', { driver })
    emitToRoom(`driver_${driver.id}`, 'booking_assigned', { booking: updatedBooking })
  }
}

const handleDriverAssignment = async (eventData) => {
  if (eventData.type === 'booking.created') {
    await assignDriver(eventData.data.booking)
  }
}

subscribeToChannel(EVENTS.BOOKING_CREATED, handleDriverAssignment)
console.log('Driver assignment worker started')