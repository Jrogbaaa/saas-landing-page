// In-memory document storage for demo purposes
let documents = [];

exports.handler = async function (event, context) {
  const path = event.path.replace('/.netlify/functions/api/', '');
  
  // Handle webhook POST requests
  if (path === 'webhook' && event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body);
      
      const document = {
        ...body,
        created_at: body.created_at || new Date().toISOString()
      };
      
      documents.unshift(document);
      
      // Keep only the last 10 documents
      if (documents.length > 10) {
        documents = documents.slice(0, 10);
      }
      
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, data: document })
      };
    } catch (error) {
      console.error('Webhook error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: 'Internal Server Error' })
      };
    }
  }
  
  // Handle GET requests to fetch documents
  if (path === 'webhook' && event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: JSON.stringify({ documents })
    };
  }
  
  return {
    statusCode: 404,
    body: JSON.stringify({ error: 'Not Found' })
  };
}; 