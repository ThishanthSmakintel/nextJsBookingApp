import { NextResponse } from 'next/server'

let locations = []

export async function GET() {
  try {
    return NextResponse.json(locations)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const locationData = await request.json()
    
    const location = {
      id: Date.now().toString(),
      ...locationData
    }
    
    locations.push(location)
    
    return NextResponse.json(location)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 })
  }
}