import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    let setting = await prisma.settings.findUnique({
      where: { key: 'driver_rate_per_km' }
    })
    
    if (!setting) {
      setting = await prisma.settings.create({
        data: {
          key: 'driver_rate_per_km',
          value: '2.5',
          description: 'Driver rate per kilometer'
        }
      })
    }
    
    return NextResponse.json({ rate: parseFloat(setting.value) })
  } catch (error) {
    return NextResponse.json({ rate: 2.5 })
  }
}