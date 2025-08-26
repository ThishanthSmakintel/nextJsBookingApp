import { create } from 'zustand'
import { io } from 'socket.io-client'

export const useSocketStore = create((set, get) => ({
  socket: null,
  connected: false,
  
  connect: (token) => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      auth: { token }
    })
    
    socket.on('connect', () => {
      set({ connected: true })
    })
    
    socket.on('disconnect', () => {
      set({ connected: false })
    })
    
    set({ socket })
    return socket
  },
  
  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, connected: false })
    }
  },
  
  emit: (event, data) => {
    const { socket } = get()
    if (socket) {
      socket.emit(event, data)
    }
  },
  
  on: (event, callback) => {
    const { socket } = get()
    if (socket) {
      socket.on(event, callback)
    }
  }
}))