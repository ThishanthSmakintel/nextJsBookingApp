import { publishEvent } from './rabbitmq.js'
import { emitToAdmin, emitToUser, emitToRole } from './socket.js'

export const EVENTS = {
  BOOKING_CREATED: 'booking.created',
  BOOKING_CONFIRMED: 'booking.confirmed',
  BOOKING_CANCELLED: 'booking.cancelled',
  CAR_LOCKED: 'car.locked',
  CAR_UNLOCKED: 'car.unlocked',
  DRIVER_ASSIGNED: 'driver.assigned'
}

export const emitEvent = async (eventType, data) => {
  const eventData = {
    type: eventType,
    timestamp: new Date().toISOString(),
    data
  }
  
  // Publish to Redis for workers
  await publishEvent(eventType, eventData)
  
  // Emit real-time Socket.IO events
  switch (eventType) {
    case EVENTS.BOOKING_CREATED:
    case EVENTS.BOOKING_CONFIRMED:
    case EVENTS.BOOKING_CANCELLED:
      emitToAdmin('booking_update', eventData)
      if (data.booking?.customerId) {
        emitToUser(data.booking.customerId, 'booking_update', eventData)
      }
      break
    case EVENTS.DRIVER_ASSIGNED:
      emitToAdmin('driver_assigned', eventData)
      if (data.driver?.id) {
        emitToUser(data.driver.id, 'booking_assigned', eventData)
      }
      if (data.booking?.customerId) {
        emitToUser(data.booking.customerId, 'driver_assigned', eventData)
      }
      break
  }
}