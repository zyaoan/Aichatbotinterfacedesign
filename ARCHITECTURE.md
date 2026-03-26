# ECEasy Frontend Architecture

## System Overview

The ECEasy frontend is a React-based single-page application (SPA) that connects to the ECEasy FastAPI backend to provide an intelligent AI chatbot interface for ECE students.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                            │
│                                                                 │
│  ┌───────────────┐              ┌────────────────┐            │
│  │  Intro Page   │──────────────▶│   Chat Page    │            │
│  │   (Landing)   │   Navigate    │ (Main Interface)│            │
│  └───────────────┘              └────────┬───────┘            │
│                                          │                      │
│                                          │                      │
│              ┌───────────────────────────┼────────────────┐    │
│              │                           │                │    │
│              │    ┌──────────────┐   ┌──┴──────────┐     │    │
│              │    │   Sidebar    │   │  Messages   │     │    │
│              │    │  (History)   │   │   Area      │     │    │
│              │    └──────────────┘   └─────────────┘     │    │
│              │                                            │    │
│              │              ┌──────────────┐             │    │
│              │              │ Message Input│             │    │
│              │              │ + File Upload│             │    │
│              │              └──────────────┘             │    │
│              │                                            │    │
│              └────────────────────────────────────────────┘    │
│                                                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS + SSE
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    ECEasy Backend                               │
│                     (FastAPI)                                   │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Chat API    │  │  Sessions    │  │  File Upload │        │
│  │  /chat       │  │  /sessions   │  │  /upload     │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                 │                 │                  │
│         └─────────────────┼─────────────────┘                  │
│                           │                                    │
│                  ┌────────▼─────────┐                          │
│                  │   RAG Pipeline   │                          │
│                  │   • Retrieval    │                          │
│                  │   • Generation   │                          │
│                  │   • Reranking    │                          │
│                  └────────┬─────────┘                          │
│                           │                                    │
│              ┌────────────┼────────────┐                       │
│              │            │            │                       │
│    ┌─────────▼──────┐  ┌─▼──────┐  ┌──▼──────────┐          │
│    │   LLM APIs     │  │ FAISS  │  │  Session    │          │
│    │ (OpenAI/       │  │Vector  │  │  Store      │          │
│    │  DeepSeek/     │  │  DB    │  │             │          │
│    │  Ollama)       │  │        │  │             │          │
│    └────────────────┘  └────────┘  └─────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Component Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        App.tsx                           │
│                    (Root Component)                      │
│                                                          │
│         ┌────────────────────────────────┐              │
│         │      RouterProvider            │              │
│         │                                │              │
│         │  ┌─────────────────────────┐  │              │
│         │  │    Route: /             │  │              │
│         │  │    Component: IntroPage │  │              │
│         │  │                         │  │              │
│         │  │  • Logo & Branding      │  │              │
│         │  │  • Feature Showcase     │  │              │
│         │  │  • "Start Chatting" CTA │  │              │
│         │  └─────────────────────────┘  │              │
│         │                                │              │
│         │  ┌─────────────────────────┐  │              │
│         │  │    Route: /chat         │  │              │
│         │  │    Component: ChatPage  │  │              │
│         │  │                         │  │              │
│         │  │  ┌─────────────────┐   │  │              │
│         │  │  │   Sidebar       │   │  │              │
│         │  │  │                 │   │  │              │
│         │  │  │  • New Chat     │   │  │              │
│         │  │  │  • History List │   │  │              │
│         │  │  │  • Session Mgmt │   │  │              │
│         │  │  └─────────────────┘   │  │              │
│         │  │                         │  │              │
│         │  │  ┌─────────────────┐   │  │              │
│         │  │  │  ChatMessage    │   │  │              │
│         │  │  │   (Multiple)    │   │  │              │
│         │  │  │                 │   │  │              │
│         │  │  │  • User Msg     │   │  │              │
│         │  │  │  • AI Response  │   │  │              │
│         │  │  │  • Sources      │   │  │              │
│         │  │  │  • Related Q's  │   │  │              │
│         │  │  └─────────────────┘   │  │              │
│         │  │                         │  │              │
│         │  │  ┌─────────────────┐   │  │              │
│         │  │  │  MessageInput   │   │  │              │
│         │  │  │                 │   │  │              │
│         │  │  │  • Text Input   │   │  │              │
│         │  │  │  • File Upload  │   │  │              │
│         │  │  │  • Send Button  │   │  │              │
│         │  │  └─────────────────┘   │  │              │
│         │  └─────────────────────────┘  │              │
│         └────────────────────────────────┘              │
└──────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

### 1. User Sends Message

```
User Types Message
        │
        ├──► MessageInput component captures input
        │
        ├──► Optional: Files attached
        │
        ├──► handleSendMessage() in ChatPage
        │
        ├──► Creates user message in state
        │
        ├──► Creates placeholder assistant message
        │
        ├──► apiService.sendMessage({
        │         message: string,
        │         sessionId: string?,
        │         files: File[]?
        │    })
        │
        └──► POST /chat to Backend
```

### 2. Backend Processing

```
Backend Receives Request
        │
        ├──► Extract message & files
        │
        ├──► Generate embeddings
        │
        ├──► Query FAISS vector database
        │
        ├──► Retrieve relevant documents
        │
        ├──► Rerank results
        │
        ├──► Send to LLM with context
        │
        └──► Stream response back to frontend
```

### 3. Frontend Receives Response

```
Streaming Response
        │
        ├──► chunk: { type: 'text', content: '...' }
        │    └──► Append to assistant message
        │
        ├──► chunk: { type: 'sources', sources: [...] }
        │    └──► Update message with sources
        │
        ├──► chunk: { type: 'related', relatedQuestions: [...] }
        │    └──► Update message with questions
        │
        └──► chunk: { type: 'done' }
             └──► Mark message as complete
```

## Service Layer Architecture

```
┌────────────────────────────────────────────────┐
│            API Service Layer                   │
│         (api.service.ts)                       │
│                                                │
│  ┌──────────────────────────────────────┐    │
│  │  ApiService Class                    │    │
│  │                                      │    │
│  │  • sendMessage()                     │    │
│  │    - Handles HTTP POST              │    │
│  │    - Manages streaming              │    │
│  │    - Parses SSE/NDJSON             │    │
│  │                                      │    │
│  │  • getSessions()                     │    │
│  │    - Fetches session list           │    │
│  │                                      │    │
│  │  • createSession()                   │    │
│  │    - Creates new session            │    │
│  │                                      │    │
│  │  • getChatHistory()                  │    │
│  │    - Loads previous messages        │    │
│  │                                      │    │
│  │  • deleteSession()                   │    │
│  │    - Removes session                │    │
│  │                                      │    │
│  │  • uploadFiles()                     │    │
│  │    - Handles file uploads           │    │
│  │                                      │    │
│  └──────────────────────────────────────┘    │
│                                                │
│  Config: api.config.ts                        │
│  • BASE_URL                                   │
│  • ENDPOINTS                                  │
│  • TIMEOUT                                    │
│                                                │
└────────────────────────────────────────────────┘
```

## State Management

### ChatPage State

```typescript
// Message history
messages: Message[]
  ├─ id: string
  ├─ role: 'user' | 'assistant'
  ├─ content: string
  ├─ sources?: Source[]
  ├─ relatedQuestions?: string[]
  └─ isStreaming?: boolean

// Session management
currentChatId: string
sessionId?: string

// UI state
isLoading: boolean
isSidebarOpen: boolean

// Refs
messagesEndRef: RefObject
abortControllerRef: RefObject
```

### Sidebar State

```typescript
// Chat sessions
chats: Chat[]
  ├─ id: string
  ├─ title: string
  └─ timestamp: string

// Loading state
isLoadingSessions: boolean
```

## API Communication Patterns

### Pattern 1: Regular JSON Response

```
Frontend                    Backend
   │                           │
   ├──── POST /chat ───────────▶
   │     { message: "..." }    │
   │                           │
   │                      Process
   │                           │
   │◀──── JSON Response ────────┤
   │     { response: "..." }   │
   │                           │
```

### Pattern 2: Server-Sent Events (SSE)

```
Frontend                    Backend
   │                           │
   ├──── POST /chat ───────────▶
   │     { message: "..." }    │
   │                           │
   │◀──── data: {"type":"text"}┤ Stream
   │◀──── data: {"type":"text"}┤ Stream
   │◀──── data: {"type":"text"}┤ Stream
   │◀──── data: [DONE] ────────┤ Complete
   │                           │
```

### Pattern 3: Newline-Delimited JSON (NDJSON)

```
Frontend                    Backend
   │                           │
   ├──── POST /chat ───────────▶
   │     { message: "..." }    │
   │                           │
   │◀──── {"type":"text"}\n ───┤ Stream
   │◀──── {"type":"text"}\n ───┤ Stream
   │◀──── {"type":"done"}\n ───┤ Complete
   │                           │
```

## File Upload Flow

```
User Selects Files
        │
        ├──► FileInput captures files
        │
        ├──► Display file chips
        │
        ├──► User sends message
        │
        ├──► FormData created:
        │    • message: string
        │    • files: File[]
        │    • session_id: string
        │
        ├──► POST to /chat
        │    Content-Type: multipart/form-data
        │
        ├──► Backend extracts files
        │
        ├──► Files added to context
        │
        └──► Response includes file context
```

## Error Handling Strategy

```
┌─────────────────────────────────────────┐
│         Error Handling Flow             │
│                                         │
│  Try:                                   │
│    ├─ API Call                          │
│    └─ Success: Update UI                │
│                                         │
│  Catch:                                 │
│    ├─ Network Error                     │
│    │   └─ Show offline message          │
│    │                                    │
│    ├─ Timeout Error                     │
│    │   └─ Show timeout message          │
│    │                                    │
│    ├─ 4xx Error (Client)                │
│    │   └─ Show validation error         │
│    │                                    │
│    ├─ 5xx Error (Server)                │
│    │   └─ Show server error             │
│    │                                    │
│    └─ Unknown Error                     │
│        └─ Show generic error            │
│                                         │
│  Fallback:                              │
│    └─ Use mock data (development)       │
│                                         │
└─────────────────────────────────────────┘
```

## Performance Optimizations

### 1. Code Splitting
- Automatic via React Router
- Lazy loading for routes

### 2. Streaming
- Character-by-character display
- Reduces perceived latency
- Better user experience

### 3. Memoization
- React.memo for components
- useMemo for expensive computations
- useCallback for event handlers

### 4. Virtual Scrolling
- Efficient rendering of long chat histories
- Only visible messages in DOM

### 5. Asset Optimization
- SVG for icons (lucide-react)
- Optimized logo imports
- Minimal bundle size

## Security Considerations

### Frontend Security

```
┌────────────────────────────────────────┐
│       Security Measures                │
│                                        │
│  1. Environment Variables              │
│     • API keys not in source           │
│     • Use VITE_* prefix                │
│                                        │
│  2. Input Sanitization                 │
│     • Escape user input                │
│     • Validate file types              │
│     • Check file sizes                 │
│                                        │
│  3. HTTPS Only (Production)            │
│     • Encrypted communication          │
│     • Secure cookies                   │
│                                        │
│  4. CORS Validation                    │
│     • Backend restricts origins        │
│     • No wildcard in production        │
│                                        │
│  5. XSS Prevention                     │
│     • React automatic escaping         │
│     • No dangerouslySetInnerHTML       │
│                                        │
└────────────────────────────────────────┘
```

## Deployment Architecture

### Development

```
Developer Machine
├── Frontend (Vite Dev Server)
│   └── http://localhost:5173
│
└── Backend (FastAPI)
    └── http://localhost:8000
```

### Production

```
┌──────────────────────────────────────���
│            CDN/Static Host           │
│         (Netlify/Vercel)             │
│                                      │
│    Frontend Static Files (dist/)    │
│    • index.html                      │
│    • JavaScript bundles              │
│    • CSS                             │
│    • Assets                          │
│                                      │
└────────────┬─────────────────────────┘
             │
             │ API Calls
             │
┌────────────▼─────────────────────────┐
│        Production Server             │
│                                      │
│  ┌────────────────────────────┐    │
│  │      FastAPI Backend       │    │
│  │      (with HTTPS)          │    │
│  └────────────────────────────┘    │
│                                      │
│  ┌────────────────────────────┐    │
│  │      Database/Storage      │    │
│  │   • FAISS Vector DB        │    │
│  │   • Session Store          │    │
│  └────────────────────────────┘    │
│                                      │
└──────────────────────────────────────┘
```

## Technology Stack

### Frontend Core
- **React 18**: UI framework
- **TypeScript 5**: Type safety
- **Vite**: Build tool
- **React Router 7**: Navigation

### Styling
- **Tailwind CSS v4**: Utility-first CSS
- **Motion**: Animations
- **Lucide React**: Icons

### Backend Integration
- **Fetch API**: HTTP requests
- **Server-Sent Events**: Streaming
- **FormData**: File uploads

### Development
- **Hot Module Replacement**: Fast dev
- **ESLint**: Code quality
- **TypeScript**: Type checking

## Scalability Considerations

### Frontend Scalability
- Static files can be served from CDN
- No server-side rendering needed
- Horizontal scaling via CDN distribution

### Backend Scalability
- Stateless API design
- Session storage can be moved to Redis
- LLM calls can be load balanced
- FAISS can be distributed

### Future Enhancements
- WebSocket for real-time features
- Service workers for offline support
- Progressive Web App (PWA)
- Client-side caching strategies
