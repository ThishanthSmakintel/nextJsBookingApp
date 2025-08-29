import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const customerData = await request.json()
    
    const customer = await prisma.user.update({
      where: { id },
      data: customerData
    })
    
    return NextResponse.json(customer)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    await prisma.user.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 })
  }
}