import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { createToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const { fullName, phone, email, password } = await request.json()
    
    const existingUser = await prisma.customer.findFirst({
      where: { OR: [{ email }, { phone }] }
    })
    
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }
    
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const customer = await prisma.customer.create({
      data: {
        userId: `cust_${Date.now()}`,
        fullName,
        phone,
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
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}