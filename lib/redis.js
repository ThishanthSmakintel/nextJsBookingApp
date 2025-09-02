import Redis from 'ioredis'

export const redis = new Redis(process.env.REDIS_URL)

export const lockCar = async (carId, lockId, ttl = 600) => {
  const key = `car:${carId}:lock:${lockId}`
  const result = await redis.setex(key, ttl, lockId)
  return result === 'OK'
}

export const extendLock = async (carId, lockId, ttl = 300) => {
  const key = `car:${carId}:lock:${lockId}`
  const current = await redis.get(key)
  if (current === lockId) {
    return await redis.expire(key, ttl)
  }
  return false
}

export const releaseLock = async (carId, lockId) => {
  const key = `car:${carId}:lock:${lockId}`
  const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `
  return await redis.eval(script, 1, key, lockId)
}

export const cacheSet = (key, value, ttl = 300) => redis.setex(key, ttl, JSON.stringify(value))
export const cacheGet = async (key) => {
  const value = await redis.get(key)
  return value ? JSON.parse(value) : null
}