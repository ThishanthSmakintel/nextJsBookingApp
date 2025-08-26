import { subscribeToChannel } from '../lib/rabbitmq.js'
import { EVENTS } from '../lib/events.js'

const sendSMS = async (phone, message) => {
  console.log(`SMS to ${phone}: ${message}`)
  // Integrate with SMS provider
}

const sendEmail = async (email, subject, body) => {
  console.log(`Email to ${email}: ${subject}`)
  // Integrate with email provider
}

const handleNotification = async (eventData) => {
  const { type, data } = eventData
  const { booking, customer, driver } = data
  
  switch (type) {
    case 'booking.created':
      await sendSMS(customer.phone, `Booking confirmed for ${booking.car.make} ${booking.car.model}`)
      break
    case 'driver.assigned':
      await sendSMS(customer.phone, `Driver ${driver.name} assigned. Contact: ${driver.phone}`)
      await sendSMS(driver.phone, `New booking assigned. Customer: ${customer.fullName}`)
      break
    case 'booking.cancelled':
      await sendSMS(customer.phone, 'Your booking has been cancelled')
      break
  }
}

subscribeToChannel(EVENTS.BOOKING_CREATED, handleNotification)
subscribeToChannel(EVENTS.BOOKING_CONFIRMED, handleNotification)
subscribeToChannel(EVENTS.BOOKING_CANCELLED, handleNotification)
subscribeToChannel(EVENTS.DRIVER_ASSIGNED, handleNotification)
console.log('Notification worker started')