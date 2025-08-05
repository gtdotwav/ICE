import { NextRequest, NextResponse } from 'next/server'

/**
 * Web Vitals collection endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const vitalData = await request.json()
    
    // Validate required fields
    if (!vitalData.name || vitalData.value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, value' },
        { status: 400 }
      )
    }

    // Process web vital
    const processedVital = {
      ...vitalData,
      receivedAt: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    }

    // Log web vital (in production, send to analytics service)
    console.log('Web Vital:', processedVital)

    // Check if metric exceeds thresholds
    const thresholds = {
      FCP: 1800, // First Contentful Paint
      LCP: 2500, // Largest Contentful Paint
      FID: 100,  // First Input Delay
      CLS: 0.1,  // Cumulative Layout Shift
      TTFB: 800  // Time to First Byte
    }

    const threshold = thresholds[vitalData.name as keyof typeof thresholds]
    if (threshold && vitalData.value > threshold) {
      console.warn(`⚠️ ${vitalData.name} threshold exceeded:`, vitalData.value, '>', threshold)
      
      // In production, trigger alert
      // await triggerPerformanceAlert(vitalData.name, vitalData.value, threshold)
    }

    return NextResponse.json({
      success: true,
      vitalId: `vital_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: 'Web vital recorded successfully'
    })

  } catch (error) {
    console.error('Error processing web vital:', error)
    return NextResponse.json(
      { error: 'Failed to process web vital' },
      { status: 500 }
    )
  }
}
