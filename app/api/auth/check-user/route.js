import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request) {
  try {
    const { email } = await request.json()
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    return NextResponse.json({ name: user.name, email: user.email })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get user info' }, { status: 500 })
  }
}