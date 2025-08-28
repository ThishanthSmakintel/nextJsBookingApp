import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getUserPermissions } from '@/lib/rbac'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const permissions = await getUserPermissions(user.id)
    
    return NextResponse.json({ permissions })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 })
  }
}