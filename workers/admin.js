import { subscribeToChannel } from '../lib/rabbitmq.js'
import { EVENTS } from '../lib/events.js'
import { emitToAdmin } from '../lib/socket.js'

const handleAdminUpdate = async (eventData) => {
  const { type, data } = eventData
  
  switch (type) {
    case 'booking.created':
      emitToAdmin('new_booking', data.booking)
      break
    case 'booking.confirmed':
      emitToAdmin('booking_confirmed', data.booking)
      break
    case 'booking.cancelled':
      emitToAdmin('booking_cancelled', data.booking)
      break
    case 'driver.assigned':
      emitToAdmin('driver_assigned', { booking: data.booking, driver: data.driver })
      break
  }
}

subscribeToChannel(EVENTS.BOOKING_CREATED, handleAdminUpdate)
subscribeToChannel(EVENTS.BOOKING_CONFIRMED, handleAdminUpdate)
subscribeToChannel(EVENTS.BOOKING_CANCELLED, handleAdminUpdate)
subscribeToChannel(EVENTS.DRIVER_ASSIGNED, handleAdminUpdate)

console.log('Admin worker started')