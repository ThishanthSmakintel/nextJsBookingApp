import { NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/otp'
import { prisma } from '@/lib/db'
import { createToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, otp } = await request.json()
    
    const isValid = await verifyOTP(email, otp)
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }
    
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const token = createToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    })
    
    return NextResponse.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        role: user.role 
      } 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}