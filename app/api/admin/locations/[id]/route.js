import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const locationData = await request.json()
    
    const location = await prisma.location.update({
      where: { id },
      data: locationData
    })
    
    return NextResponse.json(location)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    await prisma.location.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 })
  }
}