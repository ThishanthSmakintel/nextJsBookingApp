'use client'
import { useState, useEffect } from 'react'
import { Clock, AlertTriangle } from 'lucide-react'

export default function CountdownTimer({ expiresAt, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(expiresAt) - new Date()
      return Math.max(0, Math.floor(difference / 1000))
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)
      
      if (newTimeLeft === 0) {
        onExpire?.()
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [expiresAt, onExpire])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isUrgent = timeLeft < 120 // Less than 2 minutes

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm font-semibold mb-2 text-warning flex items-center">
        <Clock className="w-4 h-4 mr-2" />
        Reservation Expires In:
      </div>
      <div className={`grid grid-flow-col gap-5 text-center auto-cols-max ${isUrgent ? 'animate-pulse' : ''}`}>
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-2xl">
            <span style={{"--value": minutes}}></span>
          </span>
          min
        </div> 
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-2xl">
            <span style={{"--value": seconds}}></span>
          </span>
          sec
        </div>
      </div>
      {isUrgent && (
        <div className="alert alert-warning mt-2 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Hurry! Complete booking soon</span>
        </div>
      )}
    </div>
  )
}