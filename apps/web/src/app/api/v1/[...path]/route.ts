import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.API_URL || 'http://localhost:4000'

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
  let body: string | undefined
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    body = await request.text()
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
