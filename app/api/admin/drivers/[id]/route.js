import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const driverData = await request.json()
    
    const driver = await prisma.driver.update({
      where: { id },
      data: driverData
    })
    
    return NextResponse.json(driver)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update driver' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    await prisma.driver.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete driver' }, { status: 500 })
  }
}