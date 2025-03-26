import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Show environment variables without exposing the full values
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    const envStatus = {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? `Set (starting with ${supabaseUrl.substring(0, 10)}...)` : 'Not set',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? 'Set (masked for security)' : 'Not set',
      SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey ? 'Set (masked for security)' : 'Not set'
    };
    
    // Only try to connect if we have the necessary environment variables
    let connectionTest = 'Not attempted';
    let tableTest = 'Not attempted';
    
    if (supabaseUrl && supabaseServiceKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { data, error } = await supabase.from('google_doc_content').select('count(*)', { count: 'exact' });
        
        connectionTest = error ? `Error: ${error.message}` : 'Success';
        tableTest = data ? 'Table exists and is accessible' : 'Could not access table';
      } catch (err: any) {
        connectionTest = `Exception: ${err.message}`;
      }
    }
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      environmentVariables: envStatus,
      supabaseConnection: connectionTest,
      tableCheck: tableTest
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 