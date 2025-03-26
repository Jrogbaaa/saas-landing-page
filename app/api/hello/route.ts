import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    hello: 'world',
    timestamp: new Date().toISOString(),
    status: 'working' 
  });
} 