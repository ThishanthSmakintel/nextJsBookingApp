import { redis } from './redis.js'

export const publishEvent = async (channel, data) => {
  return redis.publish(channel, JSON.stringify(data))
}

export const subscribeToChannel = async (channel, handler) => {
  const subscriber = redis.duplicate()
  await subscriber.subscribe(channel)
  
  subscriber.on('message', async (receivedChannel, message) => {
    if (receivedChannel === channel) {
      try {
        const data = JSON.parse(message)
        await handler(data)
      } catch (error) {
        console.error('Event processing error:', error)
      }
    }
  })
  
  return subscriber
}