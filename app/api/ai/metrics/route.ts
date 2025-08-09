import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    credits: 247,
    generationsToday: 24,
    timeSavedHours: 8.5,
    successRate: 0.94,
  })
}
