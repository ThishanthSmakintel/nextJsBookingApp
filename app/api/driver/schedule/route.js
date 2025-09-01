import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const decoded = verifyToken(token)
    
    if (!decoded || decoded.role !== 'DRIVER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const schedule = await prisma.driverSchedule.findMany({
      where: { driverId: decoded.userId }
    })

    return NextResponse.json(schedule)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 })
  }
}