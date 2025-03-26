'use client'

import { useEffect, useState } from 'react'
import type { Document } from '@/types/document'

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to fetch documents from GitHub Gist
  const fetchDocuments = async () => {
    try {
      console.log('Fetching documents from GitHub...')
      // In a real implementation, replace this with your own Gist URL
      // This is just an example URL - we'll create your gist in the next step
      const gistUrl = 'https://api.github.com/gists/YOUR_GIST_ID'
      
      const response = await fetch(gistUrl)
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Received data from GitHub')
      
      // Get documents from the Gist
      try {
        if (data.files && data.files['documents.json']) {
          const documentsContent = data.files['documents.json'].content
          const parsedDocuments = JSON.parse(documentsContent)
          setDocuments(parsedDocuments || [])
        } else {
          console.log('No documents found in Gist')
          setDocuments([])
        }
      } catch (parseError) {
        console.error('Error parsing documents:', parseError)
        setDocuments([])
      }
      
      setError(null)
    } catch (err) {
      console.error('Error fetching documents:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      
      // For GitHub Pages demo, show some sample data if we can't fetch
      setDocuments([
        {
          id: "sample-1",
          title: "Sample Document 1",
          url: "https://example.com/doc1",
          author: "John Doe",
          created_at: new Date().toISOString()
        },
        {
          id: "sample-2",
          title: "Sample Document 2",
          url: "https://example.com/doc2",
          author: "Jane Smith",
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch documents initially
    fetchDocuments()

    // Set up polling for updates every 30 seconds
    const intervalId = setInterval(fetchDocuments, 30000)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Google Docs Live Updates</h1>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Loading documents...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 my-6">
            <h2 className="text-red-800 font-medium">Error loading documents</h2>
            <p className="text-red-600 mt-1">{error}</p>
            <p className="text-gray-600 mt-3 text-sm">Documents will update from the GitHub gist every 30 seconds.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.length > 0 ? (
              documents.map((doc, index) => (
                <div
                  key={doc.id || index}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 transition-colors"
                        tabIndex={0}
                        aria-label={`Open ${doc.title} in new tab`}
                      >
                        {doc.title}
                      </a>
                    ) : (
                      doc.title
                    )}
                  </h2>
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    {doc.author && (
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                        {doc.author}
                      </span>
                    )}
                    <span>
                      {new Date(doc.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-10 text-center">
                <svg className="h-12 w-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No documents yet</h3>
                <p className="mt-2 text-gray-500">
                  Documents will appear here when they're created via Make.com.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
} 