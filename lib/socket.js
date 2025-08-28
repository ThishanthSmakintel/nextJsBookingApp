import { Server } from 'socket.io'
import { verifyToken } from './auth.js'

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
      next()
    } catch (err) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    const { user } = socket
    
    if (user && user.role === 'CUSTOMER') {
      socket.join(`customer_${user.id}`)
    } else if (user && user.role === 'DRIVER') {
      socket.join(`driver_${user.id}`)
    } else if (user && user.role === 'ADMIN') {
      socket.join('admin_room')
    }

    socket.on('join_room', (room) => {
      socket.join(room)
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