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

export async function PUT(request) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()
    const locationData = await request.json()
    
    const index = locations.findIndex(l => l.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }
    
    locations[index] = { ...locations[index], ...locationData }
    return NextResponse.json(locations[index])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()
    
    const index = locations.findIndex(l => l.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }
    
    locations.splice(index, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 })
  }
}