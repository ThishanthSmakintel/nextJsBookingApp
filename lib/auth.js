import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export function verifyToken(token) {
  if (!token) return null
  
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
  } catch {
    return null
  }
}

export function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' })
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}