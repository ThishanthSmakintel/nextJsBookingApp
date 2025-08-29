import { NextResponse } from 'next/server'
import { generateToken, comparePassword } from '@/lib/auth'
import prisma from '@/lib/db'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    })
    
    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    if (user.role !== 'ADMIN' && user.role !== 'STAFF') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    
    // Demo login - hardcoded password check
    const isValid = (email === 'admin@carbook.com' && password === 'admin123') || 
                   (email === 'staff@carbook.com' && password === 'staff123')
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    const token = generateToken(user)
    
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}