import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: true,
        car: true,
        driver: true
      }
    })
    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { customerId, carId, startTime, endTime, totalPrice } = await request.json()
    
    const booking = await prisma.booking.create({
      data: {
        customerId,
        carId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        totalPrice: parseFloat(totalPrice) || 100,
        status: 'CONFIRMED'
      }
    })
    
    return NextResponse.json(booking)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}