import { NextRequest, NextResponse } from 'next/server'

/**
 * Error reporting endpoint
 * Collects and logs client-side errors for monitoring
 */
export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json()
    
    // Validate required fields
    if (!errorData.message || !errorData.errorId) {
      return NextResponse.json(
        { error: 'Missing required fields: message, errorId' },
        { status: 400 }
      )
    }

    // Log error for monitoring
    console.error('Client Error Report:', {
      errorId: errorData.errorId,
      message: errorData.message,
      stack: errorData.stack,
      componentStack: errorData.componentStack,
      userAgent: errorData.userAgent,
      url: errorData.url,
      timestamp: errorData.timestamp,
      userId: errorData.userId || 'anonymous'
    })

    // In production, you would send this to your error monitoring service
    // Examples: Sentry, LogRocket, Bugsnag, etc.
    
    // For now, we'll just acknowledge receipt
    return NextResponse.json({
      success: true,
      errorId: errorData.errorId,
      message: 'Error report received and logged'
    })

  } catch (error) {
    console.error('Error processing error report:', error)
    return NextResponse.json(
      { error: 'Failed to process error report' },
      { status: 500 }
    )
  }
}