# Hriatna

Hriatna is a web-first AI assistant that combines voice input, browser speech output, and a Spring Boot backend connected to Gemini. The long-term goal is to build a live multimodal assistant that can understand user questions along with surrounding context from camera, screen, logs, documents, and session memory.

The current version proves the most important Phase 1 loop:

```text
User speaks/types a question
        ↓
Next.js frontend captures the input
        ↓
Spring Boot backend receives the question
        ↓
Backend calls Gemini API
        ↓
Gemini response is returned as JSON
        ↓
Frontend renders the answer
        ↓
Browser speaks the answer using speechSynthesis
```

---

## Current Status

### Completed

* Next.js frontend shell
* Voice-to-text input using the browser Web Speech API
* Textarea-based question input
* Basic camera context UI/prototype
* Spring Boot backend setup
* `/api/ask` REST endpoint
* Controller → Service → LLM Client backend layering
* Gemini API integration from Spring Boot
* API key loaded from environment variable
* JSON response from backend
* Frontend parsing backend JSON response
* Basic browser text-to-speech response

### Not Yet Implemented

* OAuth/login
* Persistent history database
* WebSocket live streaming
* Production camera frame pipeline
* FastAPI `ai-services` integration
* Real multimodal vision reasoning
* Long-term session memory
* Mobile app
* Deployment

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Browser Web Speech API
* Browser `speechSynthesis`
* Browser camera APIs

### Backend

* Java
* Spring Boot
* Spring Web
* Gemini API
* Environment-based API key configuration

### Future AI Services

* Python
* FastAPI
* Vision analysis
* Log/RAG analysis
* Agent workflows
* Session summarization

---

## Current Architecture

```text
┌──────────────────────────────┐
│          Browser              │
│  Next.js + React Frontend     │
│                              │
│  - Voice input                │
│  - Text question box          │
│  - Result panel               │
│  - Browser TTS                │
└───────────────┬──────────────┘
                │
                │ POST /api/ask
                │ text/plain question
                ▼
┌──────────────────────────────┐
│       Spring Boot Backend     │
│                              │
│  QuestionController           │
│        ↓                     │
│  QuestionService              │
│        ↓                     │
│  LlmClient                    │
└───────────────┬──────────────┘
                │
                │ Gemini generateContent API
                ▼
┌──────────────────────────────┐
│          Gemini API           │
│                              │
│  Returns model answer         │
└───────────────┬──────────────┘
                │
                │ JSON response
                ▼
┌──────────────────────────────┐
│          Frontend             │
│                              │
│  - Displays answer            │
│  - Speaks answer aloud        │
└──────────────────────────────┘
```

---

## Phase 1 Flow

The current goal of Phase 1 is to prove the simplest possible end-to-end AI assistant loop.

```text
Voice/Text Question
        ↓
Frontend
        ↓
Spring Boot REST API
        ↓
Gemini API
        ↓
Spring Boot JSON Response
        ↓
Frontend Answer UI
        ↓
Browser Speech Output
```

### Phase 1 Design Choices

Phase 1 intentionally avoids:

* Real authentication
* Database
* WebSockets
* FastAPI
* Camera streaming
* History persistence
* Complex session memory
* Production voice models

The purpose is to prove the hardest basic integration first:

```text
Frontend ↔ Spring Boot ↔ LLM API ↔ Spoken Response
```

Once this loop works, every future feature becomes additive.

---

## Backend Request/Response

### Endpoint

```http
POST /api/ask
```

### Current Request

The current request body is raw text:

```text
Explain Spring Boot in one sentence
```

Content type:

```http
Content-Type: text/plain
```

### Current Response

The backend returns JSON:

```json
{
  "answer": "Spring Boot is a Java framework that simplifies building production-ready web applications and APIs.",
  "model": "gemini-2.5-flash",
  "status": "success"
}
```

---

## Backend Layering

Current backend structure:

```text
backend/src/main/java/com/hriatna/backend/
  controller/
    QuestionController.java

  service/
    QuestionService.java

  llm/
    LlmClient.java

  dto/
    AskResponse.java
```

### Responsibility Split

```text
QuestionController
  - Handles HTTP request/response
  - Returns ResponseEntity
  - Converts service result into API response

QuestionService
  - Validates question
  - Owns business-level ask flow
  - Calls LlmClient

LlmClient
  - Talks to Gemini API
  - Builds request payload
  - Extracts answer from Gemini response

AskResponse
  - DTO returned to frontend as JSON
```

---

## Environment Variables

The backend requires a Gemini API key.

### Required Variable

```text
GEMINI_API_KEY
```

### Windows Setup

Set it once:

```powershell
setx GEMINI_API_KEY "your_actual_key_here"
```

Then close and reopen the terminal.

Verify:

```powershell
echo $env:GEMINI_API_KEY
```

Do not commit API keys to Git.

---

## Spring Boot Configuration

Inside:

```text
backend/src/main/resources/application.properties
```

Use:

```properties
gemini.api-key=${GEMINI_API_KEY}
gemini.model=gemini-2.5-flash
```

---

## Running the Project Locally

### 1. Run Backend

From the root project folder:

```powershell
cd backend
.\mvnw spring-boot:run
```

Backend should run on:

```text
http://localhost:8080
```

Test with Postman:

```http
POST http://localhost:8080/api/ask
```

Body:

```text
Explain Java in one sentence
```

Expected response:

```json
{
  "answer": "...",
  "model": "gemini-2.5-flash",
  "status": "success"
}
```

---

### 2. Run Frontend

Open another terminal:

```powershell
cd frontend
npm run dev
```

Frontend should run on:

```text
http://localhost:3000
```

---

## Current Frontend Flow

```text
User types or speaks question
        ↓
VoiceInput converts speech to text
        ↓
MainWorkspace updates textarea
        ↓
Analyze button calls analyzeAwareness()
        ↓
api.ts calls Spring Boot /api/ask
        ↓
Backend JSON is mapped into AwarenessResult
        ↓
ResultPanel displays answer
        ↓
speech.ts speaks answer aloud
```

---

## Current Frontend Structure

```text
frontend/src/
  app/
    page.tsx

  components/
    layout/
      AppShell.tsx
      Sidebar.tsx
      MainWorkspace.tsx
      ResultPanel.tsx

    inputs/
      VoiceInput.tsx
      CameraInput.tsx

  lib/
    api.ts
    speech.ts

  types/
    index.ts
```

---

## Important Browser Notes

Voice input currently uses the browser Web Speech API.

Works best in:

```text
Google Chrome
Microsoft Edge
```

May not work properly in:

```text
Firefox
Opera GX
Some mobile browsers
```

Browser speech output uses:

```text
window.speechSynthesis
```

This is good enough for Phase 1, but later the project can use higher-quality AI voice APIs.

---

## Current Limitations

* Voice input depends on browser support.
* TTS is browser-native and robotic.
* Backend accepts raw text instead of a structured request DTO.
* Result UI still looks like an analysis/debug panel.
* Camera UI exists, but camera context is not yet sent to Gemini.
* No real auth.
* No database.
* No WebSocket session.
* No FastAPI AI service in the active request path.
* No persistent memory.

---

# Future Phases

## Phase 1 — Core Loop

### Goal

Prove the simplest voice assistant loop.

```text
Voice/Text Question
→ Frontend
→ Spring Boot
→ Gemini
→ Frontend
→ Spoken Answer
```

### Status

Mostly complete.

### Includes

* Voice-to-text
* Text input
* Spring Boot REST endpoint
* Gemini API call
* JSON response
* Browser TTS

### Does Not Include

* Camera reasoning
* WebSockets
* OAuth
* Database
* FastAPI
* Persistent memory

---

## Phase 2 — Backend API Cleanup

### Goal

Make the backend contract more production-like.

### Planned Work

* Add `AskRequest` DTO

```json
{
  "question": "What is Spring Boot?",
  "mode": "auto"
}
```

* Keep `AskResponse` DTO

```json
{
  "answer": "...",
  "model": "...",
  "status": "success"
}
```

* Add better error handling
* Use proper HTTP status codes
* Add global exception handler
* Add request validation
* Add latency metadata

Possible future response:

```json
{
  "answer": "...",
  "model": "gemini-2.5-flash",
  "status": "success",
  "latencyMs": 842
}
```

---

## Phase 3 — UI Simplification

### Goal

Move from an analysis dashboard to an assistant-style experience.

Current UI is useful for debugging, but the product should eventually feel like:

```text
User:
What should I do next?

Hriatna:
Start with the highest-priority task in front of you...
```

### Planned Work

* Replace heavy result panel with assistant answer view
* Move debug metadata behind “Show details”
* Keep mode/context controls minimal
* Make answer the main focus
* Keep voice-first interaction

---

## Phase 4 — Camera Context MVP

### Goal

Use camera context in a controlled, non-streaming way.

### Planned Flow

```text
Camera ON
        ↓
Frontend captures compressed frames
        ↓
User asks question
        ↓
Frontend sends question + selected recent frames
        ↓
Spring Boot forwards context to Gemini or ai-services
        ↓
Answer returned
```

### Important Design

Do not send raw full-resolution camera frames.

Use:

```text
320px or 480px width
JPEG quality 0.5–0.7
small rolling buffer
send only selected recent frames
```

### Principle

```text
capture buffer ≠ API payload
```

The frontend may keep several compressed frames locally, but only send a few useful frames when needed.

---

## Phase 5 — Live Session WebSocket

### Goal

Move from request-response to a live assistant session.

### Future Flow

```text
Frontend
→ opens WebSocket to Spring Boot
→ streams compressed context events
→ sends user question events
→ receives assistant answer events
```

### WebSocket Events

Frontend may send:

```json
{
  "type": "context.frame",
  "sessionId": "abc123",
  "timestamp": 1234567890,
  "frame": "base64-compressed-jpeg"
}
```

```json
{
  "type": "user.question",
  "sessionId": "abc123",
  "question": "What bottle did you see earlier?"
}
```

Backend may send:

```json
{
  "type": "assistant.final_answer",
  "answer": "I saw a metallic water bottle earlier."
}
```

### Why WebSocket Later?

WebSocket is for continuous context.

REST is still useful for:

* Login
* History
* Session creation
* Simple one-shot questions
* Settings

---

## Phase 6 — FastAPI AI Services

### Goal

Introduce specialized Python AI services when the product needs more advanced reasoning.

### Future Architecture

```text
Frontend
        ↓
Spring Boot Product Backend
        ↓
FastAPI ai-services
        ↓
LLM / Vision / RAG / Agent workflows
```

### Why Keep FastAPI Separate?

Spring Boot owns:

* Auth
* Users
* Sessions
* History
* Rate limits
* Product APIs
* WebSocket orchestration

FastAPI owns:

* Vision processing
* Log/RAG pipelines
* Agent workflows
* LLM-specific orchestration
* Model experimentation

### Important Rule

Frontend should not directly call FastAPI in production.

Correct:

```text
Frontend → Spring Boot → FastAPI
```

Avoid:

```text
Frontend → FastAPI
```

---

## Phase 7 — OAuth and User Sessions

### Goal

Add real user identity.

### Planned Work

* Google OAuth login
* Hardcoded test user removed
* `/api/me`
* Session cookie or JWT
* User-specific history
* User-specific memory
* Logout

### Possible Endpoints

```http
GET /api/me
POST /api/logout
GET /api/auth/status
```

---

## Phase 8 — History and Memory

### Goal

Persist useful user sessions and answers.

### Planned Work

* Save questions and answers
* Save session summaries
* Save important memory only
* Add history panel backed by database
* Add ability to delete history
* Add memory controls

### Possible Tables

```text
users
sessions
messages
analysis_results
memory_items
```

---

## Phase 9 — Production Voice

### Goal

Move beyond browser-native speech.

### Planned Work

* Better speech-to-text
* Better text-to-speech
* Streaming response audio
* Interruptions
* Stop speaking button
* Voice settings
* Natural assistant turn-taking

Current:

```text
Browser Web Speech API
Browser speechSynthesis
```

Future:

```text
Realtime voice model or dedicated STT/TTS provider
```

---

## Phase 10 — Deployment

### Goal

Run the system outside local development.

### Planned Work

* Frontend deployment
* Backend deployment
* Environment variables in deployment platform
* CORS configuration
* HTTPS
* Logging
* Health checks
* Rate limits
* Basic monitoring

Possible split:

```text
Frontend: Vercel / Netlify
Backend: Render / Railway / Fly.io / AWS / GCP
AI Services: separate container
Database: Postgres
```

---

# Long-Term Vision

Hriatna should become a live context-aware assistant.

Final product direction:

```text
User speaks naturally
        ↓
Assistant understands question
        ↓
Assistant uses current context
        ↓
Assistant remembers recent session state
        ↓
Assistant answers by voice
        ↓
Assistant can help with surroundings, screen, code, logs, and tasks
```

Long-term architecture:

```text
┌──────────────────────────────┐
│          Frontend             │
│  Next.js / React / Mobile     │
│                              │
│  Voice, camera, screen, UI    │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│      Spring Boot Backend      │
│                              │
│  Auth, sessions, history,     │
│  WebSocket, orchestration     │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│       FastAPI AI Services     │
│                              │
│  Vision, RAG, agents, tools   │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│        Model Providers        │
│                              │
│  Gemini / OpenAI / others     │
└──────────────────────────────┘
```

---

## Current Milestone Summary

The current version proves that Hriatna can already complete the core assistant loop:

```text
Ask → Backend → LLM → Answer → Voice
```

Everything after this is about making that loop more contextual, reliable, real-time, and product-ready.
