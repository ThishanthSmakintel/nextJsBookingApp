import { NextResponse } from 'next/server'

let pricing = [
  { id: '1', category: 'Economy', dailyRate: 50, kmRate: 0.5, currency: 'USD' },
  { id: '2', category: 'Standard', dailyRate: 75, kmRate: 0.75, currency: 'USD' },
  { id: '3', category: 'Premium', dailyRate: 120, kmRate: 1.2, currency: 'USD' },
  { id: '4', category: 'Luxury', dailyRate: 200, kmRate: 2.0, currency: 'USD' }
]

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