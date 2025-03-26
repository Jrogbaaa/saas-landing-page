// DOM Elements
const docsContainer = document.getElementById('docs-container');

// Store for our documents
let documents = [];

// Function to create the HTML for a document card
function createDocumentCard(doc) {
  return `
    <div class="doc-card">
      <div class="doc-title">
        ${doc.url 
          ? `<a href="${doc.url}" target="_blank" rel="noopener noreferrer" tabindex="0">${doc.title}</a>` 
          : doc.title}
      </div>
      <div class="doc-meta">
        ${doc.author ? `
          <div class="doc-author">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            ${doc.author}
          </div>
        ` : ''}
        <div class="doc-date">
          ${new Date(doc.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  `;
}

// Function to render empty state
function renderEmptyState() {
  return `
    <div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3>No documents yet</h3>
      <p>Documents will appear here when they're created via Make.com.</p>
    </div>
  `;
}

// Function to render an error message
function renderError(message) {
  return `
    <div class="error-card">
      <h3>Error loading documents</h3>
      <p>${message}</p>
    </div>
  `;
}

// Function to render the documents
function renderDocuments() {
  if (documents.length === 0) {
    docsContainer.innerHTML = renderEmptyState();
    return;
  }

  const docCards = documents.map(doc => createDocumentCard(doc)).join('');
  docsContainer.innerHTML = docCards;
}

// Function to fetch documents data
async function fetchDocuments() {
  try {
    console.log('Fetching documents...');
    
    // We'll use a data.json file that will be updated by Make.com
    const response = await fetch('data.json?' + new Date().getTime());
    
    if (!response.ok) {
      throw new Error(`Failed to fetch documents (${response.status})`);
    }
    
    const data = await response.json();
    documents = Array.isArray(data) ? data : [];
    
    console.log(`Loaded ${documents.length} documents`);
    renderDocuments();
  } catch (error) {
    console.error('Error fetching documents:', error);
    docsContainer.innerHTML = renderError(error.message);
    
    // Add some sample data for testing
    documents = [
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
    ];
    
    // Render the sample documents after a short delay
    setTimeout(() => {
      renderDocuments();
    }, 2000);
  }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  // Fetch documents initially
  fetchDocuments();
  
  // Set up polling for updates every 30 seconds
  setInterval(fetchDocuments, 30000);
}); 