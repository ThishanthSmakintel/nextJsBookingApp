import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const maintenances = await prisma.maintenance.findMany({
      include: {
        car: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(maintenances)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch maintenances' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const maintenance = await prisma.maintenance.create({
      data: {
        carId: body.carId,
        type: body.type,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        cost: body.cost ? parseFloat(body.cost) : null
      }
    })
    return NextResponse.json(maintenance)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create maintenance' }, { status: 500 })
  }
}