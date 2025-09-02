import { NextResponse } from 'next/server'
import { releaseLock } from '@/lib/redis'

export async function POST(request) {
  try {
    const { lockId, carId } = await request.json()
    
    if (!lockId || !carId) {
      return NextResponse.json({ error: 'Lock ID and Car ID required' }, { status: 400 })
    }
    
    // Release the lock using the proper function
    await releaseLock(carId, lockId)
    
    return NextResponse.json({ message: 'Lock released successfully' })
  } catch (error) {
    console.error('Failed to release lock:', error)
    return NextResponse.json({ error: 'Failed to release lock' }, { status: 500 })
  }
}