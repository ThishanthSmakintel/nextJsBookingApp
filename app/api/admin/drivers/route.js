import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const drivers = await prisma.driver.findMany()
    return NextResponse.json(drivers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch drivers' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const driverData = await request.json()
    
    const driver = await prisma.driver.create({
      data: driverData
    })
    
    return NextResponse.json(driver)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create driver' }, { status: 500 })
  }
}