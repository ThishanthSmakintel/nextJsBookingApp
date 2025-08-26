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
    
    const whereClause = {
      isActive: true
    }
    
    if (location) {
      whereClause.location = {
        name: {
          contains: location,
          mode: 'insensitive'
        }
      }
    }
    
    if (category) {
      whereClause.category = {
        contains: category,
        mode: 'insensitive'
      }
    }
    
    const cars = await prisma.car.findMany({
      where: whereClause,
      include: {
        location: true
      },
      orderBy: {
        dailyRate: 'asc'
      }
    })
    
    await cacheSet(cacheKey, cars, 300)
    
    return NextResponse.json(cars)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}