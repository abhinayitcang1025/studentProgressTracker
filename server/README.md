# Gemini Proxy

This folder contains a small proxy to forward chat requests from the Angular frontend
to a Gemini/Generative AI endpoint so your API key stays on the server.

Steps to run locally:

1. Install Node dependencies (none required besides Node 18+ with global fetch). If your Node doesn't include `fetch`, install `node-fetch` and update `gemini-proxy.js`.

2. Set environment variables before starting the proxy:

   - `GEMINI_API_URL` - full URL of the Gemini/generative endpoint you will call. Example (Google Generative API - replace with the exact model endpoint your account uses):
     `https://generativelanguage.googleapis.com/v1beta2/models/YOUR_MODEL:generateText`

   - `GEMINI_API_KEY` - the API key / Bearer token to authenticate with the upstream API.

3. Start the proxy:

   Windows PowerShell:

   ```powershell
   $env:GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta2/models/YOUR_MODEL:generateText'
   $env:GEMINI_API_KEY = 'YOUR_API_KEY'
   node server/gemini-proxy.js
   ```

   Or (bash):

   ```bash
   GEMINI_API_URL='https://generativelanguage.googleapis.com/v1beta2/models/YOUR_MODEL:generateText' GEMINI_API_KEY='YOUR_API_KEY' node server/gemini-proxy.js
   ```

4. From the Angular app, use the `ChatService.sendMessages(messages, model)` method; it will POST to `/api/chat` which the proxy exposes.

Notes
- The proxy forwards the incoming body as JSON to `GEMINI_API_URL` and sets the `Authorization: Bearer <GEMINI_API_KEY>` header. Adjust the proxy body shape in `gemini-proxy.js` if the upstream API expects a very specific request JSON structure.
- Do NOT store or check your API key into source control.
