import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    const cars = await prisma.car.findMany({
      include: { location: true }
    })
    
    return NextResponse.json(cars)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = verifyToken(token)
    
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    const carData = await request.json()
    
    const car = await prisma.car.create({
      data: carData,
      include: { location: true }
    })
    
    return NextResponse.json(car)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 })
  }
}