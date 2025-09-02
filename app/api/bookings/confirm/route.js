import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { releaseLock } from '@/lib/redis'
import { emitEvent, EVENTS } from '@/lib/events'
import { sendBookingConfirmationEmail } from '@/lib/email'

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    const { lockId, carId, startTime, endTime, pricingMode, estimatedKm, withDriver, paymentType } = await request.json()
    
    const customer = await prisma.user.findUnique({
      where: { id: user.id }
    })
    
    if (!customer) {
      return NextResponse.json({ error: 'User not found', clearSession: true }, { status: 404 })
    }
    
    const car = await prisma.car.findUnique({
      where: { id: carId }
    })
    
    const hours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60)
    let carPrice = pricingMode === 'daily' 
      ? Math.ceil(hours / 24) * (car.dailyRate || car.pricePerHour * 24)
      : (estimatedKm || 0) * (car.kmRate || 0.5)
    
    let driverPrice = 0
    if (withDriver) {
      driverPrice = 50 // Fixed daily rate
    }
    
    const totalPrice = carPrice + driverPrice
    
    const booking = await prisma.booking.create({
      data: {
        carId,
        customerId: customer.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        totalPrice,
        pricingMode: pricingMode || 'daily',
        estimatedKm: estimatedKm || 0,
        driverPrice,
        withDriver: withDriver || false,
        paymentType: paymentType || 'PAY_LATER',
        paymentStatus: paymentType === 'PAY_NOW' ? 'PENDING' : 'PENDING',
        status: 'PENDING'
      },
      include: {
        car: {
          include: {
            location: true
          }
        },
        customer: true
      }
    })
    
    await releaseLock(carId, lockId)
    
    await emitEvent(EVENTS.CAR_UNLOCKED, { carId, lockId })
    await emitEvent(EVENTS.BOOKING_CREATED, {
      booking,
      customer,
      car
    })
    
    try {
      await sendBookingConfirmationEmail(customer.email, booking)
    } catch (emailError) {
      // Email sending failed silently
    }
    
    return NextResponse.json(booking)
  } catch (error) {
    return NextResponse.json({ error: 'Booking confirmation failed' }, { status: 500 })
  }
}