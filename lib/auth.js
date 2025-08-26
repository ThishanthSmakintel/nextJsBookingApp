import jwt from 'jsonwebtoken'
import { AbilityBuilder, createMongoAbility } from '@casl/ability'

export const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })
}

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

export const defineAbilitiesFor = (user) => {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility)

  if (user.role === 'admin') {
    can('manage', 'all')
  } else if (user.role === 'driver') {
    can('read', 'Booking', { driverId: user.id })
    can('update', 'Booking', { driverId: user.id })
  } else if (user.role === 'customer') {
    can('read', 'Booking', { customerId: user.id })
    can('create', 'Booking')
    can('cancel', 'Booking', { customerId: user.id, status: 'PENDING' })
  }

  return build()
}