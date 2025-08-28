import { NextResponse } from 'next/server'

let bookings = []

export async function GET() {
  try {
    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { customerId, carId, startTime, endTime, totalPrice, pricingMode, withDriver, pickupLocation, dropoffLocation, notes } = await request.json()
    
    const booking = {
      id: Date.now().toString(),
      customerId,
      carId,
      startTime,
      endTime,
      totalPrice: totalPrice || 100,
      pricingMode: pricingMode || 'DAILY',
      withDriver: withDriver || false,
      pickupLocation,
      dropoffLocation,
      notes,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    }
    
    bookings.push(booking)
    
    return NextResponse.json(booking)
  } catch (error) {
    console.error('Create booking error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}