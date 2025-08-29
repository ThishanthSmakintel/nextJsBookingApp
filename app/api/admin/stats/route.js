import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      stats: {
        totalBookings: "0",
        activeUsers: "0",
        availableCars: "0",
        revenue: "$0",
        bookingsChange: "0%",
        usersChange: "0%",
        carsChange: "0%",
        revenueChange: "0%",
        bookingsTrend: "neutral",
        usersTrend: "neutral",
        carsTrend: "neutral",
        revenueTrend: "neutral"
      },
      activities: []
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}