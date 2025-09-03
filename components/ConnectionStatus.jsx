'use client'
import { useState, useEffect } from 'react'
import { useSocketStore } from '@/stores/socket'
import { useSocket } from '@/contexts/SocketContext'

// Cache buster v2
export default function ConnectionStatus() {
  const { connected } = useSocketStore()
  const { socket } = useSocket()
  const [showModal, setShowModal] = useState(false)
  const [socketId, setSocketId] = useState(null)
  const [lastPing, setLastPing] = useState(null)

  useEffect(() => {
    if (socket) {
      setSocketId(socket.id)
      
      const pingInterval = setInterval(() => {
        if (socket.connected) {
          try {
            const start = Date.now()
            socket.emit('ping', start, (response) => {
              setLastPing(Date.now() - start)
            })
          } catch (error) {
            console.error('Socket ping error:', error)
          }
        }
      }, 5000)
      
      return () => clearInterval(pingInterval)
    }
  }, [socket])

  return (
    <>
      <button 
        className={`w-3 h-3 rounded-full ${connected ? 'bg-success animate-pulse' : 'bg-error animate-ping'}`}
        onClick={() => setShowModal(true)}
      />
      
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Socket.IO Status</h3>
            <div className="space-y-2">
              <div>Status: <span className={connected ? 'text-success' : 'text-error'}>
                {connected ? 'Connected' : 'Disconnected'}
              </span></div>
              {socketId && <div>Socket ID: {socketId}</div>}
              {lastPing && <div>Ping: {lastPing}ms</div>}
              <div>URL: {process.env.NEXT_PUBLIC_SOCKET_URL || 'localhost:3000'}</div>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}