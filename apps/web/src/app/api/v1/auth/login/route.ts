import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendUrl = process.env.API_URL || 'https://web-res.onrender.com';
    
    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Create the Next.js response
    const nextResponse = NextResponse.json(data, { status: response.status });

    // Extract and parse Set-Cookie headers from backend
    const setCookieHeaders = response.headers.getSetCookie();
    
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookieString) => {
        // Parse the cookie to extract name and value
        const [nameValue, ...attributes] = cookieString.split(';');
        const [name, value] = nameValue.split('=');
        
        if (name && value) {
          // Set cookie using NextResponse.cookies API for better control
          nextResponse.cookies.set({
            name: name.trim(),
            value: value.trim(),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // Changed from 'none' since we're now same-domain
            path: '/',
            maxAge: 24 * 60 * 60, // 1 day
          });
        }
      });
    }

    return nextResponse;
  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
