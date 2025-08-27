import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PATCH(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    const { status } = await request.json()
    const { id } = params
    
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        car: { include: { location: true } },
        customer: true,
        driver: true
      }
    })
    
    return NextResponse.json(booking)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}