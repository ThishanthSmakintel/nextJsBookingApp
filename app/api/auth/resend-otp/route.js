import { NextResponse } from 'next/server'
import { generateOTP, storeOTP, sendOTP, getOTPExpiry } from '@/lib/otp'

export async function POST(request) {
  try {
    const { email, phone } = await request.json()
    const identifier = email || phone
    
    if (!identifier) {
      return NextResponse.json({ error: 'Email or phone required' }, { status: 400 })
    }
    
    // Check if there's still time left on current OTP
    const timeLeft = await getOTPExpiry(identifier)
    if (timeLeft > 240) { // Don't allow resend if more than 4 minutes left
      return NextResponse.json({ 
        error: 'Please wait before requesting a new OTP',
        timeLeft 
      }, { status: 429 })
    }
    
    const otp = generateOTP()
    await storeOTP(identifier, otp, 300) // 5 minutes
    const sent = await sendOTP(identifier, otp)
    
    if (!sent) {
      return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'New OTP sent successfully', 
      expiresIn: 300,
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to resend OTP' }, { status: 500 })
  }
}