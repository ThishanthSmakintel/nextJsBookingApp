import { NextResponse } from 'next/server'
import { verifyOTP, getPendingRegistration } from '@/lib/otp'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { createToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, otp, fullName } = await request.json()
    
    const isValid = await verifyOTP(email, otp)
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }
    
    if (!fullName) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 })
    }
    
    // Create user directly
    const user = await prisma.user.create({
      data: {
        name: fullName,
        email,
        password: 'oauth_user', // No password for OTP users
        role: 'CUSTOMER'
      }
    })
    
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
    return NextResponse.json({ error: 'OTP verification failed' }, { status: 500 })
  }
}