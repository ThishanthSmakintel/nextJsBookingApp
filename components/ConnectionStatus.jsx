'use client'
import { useState } from 'react'
import { useSocketStore } from '@/stores/socket'

export default function ConnectionStatus() {
  const { connected } = useSocketStore()
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-success animate-pulse' : 'bg-error animate-ping'}`}></div>
        <span className="hidden sm:inline text-xs">
          {connected ? 'Online' : 'Offline'}
        </span>
      </div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-base-300 text-base-content text-xs rounded-lg shadow-lg whitespace-nowrap z-50">
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      )}
    </div>
  )
}