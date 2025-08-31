import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { assignPermissions } from '@/lib/rbac'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      include: {
        permissions: {
          include: { permission: true }
        }
      }
    })

    const permissions = await prisma.permission.findMany()

    return NextResponse.json({ users, permissions })
  } catch (error) {
    console.error('RBAC GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch RBAC data' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { userId, permissions: userPermissions } = await request.json()
    
    const success = await assignPermissions(userId, userPermissions)
    
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Failed to update permissions' }, { status: 500 })
    }
  } catch (error) {
    console.error('RBAC POST error:', error)
    return NextResponse.json({ error: 'Failed to update permissions' }, { status: 500 })
  }
}