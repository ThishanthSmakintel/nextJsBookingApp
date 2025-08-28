import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { checkPermission, assignPermissions } from '@/lib/rbac'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    // Temporarily allow access
    // if (!user || !(await checkPermission(user.id, 'rbac', 'read'))) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    // }
    
    const users = await prisma.user.findMany({
      include: {
        permissions: {
          include: { permission: true },
          where: { granted: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    const permissions = await prisma.permission.findMany()
    
    return NextResponse.json({ users, permissions })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch RBAC data' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    if (!user || !(await checkPermission(user.id, 'rbac', 'update'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    const { userId, permissions } = await request.json()
    
    const success = await assignPermissions(userId, permissions)
    
    if (success) {
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: 'Failed to update permissions' }, { status: 500 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update permissions' }, { status: 500 })
  }
}