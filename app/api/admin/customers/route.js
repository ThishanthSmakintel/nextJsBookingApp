import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' }
    })
    return NextResponse.json(customers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { email, name, phone } = await request.json()
    
    const customer = await prisma.user.create({
      data: {
        email: email || `customer${Date.now()}@example.com`,
        name,
        phone: phone || '',
        role: 'CUSTOMER'
      }
    })
    
    return NextResponse.json(customer)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()
    const { email, name, phone } = await request.json()
    
    const index = customers.findIndex(c => c.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }
    
    customers[index] = {
      ...customers[index],
      email: email || '',
      name,
      phone: phone || ''
    }
    
    return NextResponse.json(customers[index])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()
    
    const index = customers.findIndex(c => c.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }
    
    customers.splice(index, 1)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 })
  }
}