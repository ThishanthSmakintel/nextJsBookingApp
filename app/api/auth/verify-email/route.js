import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyOTP } from '@/lib/otp'
import { createToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, otp, fullName } = await request.json()
    
    const isValidOTP = await verifyOTP(email, otp)
    if (!isValidOTP) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }
    
    let customer = await prisma.customer.findUnique({
      where: { email }
    })
    
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          userId: `cust_${Date.now()}`,
          fullName: fullName || email.split('@')[0],
          phone: '',
          email,
          password: ''
        }
      })
    }
    
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
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}