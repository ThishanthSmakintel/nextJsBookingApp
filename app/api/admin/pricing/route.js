import { NextResponse } from 'next/server'

let pricing = []

export async function GET() {
  try {
    return NextResponse.json(pricing)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pricing' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const pricingData = await request.json()
    const price = {
      id: Date.now().toString(),
      ...pricingData
    }
    pricing.push(price)
    return NextResponse.json(price)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create pricing' }, { status: 500 })
  }
}