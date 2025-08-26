import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { lockCar } from '@/lib/redis'
import { emitEvent, EVENTS } from '@/lib/events'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    const { carId, startTime, endTime } = await request.json()
    const lockId = uuidv4()
    
    const locked = await lockCar(carId, lockId, 600) // 10 minutes
    
    if (locked) {
      await emitEvent(EVENTS.CAR_LOCKED, { carId, lockId, userId: user.id })
      
      return NextResponse.json({ 
        lockId, 
        expiresAt: new Date(Date.now() + 600000).toISOString() 
      })
    } else {
      return NextResponse.json({ error: 'Car is not available' }, { status: 409 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Precheck failed' }, { status: 500 })
  }
}