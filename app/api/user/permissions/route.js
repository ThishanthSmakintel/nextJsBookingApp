import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getUserPermissions } from '@/lib/rbac'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    console.log('API: Getting permissions for user:', user?.id, user?.role)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const permissions = await getUserPermissions(user.id)
    console.log('API: Found permissions:', permissions.length, permissions)
    
    return NextResponse.json({ permissions })
  } catch (error) {
    console.error('Get user permissions error:', error)
    return NextResponse.json({ error: 'Failed to get permissions' }, { status: 500 })
  }
}