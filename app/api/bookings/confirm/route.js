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
    
    const { lockId, carId, startTime, endTime, pricingMode, estimatedKm, withDriver } = await request.json()
    
    const customer = await prisma.customer.findUnique({
      where: { id: user.id }
    })
    
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found', clearSession: true }, { status: 404 })
    }
    
    const car = await prisma.car.findUnique({
      where: { id: carId },
      include: { location: true }
    })
    
    const hours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60)
    let carPrice = pricingMode === 'daily' 
      ? Math.ceil(hours / 24) * car.dailyRate
      : (estimatedKm || 0) * car.kmRate
    
    let driverPrice = 0
    if (withDriver && estimatedKm) {
      const driverSetting = await prisma.settings.findUnique({
        where: { key: 'driver_rate_per_km' }
      })
      const driverRate = driverSetting ? parseFloat(driverSetting.value) : 2.5
      driverPrice = estimatedKm * driverRate
    }
    
    const totalPrice = carPrice + driverPrice
    
    const booking = await prisma.booking.create({
      data: {
        carId,
        customerId: customer.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        pricingMode,
        estimatedKm,
        totalPrice,
        driverPrice,
        withDriver: withDriver || false,
        status: 'PENDING'
      },
      include: {
        car: { include: { location: true } },
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
      console.error('Failed to send confirmation email:', emailError)
    }
    
    return NextResponse.json(booking)
  } catch (error) {
    return NextResponse.json({ error: 'Booking confirmation failed' }, { status: 500 })
  }
}