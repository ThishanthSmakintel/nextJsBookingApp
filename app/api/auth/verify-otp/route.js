import { NextResponse } from 'next/server'
import { verifyOTP, getPendingRegistration } from '@/lib/otp'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { createToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, otp } = await request.json()
    
    const isValid = await verifyOTP(email, otp)
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }
    
    const pendingData = await getPendingRegistration(email)
    if (!pendingData) {
      return NextResponse.json({ error: 'Registration data not found' }, { status: 400 })
    }
    
    const hashedPassword = await bcrypt.hash(pendingData.password, 12)
    
    const customer = await prisma.customer.create({
      data: {
        userId: `cust_${Date.now()}`,
        fullName: pendingData.fullName,
        phone: pendingData.phone,
        email,
        password: hashedPassword
      }
    })
    
    const token = createToken({ 
      id: customer.id, 
      email: customer.email, 
      role: 'customer' 
    })
    
    return NextResponse.json({ 
      token, 
      user: { 
        id: customer.id, 
        fullName: customer.fullName, 
        email: customer.email 
      } 
    })
  } catch (error) {
    return NextResponse.json({ error: 'OTP verification failed' }, { status: 500 })
  }
}