import { NextResponse } from 'next/server'

let cars = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    licensePlate: 'ABC-123',
    category: 'Sedan',
    dailyRate: 50,
    isActive: true
  },
  {
    id: '2',
    make: 'Honda',
    model: 'CR-V',
    year: 2022,
    licensePlate: 'XYZ-789',
    category: 'SUV',
    dailyRate: 70,
    isActive: true
  }
]

export async function GET() {
  try {
    return NextResponse.json(cars)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const carData = await request.json()
    
    const car = {
      id: Date.now().toString(),
      ...carData,
      isActive: true
    }
    
    cars.push(car)
    
    return NextResponse.json(car)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 })
  }
}