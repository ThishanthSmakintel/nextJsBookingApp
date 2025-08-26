import { redis } from './redis.js'
import { sendOTPEmail } from './email.js'

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const storeOTP = async (email, otp, ttl = 600) => {
  const key = `otp:${email}`
  await redis.setex(key, ttl, otp)
}

export const verifyOTP = async (email, otp) => {
  const key = `otp:${email}`
  const storedOTP = await redis.get(key)
  
  if (storedOTP === otp) {
    await redis.del(key)
    return true
  }
  return false
}

export const storePendingRegistration = async (email, data, ttl = 600) => {
  const key = `pending:${email}`
  await redis.setex(key, ttl, JSON.stringify(data))
}

export const getPendingRegistration = async (email) => {
  const key = `pending:${email}`
  const data = await redis.get(key)
  if (data) {
    await redis.del(key)
    return JSON.parse(data)
  }
  return null
}

export const sendOTP = async (email, otp) => {
  try {
    await sendOTPEmail(email, otp)
    console.log(`OTP sent to ${email}`)
    return true
  } catch (error) {
    console.error('Failed to send OTP:', error)
    return false
  }
}