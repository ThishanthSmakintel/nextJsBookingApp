import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { assignPermissions, updateUserRole } from '@/lib/rbac'

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { userId, permissions, role } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    let success = true

    // Update role if provided
    if (role) {
      success = await updateUserRole(userId, role)
    }

    // Update permissions if provided
    if (permissions && success) {
      success = await assignPermissions(userId, permissions)
    }

    if (success) {
      return NextResponse.json({ 
        message: 'Permissions updated successfully',
        realTimeUpdate: true 
      })
    } else {
      return NextResponse.json({ error: 'Failed to update permissions' }, { status: 500 })
    }

  } catch (error) {
    console.error('Permission update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}