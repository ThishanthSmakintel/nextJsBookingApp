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
    
    // Join role-based rooms
    if (user) {
      socket.join(`user_${user.id}`)
      socket.join(`role_${user.role}`)
      
      if (user.role === 'ADMIN') {
        socket.join('admin_room')
      }
    }

    socket.on('join_room', (room) => {
      socket.join(room)
    })

    socket.on('disconnect', () => {
      console.log(`User ${user?.id} disconnected`)
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

export const emitToUser = (userId, event, data) => {
  emitToRoom(`user_${userId}`, event, data)
}

export const emitToRole = (role, event, data) => {
  emitToRoom(`role_${role}`, event, data)
}

export const emitPermissionUpdate = (userId, permissions) => {
  emitToUser(userId, 'permission_update', { permissions })
}