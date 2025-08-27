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
    
    const customers = await prisma.customer.findMany({
      include: {
        bookings: { select: { id: true, status: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(customers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}