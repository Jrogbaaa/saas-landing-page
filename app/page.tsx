'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kodddurybogqynkswrzp.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvZGRkdXJ5Ym9ncXlua3N3cnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5OTgyMzQsImV4cCI6MjA1ODU3NDIzNH0.wrtLNKtAi327PeIpsOBCoW7JRRxxvxv5S0C-tnJmRpI'
)

export default function Home() {
  const [docContent, setDocContent] = useState<{
    title: string;
    content: string;
    last_updated: string;
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDocContent() {
      try {
        const { data, error } = await supabase
          .from('google_doc_content')
          .select('*')
          .order('last_updated', { ascending: false })
          .limit(1)
          .single()
        
        if (error) throw error
        setDocContent(data)
      } catch (error) {
        console.error('Error fetching document:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocContent()
    
    // Set up real-time subscription for updates
    const subscription = supabase
      .channel('google_doc_changes')
      .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'google_doc_content' },
          (payload) => {
            if (payload.new) {
              setDocContent(payload.new as any)
            }
          })
      .on('postgres_changes', 
          { event: 'UPDATE', schema: 'public', table: 'google_doc_content' },
          (payload) => {
            if (payload.new) {
              setDocContent(payload.new as any)
            }
          })
      .subscribe()
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 text-center">
          <h2 className="text-xl">Loading document content...</h2>
        </div>
      </div>
    )
  }

  if (!docContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 text-center">
          <h2 className="text-xl">No document content available yet.</h2>
          <p className="mt-2">Run your Make.com workflow to add content.</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">{docContent.title}</h1>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: docContent.content }}
        />
        <div className="mt-8 text-sm text-gray-500">
          Last updated: {new Date(docContent.last_updated).toLocaleString()}
        </div>
      </div>
    </main>
  )
} 