import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper function to add CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(request: Request) {
  try {
    console.log('Webhook POST request received');
    const docData = await request.json();
    console.log('Received data:', docData);
    
    // Save the Google Doc content to Supabase
    const { data, error } = await supabase
      .from('google_doc_content')
      .upsert({
        id: docData.id || 'default',
        title: docData.title || 'Google Doc Content',
        content: docData.content,
        last_updated: new Date().toISOString()
      });
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Document saved to Supabase successfully');
    return NextResponse.json({ success: true }, { headers: corsHeaders() });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process document' }, 
      { status: 500, headers: corsHeaders() }
    );
  }
}

// GET endpoint to retrieve the latest document
export async function GET() {
  try {
    console.log('Webhook GET request received');
    
    // Get the latest document from Supabase
    const { data, error } = await supabase
      .from('google_doc_content')
      .select('*')
      .order('last_updated', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    return NextResponse.json(
      { success: true, document: data[0] || null },
      { headers: corsHeaders() }
    );
  } catch (error) {
    console.error('Webhook GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve documents' },
      { status: 500, headers: corsHeaders() }
    );
  }
} 