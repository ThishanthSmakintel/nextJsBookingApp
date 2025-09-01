'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useSocketStore } from '@/stores/socket'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider')
  }
  return context
}

export function SocketProvider({ children }) {
  const { socket, connected, connect, disconnect, emit, on } = useSocketStore()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && !socket) {
      const socketInstance = connect(token)
      
      socketInstance.on('connect', () => {
        setIsConnected(true)
        console.log('Socket connected')
        // Expose socket globally for permission updates
        window.socket = socketInstance
      })
      
      socketInstance.on('disconnect', () => {
        setIsConnected(false)
        console.log('Socket disconnected')
        window.socket = null
      })
    }

    return () => {
      if (socket) {
        disconnect()
        window.socket = null
      }
    }
  }, [])

  const value = {
    socket,
    connected: isConnected,
    emit,
    on: (event, callback) => {
      if (socket) {
        socket.on(event, callback)
        return () => socket.off(event, callback)
      }
    }
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}