import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1'
    
    const response = await fetch(`${API_URL}/results`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch results' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching results:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
