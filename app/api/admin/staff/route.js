import { NextResponse } from 'next/server'

let staff = []

export async function GET() {
  try {
    return NextResponse.json(staff)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { email, name, phone, password } = await request.json()
    
    const newStaff = {
      id: Date.now().toString(),
      email,
      name,
      phone,
      role: 'STAFF',
      createdAt: new Date().toISOString()
    }
    
    staff.push(newStaff)
    
    return NextResponse.json(newStaff)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 })
  }
}