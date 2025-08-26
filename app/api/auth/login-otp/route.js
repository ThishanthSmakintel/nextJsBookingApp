import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateOTP, storeOTP, sendOTP } from '@/lib/otp'

export async function POST(request) {
  try {
    const { email } = await request.json()
    
    const user = await prisma.customer.findUnique({
      where: { email }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const otp = generateOTP()
    await storeOTP(email, otp)
    await sendOTP(email, otp)
    
    return NextResponse.json({ message: 'OTP sent to your email' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}