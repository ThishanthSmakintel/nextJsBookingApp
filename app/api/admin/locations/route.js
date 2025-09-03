import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const locations = await prisma.location.findMany()
    return NextResponse.json({ locations })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const locationData = await request.json()
    
    const location = await prisma.location.create({
      data: locationData
    })
    
    return NextResponse.json(location)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 })
  }
}

