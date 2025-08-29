import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const leaves = await prisma.leave.findMany({
      include: {
        driver: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(leaves)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leaves' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { createdByAdmin } = body
    
    const leave = await prisma.leave.create({
      data: {
        employeeId: body.employeeId,
        employeeType: body.employeeType,
        leaveType: body.leaveType,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        reason: body.reason,
        status: createdByAdmin ? 'APPROVED' : 'PENDING',
        approvedBy: createdByAdmin ? 'ADMIN' : null
      }
    })
    return NextResponse.json(leave)
  } catch (error) {
    console.error('Leave creation error:', error)
    return NextResponse.json({ error: 'Failed to create leave', details: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, status, approvedBy } = body
    
    const leave = await prisma.leave.update({
      where: { id },
      data: { status, approvedBy }
    })
    return NextResponse.json(leave)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update leave' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    await prisma.leave.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to cancel leave' }, { status: 500 })
  }
}