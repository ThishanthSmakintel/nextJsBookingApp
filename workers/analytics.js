import { subscribeToChannel } from '../lib/rabbitmq.js'
import { EVENTS } from '../lib/events.js'
import { redis } from '../lib/redis.js'

const logEvent = async (eventType, data) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type: eventType,
    data
  }
  
  await redis.lpush('analytics:events', JSON.stringify(logEntry))
  await redis.ltrim('analytics:events', 0, 9999) // Keep last 10k events
  
  // Update counters
  const today = new Date().toISOString().split('T')[0]
  await redis.incr(`analytics:${eventType}:${today}`)
  await redis.expire(`analytics:${eventType}:${today}`, 86400 * 30) // 30 days
}

const handleAnalytics = async (eventData) => {
  await logEvent(eventData.type, eventData.data)
}

subscribeToChannel(EVENTS.BOOKING_CREATED, handleAnalytics)
subscribeToChannel(EVENTS.BOOKING_CONFIRMED, handleAnalytics)
subscribeToChannel(EVENTS.BOOKING_CANCELLED, handleAnalytics)
subscribeToChannel(EVENTS.DRIVER_ASSIGNED, handleAnalytics)
subscribeToChannel(EVENTS.CAR_LOCKED, handleAnalytics)
subscribeToChannel(EVENTS.CAR_UNLOCKED, handleAnalytics)

console.log('Analytics worker started')