import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const docData = req.body;
    
    // Save the Google Doc content to Supabase
    const { data, error } = await supabase
      .from('google_doc_content')
      .upsert({
        id: docData.id || 'default',
        title: docData.title || 'Google Doc Content',
        content: docData.content,
        last_updated: new Date().toISOString()
      });
    
    if (error) throw error;
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Failed to process document' });
  }
} 