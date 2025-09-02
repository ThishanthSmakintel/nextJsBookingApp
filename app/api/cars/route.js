import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cacheGet, cacheSet } from '@/lib/redis'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')
    const category = searchParams.get('category')
    

    
    const cacheKey = `cars:${location || 'all'}:${category || 'all'}`
    const cached = await cacheGet(cacheKey)
    
    if (cached) {
      return NextResponse.json(cached)
    }
    
    // Get all active cars first
    const cars = await prisma.car.findMany({
      where: {
        isActive: true
      },
      include: {
        location: true
      },
      orderBy: {
        dailyRate: 'asc'
      }
    })
    
    // Filter by location if specified
    let filteredCars = cars
    if (location) {
      filteredCars = cars.filter(car => 
        car.location?.city?.toLowerCase().includes(location.toLowerCase())
      )
    }
    
    // Filter by category if specified
    if (category) {
      filteredCars = filteredCars.filter(car => 
        car.category?.toLowerCase().includes(category.toLowerCase())
      )
    }
    
    // Return filtered cars or all cars if no matches
    const finalCars = filteredCars.length > 0 ? filteredCars : cars
    
    console.log('🚗 Found cars:', cars.length)
    console.log('🚗 Cars data:', cars)
    
    await cacheSet(cacheKey, finalCars, 300)
    
    return NextResponse.json(finalCars)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}