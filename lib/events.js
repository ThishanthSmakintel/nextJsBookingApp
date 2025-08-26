import { publishEvent } from './rabbitmq.js'

export const EVENTS = {
  BOOKING_CREATED: 'booking.created',
  BOOKING_CONFIRMED: 'booking.confirmed',
  BOOKING_CANCELLED: 'booking.cancelled',
  CAR_LOCKED: 'car.locked',
  CAR_UNLOCKED: 'car.unlocked',
  DRIVER_ASSIGNED: 'driver.assigned'
}

export const emitEvent = async (eventType, data) => {
  await publishEvent(eventType, {
    type: eventType,
    timestamp: new Date().toISOString(),
    data
  })
}