import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateOTP, storeOTP, sendOTP, getOTPExpiry } from '@/lib/otp'

export async function POST(request) {
  try {
    const { email } = await request.json()
    
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const otp = generateOTP()
    await storeOTP(email, otp, 300) // 5 minutes
    const sent = await sendOTP(email, otp)
    
    if (!sent) {
      return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'OTP sent successfully', 
      expiresIn: 300,
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}