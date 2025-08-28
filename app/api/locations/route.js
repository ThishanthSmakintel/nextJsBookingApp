import { NextResponse } from 'next/server'

let locations = [
  {
    id: '1',
    name: 'Downtown Office',
    address: '123 Main St, City Center',
    lat: 40.7128,
    lng: -74.0060
  },
  {
    id: '2',
    name: 'Airport Terminal',
    address: '456 Airport Blvd, Terminal 1',
    lat: 40.6892,
    lng: -74.1745
  },
  {
    id: '3',
    name: 'Mall Parking',
    address: '789 Shopping Center Dr',
    lat: 40.7589,
    lng: -73.9851
  }
]

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