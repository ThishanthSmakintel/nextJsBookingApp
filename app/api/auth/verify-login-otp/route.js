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
    
    const customer = await prisma.customer.findUnique({
      where: { email }
    })
    
    if (!customer) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Determine role based on email (admin@carbook.com is admin)
    const role = email === 'admin@carbook.com' ? 'admin' : 'customer'
    
    const token = createToken({ 
      id: customer.id, 
      email: customer.email, 
      role 
    })
    
    return NextResponse.json({ 
      token, 
      user: { 
        id: customer.id, 
        fullName: customer.fullName, 
        email: customer.email,
        role 
      } 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}