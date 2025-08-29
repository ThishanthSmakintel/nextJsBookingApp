import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete staff' }, { status: 500 })
  }
}