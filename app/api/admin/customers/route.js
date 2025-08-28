import { NextResponse } from 'next/server'

// In-memory storage for demo
let customers = [
  {
    id: '1',
    email: 'customer1@example.com',
    name: 'John Doe',
    phone: '+1234567890',
    createdAt: new Date().toISOString()
  },
  {
    id: '2', 
    email: 'customer2@example.com',
    name: 'Jane Smith',
    phone: '+1234567891',
    createdAt: new Date().toISOString()
  }
]

export async function GET() {
  try {
    return NextResponse.json(customers)
  } catch (error) {
    console.error('Customers API error:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { email, name, phone } = await request.json()
    
    const customer = {
      id: Date.now().toString(),
      email: email || '',
      name,
      phone: phone || '',
      createdAt: new Date().toISOString()
    }
    
    customers.push(customer)
    
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