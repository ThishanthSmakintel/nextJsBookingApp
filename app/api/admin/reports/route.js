import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      totalRevenue: "$0",
      totalBookings: "0", 
      activeUsers: "0",
      fleetUtilization: "0%",
      revenueChange: "0%",
      bookingsChange: "0%",
      usersChange: "0%",
      utilizationChange: "0%",
      revenueTrend: "neutral",
      bookingsTrend: "neutral",
      usersTrend: "neutral",
      utilizationTrend: "neutral"
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}