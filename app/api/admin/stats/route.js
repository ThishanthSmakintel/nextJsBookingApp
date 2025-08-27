import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redis } from '@/lib/redis'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    const today = new Date().toISOString().split('T')[0]
    
    const [totalBookings, totalCars, totalCustomers, activeBookings, availableCars, totalDrivers] = await Promise.all([
      prisma.booking.count(),
      prisma.car.count(),
      prisma.customer.count(),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.car.count({ where: { isActive: true } }),
      prisma.driver.count()
    ])
    
    return NextResponse.json({
      totalBookings,
      activeBookings,
      totalCars,
      availableCars,
      totalCustomers,
      totalDrivers
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}