import { NextResponse } from 'next/server'
import { generateOTP, storeOTP, sendOTP } from '@/lib/otp'

export async function POST(request) {
  try {
    const { phone } = await request.json()
    
    const otp = generateOTP()
    await storeOTP(phone, otp)
    await sendOTP(phone, otp)
    
    return NextResponse.json({ message: 'OTP sent successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}