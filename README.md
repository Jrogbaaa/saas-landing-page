# Google Docs Live Updates

A simple app that displays Google Docs information in real-time, updated through Make.com workflows.

## How It Works

This is a simple static site that displays document information from a JSON file. The JSON file is updated by a Make.com workflow whenever a new Google Doc is created.

## Integration with Make.com

To set up the integration with Make.com, follow these steps:

1. **Set up a Make.com workflow with a Google Docs trigger**
   - Start with a trigger that activates when a new Google Doc is created
   - Process any data you need from the Google Doc

2. **Add a GitHub "Create or Update File" module**
   - Use the "GitHub > Create or Update File" module in Make.com
   - Configure it with these settings:

   ```
   Repository Owner: Jrogbaaa
   Repository Name: UI-EDIT
   Branch: main
   File Path: data.json
   Commit Message: Update documents from Make.com
   ```

3. **Map the content field to your documents array**
   - For the file content, you can use this formula:
   ```
   {{parseJSON(if(isEmpty(1.body); "[]"; 1.body))}}
   ```

   - This loads the existing documents first, then prepends your new document:
   ```
   [
     {
       "id": "{{formatDate(now; X)}}-{{random(1000; 9999)}}",
       "title": "{{googleDocs.title}}",
       "url": "{{googleDocs.url}}",
       "author": "{{googleDocs.lastModifyingUser.displayName}}",
       "created_at": "{{formatDate(now; YYYY-MM-DD'T'HH:mm:ss'Z')}}"
     },
     {{substring(parseJSON(if(isEmpty(1.body); "[]"; 1.body)); 1)}}
   ]
   ```

   - If you need to limit to the most recent documents only, use this:
   ```
   {{slice(parseJSON(if(isEmpty(1.body); "[]"; 1.body)); 0; 19)}}
   ```

## Customizing the Display

The app is built with simple HTML, CSS and JavaScript. You can customize how the documents are displayed by editing:

- `index.html` - Main page structure
- `styles.css` - Visual styling
- `app.js` - Logic for fetching and displaying documents

## Local Development

To test locally, simply open `index.html` in your browser.

## License

This project is MIT licensed. 