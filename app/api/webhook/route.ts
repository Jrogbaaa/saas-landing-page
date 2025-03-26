import { NextResponse } from 'next/server'

// Store documents in memory for demo purposes
let documents: any[] = [
  // Add a sample document for testing
  {
    id: "sample-123",
    title: "Sample Document",
    url: "https://example.com/sample",
    author: "Sample Author",
    created_at: new Date().toISOString()
  }
];

export async function POST(request: Request) {
  try {
    console.log('Webhook POST request received');
    const body = await request.json();
    console.log('Received data:', body);
    
    // Add timestamp if not provided
    const document = {
      ...body,
      created_at: body.created_at || new Date().toISOString()
    };
    
    // Add to in-memory store
    documents.unshift(document);
    
    // Keep only the last 20 documents
    if (documents.length > 20) {
      documents = documents.slice(0, 20);
    }

    console.log('Document added successfully, total documents:', documents.length);
    return NextResponse.json({ success: true, data: document });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET endpoint to retrieve documents
export async function GET() {
  console.log('Webhook GET request received, returning', documents.length, 'documents');
  return NextResponse.json({ documents });
} 