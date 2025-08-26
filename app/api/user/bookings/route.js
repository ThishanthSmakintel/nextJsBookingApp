import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    const customer = await prisma.customer.findUnique({
      where: { email: user.email }
    })
    
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }
    
    const bookings = await prisma.booking.findMany({
      where: { customerId: customer.id },
      include: {
        car: { include: { location: true } },
        driver: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}