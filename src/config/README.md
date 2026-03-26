# API Configuration Guide

This directory contains configuration files for connecting the frontend to the ECEasy backend.

## Files

- `api.config.ts` - API endpoint configuration and base URL settings

## Customizing for Your Backend

If your backend has different endpoint paths or response formats, follow these steps:

### 1. Update Endpoint Paths

Edit `/src/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  
  ENDPOINTS: {
    // Update these paths to match your backend
    CHAT: '/chat',           // Your chat endpoint
    QUERY: '/query',         // Alternative query endpoint
    UPLOAD: '/upload',       // File upload endpoint
    HISTORY: '/history',     // Chat history endpoint
    SESSIONS: '/sessions',   // Session management endpoint
  },
};
```

### 2. Common Backend Variations

#### Variation A: Prefixed API Routes

If your backend uses `/api/v1/` prefix:

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  ENDPOINTS: {
    CHAT: '/chat',
    // ... rest of endpoints
  },
};
```

#### Variation B: Different Endpoint Names

If your backend uses different names:

```typescript
export const API_CONFIG = {
  ENDPOINTS: {
    CHAT: '/messages/send',          // Instead of /chat
    UPLOAD: '/files/upload',         // Instead of /upload
    HISTORY: '/conversations/:id',   // Instead of /history/:id
    SESSIONS: '/conversations',      // Instead of /sessions
  },
};
```

#### Variation C: RESTful Structure

If your backend follows strict REST:

```typescript
export const API_CONFIG = {
  ENDPOINTS: {
    CHAT: '/conversations/:id/messages',
    SESSIONS: '/conversations',
    HISTORY: '/conversations/:id',
  },
};
```

### 3. Adapting Response Format

If your backend returns different response structures, you may need to update the API service.

#### Example: Different Source Format

Your backend returns:
```json
{
  "answer": "...",
  "citations": [
    {
      "document": "file.pdf",
      "text": "snippet",
      "meta": { "page": 1 }
    }
  ]
}
```

Update `/src/services/api.service.ts`:

```typescript
// In handleStreamingResponse or sendMessage
return {
  response: data.answer,  // Changed from data.response
  sources: data.citations?.map(cite => ({
    title: cite.document,
    content: cite.text,
    metadata: cite.meta,
  })),
  // ... rest
};
```

### 4. Custom Authentication

If your backend requires authentication:

#### Option A: Bearer Token

```typescript
// In api.service.ts, update fetch calls:
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${getAuthToken()}`,
    // ...
  },
  // ...
});
```

#### Option B: API Key

```typescript
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'X-API-Key': import.meta.env.VITE_API_KEY,
    // ...
  },
  // ...
});
```

Add to `.env`:
```env
VITE_API_KEY=your-api-key-here
```

### 5. WebSocket Instead of HTTP

If your backend uses WebSocket for chat:

Create new file `/src/services/websocket.service.ts`:

```typescript
export class WebSocketService {
  private ws: WebSocket | null = null;

  connect(url: string) {
    this.ws = new WebSocket(url);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Handle message
    };
  }

  sendMessage(message: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ message }));
    }
  }
}
```

Update `ChatPage.tsx` to use WebSocket instead of fetch.

## Testing Your Configuration

### 1. Test Endpoints

Create a test file to verify endpoints:

```typescript
// test-api.ts
import { apiService } from './services/api.service';

async function testAPI() {
  try {
    // Test chat endpoint
    const response = await apiService.sendMessage({
      message: 'Test message',
    });
    console.log('Chat response:', response);

    // Test sessions endpoint
    const sessions = await apiService.getSessions();
    console.log('Sessions:', sessions);
    
  } catch (error) {
    console.error('API test failed:', error);
  }
}

testAPI();
```

### 2. Use Browser Console

In browser console:
```javascript
// Test API configuration
fetch('http://localhost:8000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'test' })
}).then(r => r.json()).then(console.log);
```

### 3. Network Inspector

Use browser DevTools → Network tab to:
1. Inspect actual request URLs
2. Check request/response headers
3. Verify response format
4. Debug CORS issues

## Common Patterns

### Pattern 1: FastAPI with Pydantic

Backend:
```python
from pydantic import BaseModel
from fastapi import FastAPI

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[Source]

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    return ChatResponse(...)
```

Frontend: ✅ Already compatible (default configuration)

### Pattern 2: Express.js REST API

Backend:
```javascript
app.post('/api/chat', async (req, res) => {
  const { message, sessionId } = req.body;
  const response = await generateResponse(message);
  res.json({ response, sources: [...] });
});
```

Frontend: Update `api.config.ts` to use `/api` prefix

### Pattern 3: GraphQL API

Backend:
```graphql
type Query {
  chat(message: String!, sessionId: String): ChatResponse
}
```

Frontend: Create new GraphQL service instead of REST service

## Environment-Specific Configuration

### Development
```typescript
// api.config.ts
const isDev = import.meta.env.DEV;

export const API_CONFIG = {
  BASE_URL: isDev 
    ? 'http://localhost:8000'
    : import.meta.env.VITE_API_BASE_URL,
  // ...
};
```

### Multiple Environments

```typescript
const environments = {
  development: 'http://localhost:8000',
  staging: 'https://staging-api.eceasy.com',
  production: 'https://api.eceasy.com',
};

const env = import.meta.env.VITE_ENV || 'development';

export const API_CONFIG = {
  BASE_URL: environments[env],
  // ...
};
```

## Debugging Tips

### Enable Verbose Logging

Add to `api.service.ts`:

```typescript
const DEBUG = import.meta.env.VITE_DEBUG === 'true';

private async sendMessage(...) {
  if (DEBUG) {
    console.log('Sending message:', request);
  }
  
  const response = await fetch(...);
  
  if (DEBUG) {
    console.log('Response:', await response.clone().json());
  }
  
  return response;
}
```

Enable in `.env`:
```env
VITE_DEBUG=true
```

### Mock Mode for Development

Create a mock service for development without backend:

```typescript
// services/mock-api.service.ts
export const mockApiService = {
  async sendMessage(request) {
    return {
      response: 'Mock response',
      sources: [],
      relatedQuestions: [],
    };
  },
};

// In ChatPage.tsx
const apiService = import.meta.env.VITE_USE_MOCK === 'true' 
  ? mockApiService 
  : realApiService;
```

## Support

If you need help adapting the configuration:
1. Check the actual API responses in Network tab
2. Compare with expected format in `api.service.ts`
3. Update transformation logic as needed
4. Test each endpoint individually
5. Refer to [INTEGRATION_GUIDE.md](../../INTEGRATION_GUIDE.md)
