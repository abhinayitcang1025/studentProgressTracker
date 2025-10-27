/**
 * Simple Express proxy for Gemini / Generative AI endpoints.
 *
 * Usage:
 *   - Set environment variables:
 *       GEMINI_API_URL  => full upstream endpoint (e.g. Google Generative API URL for the model)
 *       GEMINI_API_KEY  => API key / Bearer token to authenticate to the upstream API
 *   - Run:
 *       node server/gemini-proxy.js
 *
 * The server exposes POST /api/chat and forwards the received JSON body to
 * the GEMINI_API_URL with Authorization: Bearer <GEMINI_API_KEY>.
 *
 * Note: This proxy intentionally forwards the payload as-is (wrapped in { model, messages, options })
 * so you can control the exact shape expected by your chosen Gemini endpoint. Adjust as needed
 * for the exact Generative API request format.
 */

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;
const UPSTREAM = process.env.GEMINI_API_URL; // e.g. https://generativelanguage.googleapis.com/v1beta2/models/YOUR-MODEL:generateText
const API_KEY = process.env.GEMINI_API_KEY;

if (!UPSTREAM || !API_KEY) {
  console.warn('GEMINI_API_URL and/or GEMINI_API_KEY not set. The proxy will return 500 until they are provided.');
}

app.post('/api/chat', async (req, res) => {
  if (!UPSTREAM || !API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_URL and GEMINI_API_KEY must be set on the server.' });
  }

  try {
    // Forward the incoming body to the configured upstream endpoint.
    // We set Authorization header and pass application/json.
    const upstreamResponse = await fetch(UPSTREAM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(req.body)
    });

    const contentType = upstreamResponse.headers.get('content-type') || '';
    const text = await upstreamResponse.text();

    // Attempt to parse JSON responses, otherwise send raw text
    if (contentType.includes('application/json')) {
      return res.status(upstreamResponse.status).json(JSON.parse(text));
    }

    res.status(upstreamResponse.status).send(text);
  } catch (err) {
    console.error('Error proxying to upstream:', err);
    res.status(500).json({ error: 'Proxy error', detail: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Gemini proxy listening on http://localhost:${PORT} - forwarding to: ${UPSTREAM || '<not configured>'}`);
});
