import { Server } from 'socket.io'
import { verifyToken, defineAbilitiesFor } from './auth.js'

let io = null

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" }
  })

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token
      const user = verifyToken(token)
      socket.user = user
      socket.ability = defineAbilitiesFor(user)
      next()
    } catch (err) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    const { user } = socket
    
    if (user.role === 'customer') {
      socket.join(`customer_${user.id}`)
    } else if (user.role === 'driver') {
      socket.join(`driver_${user.id}`)
    } else if (user.role === 'admin') {
      socket.join('admin_room')
    }

    socket.on('join_booking', (bookingId) => {
      if (socket.ability.can('read', 'Booking')) {
        socket.join(`booking_${bookingId}`)
      }
    })
  })

  return io
}

export const emitToRoom = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, data)
  }
}

export const emitToBooking = (bookingId, event, data) => {
  emitToRoom(`booking_${bookingId}`, event, data)
}

export const emitToAdmin = (event, data) => {
  emitToRoom('admin_room', event, data)
}