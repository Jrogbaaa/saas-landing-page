import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { RealtimeChannel } from '@supabase/supabase-js';

// Define document content type
type DocContent = {
  title: string;
  content: string;
  last_updated: string;
  id: string;
};

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function GoogleDocDisplay() {
  const [docContent, setDocContent] = useState<DocContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocContent() {
      try {
        // Get the latest document content
        const { data, error } = await supabase
          .from('google_doc_content')
          .select('*')
          .order('last_updated', { ascending: false })
          .limit(1)
          .single();
        
        if (error) throw error;
        setDocContent(data as DocContent);
      } catch (error) {
        console.error('Error fetching document:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDocContent();
    
    // Set up real-time subscription for updates
    const channel = supabase.channel('google_doc_changes');
    
    const subscription = channel
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'google_doc_content' },
        (payload) => {
          if (payload.new && typeof payload.new === 'object') {
            setDocContent(payload.new as DocContent);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'google_doc_content' },
        (payload) => {
          if (payload.new && typeof payload.new === 'object') {
            setDocContent(payload.new as DocContent);
          }
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="p-6">Loading document content...</div>;
  }

  if (!docContent) {
    return <div className="p-6">No document content available yet.</div>;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{docContent.title}</h2>
      <div 
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: docContent.content }}
      />
      <div className="text-sm text-gray-500 mt-4">
        Last updated: {new Date(docContent.last_updated).toLocaleString()}
      </div>
    </div>
  );
} 