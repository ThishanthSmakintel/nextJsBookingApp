import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const pricingData = await request.json()
    return NextResponse.json({ id, ...pricingData })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update pricing' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete pricing' }, { status: 500 })
  }
}