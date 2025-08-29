import { NextResponse } from 'next/server'

let locations = [
  { id: '1', name: 'Airport Terminal', address: '123 Airport Rd', city: 'Colombo', active: true },
  { id: '2', name: 'City Center', address: '456 Main St', city: 'Colombo', active: true },
  { id: '3', name: 'Hotel District', address: '789 Hotel Ave', city: 'Kandy', active: true }
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
      ...locationData,
      active: true
    }
    locations.push(location)
    return NextResponse.json(location)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 })
  }
}