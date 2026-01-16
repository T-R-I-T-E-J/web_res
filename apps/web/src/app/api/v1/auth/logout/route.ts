import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.API_URL || 'https://web-res.onrender.com';
    
    // Get the auth token from cookies
    const authToken = request.cookies.get('auth_token')?.value;
    
    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { 'Cookie': `auth_token=${authToken}` } : {}),
      },
    });

    const data = await response.json();

    // Create the Next.js response
    const nextResponse = NextResponse.json(data, { status: response.status });

    // Clear the auth_token cookie
    nextResponse.cookies.delete('auth_token');

    return nextResponse;
  } catch (error) {
    console.error('Logout proxy error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
