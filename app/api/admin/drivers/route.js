import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
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
    return NextResponse.json({ error: 'Failed to fetch drivers' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    const driverData = await request.json()
    
    const driver = await prisma.driver.create({
      data: driverData,
      include: { currentCar: true }
    })
    
    return NextResponse.json(driver)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create driver' }, { status: 500 })
  }
}