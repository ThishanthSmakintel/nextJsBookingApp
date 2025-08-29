import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import prisma from '@/lib/db'
import { checkPermission } from '@/lib/rbac'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    const hasPermission = await checkPermission(user.id, 'drivers', 'read')
    if (!hasPermission) {
      console.log('Access denied for user:', user.id, 'to drivers:read')
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }
    
    const drivers = await prisma.driver.findMany({
      include: {
        currentCar: true,
        bookings: { select: { id: true, status: true } }
      },
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json(drivers)
  } catch (error) {
    console.error('Drivers GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch drivers' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    const hasPermission = await checkPermission(user.id, 'drivers', 'create')
    if (!hasPermission) {
      console.log('Access denied for user:', user.id, 'to drivers:create')
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }
    
    const driverData = await request.json()
    
    const driver = await prisma.driver.create({
      data: driverData,
      include: { currentCar: true }
    })
    
    return NextResponse.json(driver)
  } catch (error) {
    console.error('Drivers POST error:', error)
    return NextResponse.json({ error: 'Failed to create driver' }, { status: 500 })
  }
}