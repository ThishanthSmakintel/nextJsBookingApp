import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateOTP, storeOTP, sendOTP, storePendingRegistration } from '@/lib/otp'

export async function POST(request) {
  try {
    const { email, fullName, phone, password } = await request.json()
    
    const existingUser = await prisma.customer.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }
    
    const otp = generateOTP()
    await storeOTP(email, otp)
    await storePendingRegistration(email, { fullName, phone, password })
    await sendOTP(email, otp)
    
    return NextResponse.json({
      exists: false,
      message: 'OTP sent to your email'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process email' }, { status: 500 })
  }
}