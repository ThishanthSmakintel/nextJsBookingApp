import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import prisma from '@/lib/db'
import { checkPermission } from '@/lib/rbac'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    if (!user || !(await checkPermission(user.id, 'staff', 'read'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    const staff = await prisma.user.findMany({
      where: { role: 'STAFF' },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        isActive: true,
        createdAt: true,
        permissions: {
          include: { permission: true },
          where: { granted: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(staff)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    if (!user || !(await checkPermission(user.id, 'staff', 'create'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    const { email, name, phone, password } = await request.json()
    
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }
    
    const staff = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        password: password || 'temp123',
        role: 'STAFF'
      }
    })
    
    return NextResponse.json(staff)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 })
  }
}