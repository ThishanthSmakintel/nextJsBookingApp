import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { createToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    
    // Only allow admin email
    if (email !== 'admin@carbook.com') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    
    const customer = await prisma.customer.findUnique({
      where: { email }
    })
    
    if (!customer || !await bcrypt.compare(password, customer.password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    const token = createToken({ 
      id: customer.id, 
      email: customer.email, 
      role: 'admin' 
    })
    
    return NextResponse.json({ 
      token, 
      user: { 
        id: customer.id, 
        fullName: customer.fullName, 
        email: customer.email,
        role: 'admin'
      } 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}