import { NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/otp'
import { prisma } from '@/lib/db'
import { createToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, otp } = await request.json()
    console.log('Verifying OTP:', { email, otp })
    
    const isValid = await verifyOTP(email, otp)
    console.log('OTP valid:', isValid)
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }
    
    const user = await prisma.user.findUnique({
      where: { email }
    })
    console.log('User found:', !!user)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const token = createToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role.toLowerCase() 
    })
    
    return NextResponse.json({ 
      token, 
      user: { 
        id: user.id, 
        fullName: user.name, 
        email: user.email,
        role: user.role.toLowerCase() 
      } 
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}