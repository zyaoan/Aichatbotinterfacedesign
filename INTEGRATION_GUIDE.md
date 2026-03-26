# ECEasy Frontend Integration Guide

This guide explains how to integrate the ECEasy frontend interface with the FastAPI backend from the repository.

## Overview

The frontend is built with:
- React 18 with TypeScript
- Tailwind CSS v4
- React Router for navigation
- Custom API service layer for backend communication

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory of the frontend:

```env
VITE_API_BASE_URL=http://localhost:8000
```

For production, update this to your deployed backend URL.

### 2. Backend API Endpoints

The frontend expects the following API endpoints from the FastAPI backend:

#### POST `/chat`
Send a chat message with optional file uploads

**Request (multipart/form-data):**
- `message`: string - The user's message
- `session_id` (optional): string - Session identifier for conversation history
- `model` (optional): string - Model to use (openai/deepseek/ollama)
- `files` (optional): File[] - Uploaded PDF/DOC files

**Response (streaming or JSON):**
```json
{
  "response": "AI generated response text",
  "sources": [
    {
      "title": "Source document title",
      "content": "Relevant snippet from source",
      "metadata": {
        "source": "path/to/document.pdf",
        "page": 1
      }
    }
  ],
  "relatedQuestions": [
    "Follow-up question 1",
    "Follow-up question 2"
  ],
  "session_id": "unique-session-id"
}
```

**Streaming Response:**
The backend can also return Server-Sent Events (SSE) or newline-delimited JSON (NDJSON) for streaming:

```
data: {"type": "text", "content": "chunk of response"}
data: {"type": "sources", "sources": [...]}
data: {"type": "related", "relatedQuestions": [...]}
data: [DONE]
```

#### POST `/sessions`
Create a new chat session

**Response:**
```json
{
  "sessionId": "unique-session-id"
}
```

#### GET `/history/{sessionId}`
Get chat history for a specific session

**Response:**
```json
[
  {
    "role": "user",
    "content": "User message",
    "timestamp": 1234567890
  },
  {
    "role": "assistant",
    "content": "AI response",
    "sources": [...],
    "relatedQuestions": [...],
    "timestamp": 1234567891
  }
]
```

#### GET `/sessions`
Get all chat sessions

**Response:**
```json
[
  {
    "id": "session-id-1",
    "title": "Conversation title",
    "timestamp": 1234567890
  }
]
```

#### DELETE `/sessions/{sessionId}`
Delete a specific chat session

**Response:** 204 No Content

### 3. CORS Configuration

The FastAPI backend needs to allow CORS for the frontend origin. Add this to your backend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4. Running the Application

1. **Start the Backend:**
   ```bash
   cd /path/to/ECEasy
   # Follow the backend setup instructions from the repository
   python main.py  # or your backend startup command
   ```

2. **Start the Frontend:**
   ```bash
   cd /path/to/frontend
   npm install
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## API Service Architecture

The frontend uses a service layer pattern for API communication:

### `/src/config/api.config.ts`
Configuration for API endpoints and base URL

### `/src/services/api.service.ts`
Service class that handles:
- HTTP requests to the backend
- Streaming response handling (SSE and NDJSON)
- File uploads
- Session management
- Error handling

### Usage in Components

```typescript
import { apiService } from '../../services/api.service';

// Send a message with streaming
await apiService.sendMessage(
  {
    message: 'What are the prerequisites for ECE 101?',
    sessionId: currentSessionId,
    files: uploadedFiles,
  },
  (chunk) => {
    // Handle streaming chunks
    if (chunk.type === 'text') {
      updateMessageContent(chunk.content);
    }
  }
);
```

## Backend Adaptation

If your backend has different endpoint names or response formats, update:

1. **Endpoint paths:** `/src/config/api.config.ts`
2. **Response parsing:** `/src/services/api.service.ts` - Modify the `handleStreamingResponse` and `sendMessage` methods

## Features Supported

✅ Real-time streaming responses  
✅ File upload (PDF, DOC, DOCX)  
✅ Source citations display  
✅ Related questions suggestions  
✅ Chat history management  
✅ Multiple chat sessions  
✅ Session persistence  
✅ Collapsible sidebar  
✅ Responsive design  
✅ Stop generation  
✅ Error handling with fallbacks  

## Development vs Production

### Development
- Frontend: `npm run dev` (Vite dev server)
- Backend: Local FastAPI server
- API URL: `http://localhost:8000`

### Production Build
```bash
npm run build
```

This creates optimized static files in the `dist/` directory.

For production deployment:
1. Update `VITE_API_BASE_URL` to your production backend URL
2. Deploy the `dist/` folder to a static hosting service (Netlify, Vercel, etc.)
3. Ensure backend CORS allows your production frontend domain

## Troubleshooting

### Backend Connection Issues
- Check that the backend is running on the correct port
- Verify CORS is properly configured
- Check browser console for network errors
- Ensure `VITE_API_BASE_URL` matches your backend URL

### Streaming Not Working
- Verify backend returns proper content-type headers:
  - `text/event-stream` for SSE
  - `application/x-ndjson` for NDJSON
- Check that chunks are properly formatted

### File Upload Issues
- Verify backend accepts `multipart/form-data`
- Check file size limits on backend
- Ensure backend parses `files` field correctly

## Customization

### Changing Brand Colors
Update colors in `/src/app/pages/IntroPage.tsx` and `/src/app/pages/ChatPage.tsx`:
```typescript
style={{ color: '#1e3a8a' }}  // EC blue
style={{ color: '#3b82f6' }}  // Easy blue
```

### Modifying Amber Theme
The warm amber color scheme is applied via Tailwind classes:
- `bg-amber-50`, `bg-amber-100` for backgrounds
- `border-amber-200` for borders
- `bg-amber-600`, `hover:bg-amber-700` for buttons

Update these classes throughout the components to change the theme.

### Adding New Features
The architecture is modular:
- Add new API methods in `/src/services/api.service.ts`
- Create new components in `/src/app/components/`
- Add new routes in `/src/app/routes.ts`

## Contact & Support

For issues specific to:
- **Frontend:** Check this codebase and components
- **Backend:** Refer to the ECEasy repository: https://github.com/LCinHK/ECEasy
- **Integration:** Review API endpoint compatibility in this guide
