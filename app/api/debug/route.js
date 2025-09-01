import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    // Check if token exists
    if (!token) {
      return NextResponse.json({ 
        error: 'No token provided',
        status: 'unauthorized'
      }, { status: 401 })
    }
    
    // Verify token
    let user
    try {
      user = verifyToken(token)
    } catch (error) {
      return NextResponse.json({ 
        error: 'Invalid token',
        status: 'unauthorized',
        tokenError: error.message
      }, { status: 401 })
    }
    
    // Check database connection
    let dbStatus = 'connected'
    let userCount = 0
    try {
      userCount = await prisma.user.count()
    } catch (error) {
      dbStatus = 'error: ' + error.message
    }
    
    return NextResponse.json({
      status: 'ok',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      database: {
        status: dbStatus,
        userCount
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Debug endpoint error',
      message: error.message,
      status: 'error'
    }, { status: 500 })
  }
}