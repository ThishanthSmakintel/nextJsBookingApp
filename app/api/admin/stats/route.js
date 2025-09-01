import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const decoded = verifyToken(token)
    
    if (!decoded || (decoded.role !== 'ADMIN' && decoded.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [bookings, users, cars] = await Promise.all([
      prisma.booking.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.car.count({ where: { available: true } })
    ])

    const revenue = await prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: { status: 'CONFIRMED' }
    })

    return NextResponse.json({
      bookings,
      users,
      cars,
      revenue: revenue._sum.totalPrice || 0
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}