import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    
    const user = verifyToken(token)
    const { searchParams } = new URL(request.url)
    const driverId = searchParams.get('driverId')
    
    if (!driverId) {
      return NextResponse.json({ error: 'Driver ID required' }, { status: 400 })
    }
    
    // Allow admin to view any schedule, others only their own
    if (user.role !== 'admin' && user.id !== driverId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    const schedules = await prisma.driverSchedule.findMany({
      where: { driverId },
      orderBy: { dayOfWeek: 'asc' }
    })
    
    return NextResponse.json(schedules)
  } catch (error) {
    console.error('Schedule fetch error:', error.message, error.stack)
    return NextResponse.json({ error: error.message || 'Failed to fetch schedule' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    
    const user = verifyToken(token)
    const { driverId, schedules } = await request.json()
    
    if (!driverId || !schedules) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 })
    }
    
    // Allow admin to update any schedule, others only their own
    if (user.role !== 'admin' && user.id !== driverId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    // Delete existing schedules and create new ones
    await prisma.driverSchedule.deleteMany({ where: { driverId } })
    
    if (schedules.length > 0) {
      await prisma.driverSchedule.createMany({
        data: schedules
          .filter(schedule => schedule.isActive)
          .map(schedule => ({
            driverId,
            dayOfWeek: schedule.dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            isActive: schedule.isActive
          }))
      })
    }
    
    return NextResponse.json({ success: true, message: 'Schedule updated successfully' })
  } catch (error) {
    console.error('Schedule update error:', error.message, error.stack)
    return NextResponse.json({ error: error.message || 'Failed to update schedule' }, { status: 500 })
  }
}