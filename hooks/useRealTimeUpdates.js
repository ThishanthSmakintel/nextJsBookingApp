'use client'
import { useEffect } from 'react'
import { useSocket } from '@/contexts/SocketContext'

export function useRealTimeUpdates(callbacks = {}) {
  const { socket, on } = useSocket()

  useEffect(() => {
    if (!socket) return

    const unsubscribers = []

    // Booking updates
    if (callbacks.onBookingUpdate) {
      const unsub = on('booking_update', callbacks.onBookingUpdate)
      unsubscribers.push(unsub)
    }

    // Driver assignments
    if (callbacks.onDriverAssigned) {
      const unsub = on('driver_assigned', callbacks.onDriverAssigned)
      unsubscribers.push(unsub)
    }

    // Booking assignments (for drivers)
    if (callbacks.onBookingAssigned) {
      const unsub = on('booking_assigned', callbacks.onBookingAssigned)
      unsubscribers.push(unsub)
    }

    // Permission updates
    if (callbacks.onPermissionUpdate) {
      const unsub = on('permission_update', callbacks.onPermissionUpdate)
      unsubscribers.push(unsub)
    }

    return () => {
      unsubscribers.forEach(unsub => unsub && unsub())
    }
  }, [socket, callbacks])
}