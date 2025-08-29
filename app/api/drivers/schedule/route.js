import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { checkPermission } from '@/lib/rbac'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    
    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const driverId = searchParams.get('driverId')
    
    if (!driverId) {
      return NextResponse.json({ error: 'Driver ID required' }, { status: 400 })
    }
    
    // Check permissions - drivers can only view their own schedule
    const hasPermission = await checkPermission(user.id, 'schedule', 'read')
    if (!hasPermission && user.id !== driverId) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
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
    
    // Check permissions - drivers can only update their own schedule
    const hasPermission = await checkPermission(user.id, 'schedule', 'update')
    if (!hasPermission && user.id !== driverId) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
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