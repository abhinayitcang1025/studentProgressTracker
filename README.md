# Student Progress Tracker

A small Angular (standalone components) application to manage student records and view per-student progress. The project includes a simple JSON data file for students, a CRUD `StudentService`, UI components (list, form, detail), and a Chatbot UI that forwards messages to a server-side proxy for a Gemini-like LLM.

This README explains how to set up the project locally, the architecture and key files, available scripts, how to use the chatbot feature, and how to run tests.

## Table of contents

- Project setup
- Architecture overview
- Scripts
- Chatbot usage
- Testing
- Troubleshooting & notes

## Project setup

Prerequisites
- Node.js (v18+ recommended)
- npm (comes with Node.js)
- Optional: `json-server` (we include it as a dependency, but `npx json-server` works too)

1) Install dependencies

```powershell
npm install
```

2) Serve the students data (json-server)

The application expects a `/students` REST endpoint. You can run a quick mock API using `server/data.json` with `json-server`:

```powershell
npx json-server --watch server/data.json --port 3000
```

This will expose the students collection at `http://localhost:3000/students`.

Note: The Angular `StudentService` uses relative requests to `/students` by default. In development you can either:

- Proxy the Angular dev server to `http://localhost:3000` using `proxy.conf.json` (not included), or
- Edit `src/services/student.service.ts` base URL to `http://localhost:3000` while running json-server.

3) Start the backend LLM proxy (optional; needed for `/chat`)

The project includes a minimal proxy at `server/gemini-proxy.js` that forwards `/api/chat` to an upstream Gemini-like endpoint. It requires two environment variables: `GEMINI_API_URL` and `GEMINI_API_KEY`.

In PowerShell:

```powershell
$env:GEMINI_API_URL = "https://your-gemini-endpoint.example/v1/generate"
$env:GEMINI_API_KEY = "sk-..."
node server/gemini-proxy.js
```

If you don't want to use a real LLM, you can mock the proxy with a small Express or static response server, or skip starting the proxy and the chatbot UI will report errors when attempting to send messages.

4) Run the Angular dev server

```powershell
npm start
```

Open `http://localhost:4200` in your browser. Navigate to `/students` or `/chat`.

## Architecture overview

High-level layout (key files/folders):

- `src/` — Angular app source
	- `app/` — app bootstrap and routes
		- `app.config.ts` — application providers (e.g., `provideHttpClient()`)
		- `app.routes.ts` — route definitions (students, add/edit, details, chat)
	- `components/` — standalone UI components
		- `navbar/` — top navigation
		- `students-list/` — list view, sorting, delete
		- `student-form/` — reactive form for create/edit (validation + total/grade calc)
		- `student-detail/` — per-student detail view
		- `chatbot/` — Chat UI that talks to `ChatService`
	- `models/` — TypeScript interfaces (e.g., `student.ts`)
	- `services/` — HTTP services
		- `student.service.ts` — CRUD operations for students
		- `chat.service.ts` — sends conversation payloads to `/api/chat` (proxy)

- `server/` — small local helpers
	- `data.json` — seed data for `json-server` (10 student records)
	- `gemini-proxy.js` — tiny proxy that forwards POST `/api/chat` to `GEMINI_API_URL` with `GEMINI_API_KEY`

Design notes
- The app uses Angular standalone components (no NgModule). Bootstrap happens via `bootstrapApplication(AppComponent, appConfig)`.
- `provideHttpClient()` is used in `app.config.ts` so components and services can inject `HttpClient`.
- The Chatbot UI is intentionally decoupled from LLM details: the component sends simple messages to `ChatService`, and `ChatService` posts to `/api/chat` — the proxy translates to the actual Gemini API. This avoids exposing API keys in the browser.

## Scripts

The repository `package.json` includes the following useful scripts:

- `npm start` — runs `ng serve -o` and opens the app in the browser
- `npm run build` — builds the production bundle
- `npm run watch` — builds in watch mode for development
- `npm test` — runs unit tests via Karma/Jasmine

You can also run `npx json-server --watch server/data.json --port 3000` to serve the sample students.

## Chatbot usage

1) Configure and run the proxy (see "Project setup" above). The proxy exposes `/api/chat` on the same origin as the server process. When running the proxy separately and the Angular app on port 4200, you may need to allow CORS or run the proxy on the same port via a proxy config.

2) Start the Angular app (`npm start`) and open `http://localhost:4200/chat`.

3) Use the chat input to send messages.

Notes about the proxy and security
- `server/gemini-proxy.js` is intentionally minimal—it's a development helper, not production-ready. If you deploy a proxy you should add authentication, rate-limiting, logging, input validation, and TLS.
- Keep your `GEMINI_API_KEY` secret. Do not embed it in frontend code or commit it to version control.

How responses are handled
- The `ChatbotComponent` contains a `parseResponse()` helper that attempts to normalize a variety of generative API response shapes into readable text. If you use a different LLM or API shape, you may need to adapt `server/gemini-proxy.js` or `parseResponse` to match the actual response schema.

## Testing

Unit tests are written with Jasmine and Karma. There are specs for the `StudentService` and some components (`student-form`, `student-detail`).

Run the unit tests:

```powershell
npm test
```

Notes
- If tests need to call HTTP, the code uses `HttpClientTestingModule` to mock requests — no running server required for those unit tests.
- If a test expects the `StudentService` to call a real `/students` endpoint, either run `json-server` on `server/data.json` or mock the HTTP calls in the spec.

## Troubleshooting & notes

- If the UI cannot reach `/students`, confirm `json-server` is running and that the base URL in `src/services/student.service.ts` matches your mock server (e.g., `http://localhost:3000/students`).
- If chat requests fail with CORS or 401/403, check that the proxy is running and that `GEMINI_API_KEY` is valid. The proxy forwards the Authorization header to the upstream.
- To inspect network requests in the browser, open DevTools > Network and watch requests to `/students` and `/api/chat`.

## Where to go next

- Add a `proxy.conf.json` to avoid CORS while developing with `json-server`.
- Improve the `server/gemini-proxy.js` with request validation and rate limiting before using it in production.
- Add E2E tests (Cypress or Playwright) to cover important UX flows.

If you'd like, I can:
- run the unit tests now and report results,
- start `json-server` and/or the proxy locally and verify the app end-to-end,
- or add a `proxy.conf.json` and npm script to wire the Angular dev server to the json-server mock automatically.

---
Generated on Oct 26, 2025.
