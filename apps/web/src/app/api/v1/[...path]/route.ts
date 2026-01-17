import { NextRequest, NextResponse } from 'next/server'

// Resolve the backend URL:
// 1. API_URL (Server-side env var)
// 2. NEXT_PUBLIC_API_URL (Client-side env var, stripped of /api/v1 suffix)
// 3. Fallback to localhost:4000
const getBackendUrl = () => {
  if (process.env.API_URL) return process.env.API_URL;
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, '');
  return 'http://localhost:4000';
};

const BACKEND_URL = getBackendUrl();

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path)
}

async function proxyRequest(request: NextRequest, path: string[]) {
  const pathString = path.join('/')
  const url = `${BACKEND_URL}/api/v1/${pathString}`
  
  // Get request body if present
  let body: BodyInit | null | undefined
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    body = request.body
  }

  // Forward headers (excluding host and connection)
  const headers = new Headers()
  request.headers.forEach((value, key) => {
    if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
      headers.set(key, value)
    }
  })

  // Make request to backend
  const response = await fetch(url, {
    method: request.method,
    headers,
    body,
    // @ts-ignore - duplex is required for streaming bodies in Node environments but not yet in TS types
    duplex: 'half', 
  })



  // Get response body
  const responseBody = await response.text()

  // Create response with same status
  const nextResponse = new NextResponse(responseBody, {
    status: response.status,
    statusText: response.statusText,
  })

  // Forward headers including Set-Cookie, but exclude problematic ones
  response.headers.forEach((value, key) => {
    if (!['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) {
      nextResponse.headers.set(key, value)
    }
  })

  return nextResponse
}
