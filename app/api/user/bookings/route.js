import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    const bookings = await prisma.booking.findMany({
      where: {
        customerId: user.id
      },
      include: {
        car: {
          include: {
            location: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}