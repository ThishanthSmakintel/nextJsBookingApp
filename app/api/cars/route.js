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
    
    // Build where clause for database filtering
    const where = {
      isActive: true
    }
    
    if (location) {
      where.location = {
        city: {
          contains: location,
          mode: 'insensitive'
        }
      }
    }
    
    if (category) {
      where.category = {
        contains: category,
        mode: 'insensitive'
      }
    }
    
    const finalCars = await prisma.car.findMany({
      where,
      include: {
        location: true
      },
      orderBy: {
        dailyRate: 'asc'
      }
    })
    
    console.log('🚗 Found cars:', finalCars.length)
    console.log('🚗 Cars data:', finalCars)
    
    await cacheSet(cacheKey, finalCars, 300)
    
    return NextResponse.json(finalCars)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}