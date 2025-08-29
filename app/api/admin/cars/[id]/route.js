import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const carData = await request.json()
    
    const car = await prisma.car.update({
      where: { id },
      data: {
        ...carData,
        year: carData.year ? parseInt(carData.year) : undefined,
        pricePerHour: carData.pricePerHour ? parseFloat(carData.pricePerHour) : undefined
      }
    })
    
    return NextResponse.json(car)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update car' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    await prisma.car.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 })
  }
}