# ECEasy Frontend Deployment Guide

This guide covers deploying the ECEasy frontend to work with the backend from the GitHub repository.

## Quick Start (Development)

### 1. Backend Setup

```bash
# Clone the ECEasy repository
git clone https://github.com/LCinHK/ECEasy.git
cd ECEasy

# Switch to the correct branch
git checkout ECEasy_zyaoan_2

# Navigate to the backend (adjust path based on repo structure)
cd newDesign/AiChatBotInterfaceDesign  # or wherever the backend is located

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python main.py  # or uvicorn main:app --reload
```

The backend should now be running on `http://localhost:8000`

### 2. Frontend Setup

```bash
# In a new terminal, navigate to the frontend directory
cd /path/to/ECEasy-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env to point to your backend
echo "VITE_API_BASE_URL=http://localhost:8000" > .env

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Backend Integration Checklist

### Required Backend Endpoints

Ensure your FastAPI backend implements these endpoints:

- [x] `POST /chat` - Send chat messages (with streaming support)
- [x] `GET /sessions` - Get all chat sessions
- [x] `POST /sessions` - Create new session
- [x] `GET /history/{sessionId}` - Get chat history
- [x] `DELETE /sessions/{sessionId}` - Delete session
- [x] `POST /upload` - Upload files (optional)

### Backend Configuration

#### 1. CORS Setup

Your FastAPI backend needs CORS enabled:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative port
        "https://your-production-domain.com"  # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### 2. Streaming Response

For streaming responses, use one of these formats:

**Server-Sent Events (SSE):**
```python
from fastapi.responses import StreamingResponse

@app.post("/chat")
async def chat_endpoint():
    async def generate():
        yield "data: {\"type\":\"text\",\"content\":\"Hello\"}\n\n"
        yield "data: [DONE]\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream"
    )
```

**Newline-Delimited JSON (NDJSON):**
```python
@app.post("/chat")
async def chat_endpoint():
    async def generate():
        yield '{"type":"text","content":"Hello"}\n'
        yield '{"type":"done"}\n'
    
    return StreamingResponse(
        generate(),
        media_type="application/x-ndjson"
    )
```

#### 3. Response Format

The frontend expects this response structure:

```json
{
  "response": "AI generated response",
  "sources": [
    {
      "title": "Document Title",
      "content": "Relevant content snippet",
      "metadata": {
        "source": "path/to/file.pdf",
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

## Production Deployment

### Option 1: Static Hosting (Netlify, Vercel, etc.)

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your hosting service

3. **Environment variables:**
   - Set `VITE_API_BASE_URL` to your production backend URL
   - Example: `https://api.eceasy.com`

4. **Backend CORS:**
   - Update backend CORS to allow your production domain

### Option 2: Docker Deployment

#### Frontend Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (optional - if you want to serve both from same domain)
    location /api {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build: 
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build: ../ECEasy  # Path to backend
    ports:
      - "8000:8000"
    environment:
      - ENV=production
```

### Option 3: Same Server Deployment

If deploying frontend and backend on the same server:

1. **Build frontend:**
   ```bash
   npm run build
   ```

2. **Serve with backend:**
   ```python
   from fastapi import FastAPI
   from fastapi.staticfiles import StaticFiles
   
   app = FastAPI()
   
   # API routes
   @app.post("/chat")
   async def chat():
       pass
   
   # Serve frontend
   app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")
   ```

3. **Update frontend API config:**
   ```env
   VITE_API_BASE_URL=/api
   ```

4. **Prefix all API routes with `/api`**

## Environment Configuration

### Development
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Staging
```env
VITE_API_BASE_URL=https://staging-api.eceasy.com
```

### Production
```env
VITE_API_BASE_URL=https://api.eceasy.com
```

## Testing Backend Integration

### 1. Health Check

Test backend is running:
```bash
curl http://localhost:8000/health
```

### 2. CORS Test

```bash
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:8000/chat
```

Should return CORS headers.

### 3. Chat Endpoint

```bash
curl -X POST http://localhost:8000/chat \
  -F "message=What are ECE prerequisites?" \
  -F "session_id=test-123"
```

### 4. Sessions Endpoint

```bash
curl http://localhost:8000/sessions
```

## Troubleshooting

### Issue: CORS Errors

**Symptom:** Browser console shows CORS policy errors

**Fix:**
1. Check backend CORS middleware is configured
2. Verify frontend origin is in `allow_origins`
3. Ensure `allow_credentials=True` if using cookies

### Issue: Streaming Not Working

**Symptom:** Responses appear all at once, not streaming

**Fix:**
1. Verify backend returns correct content-type
2. Check browser network tab for response headers
3. Test streaming with curl: `curl -N http://localhost:8000/chat`

### Issue: 404 on API Calls

**Symptom:** API calls return 404

**Fix:**
1. Check `VITE_API_BASE_URL` is correct
2. Verify backend endpoints match `/src/config/api.config.ts`
3. Check backend is running on correct port

### Issue: File Upload Fails

**Symptom:** File uploads return 400 or 413 errors

**Fix:**
1. Check backend file size limits
2. Verify multipart/form-data is handled correctly
3. Check backend logs for detailed errors

## Monitoring

### Frontend Logs

Access logs in browser console:
```javascript
// Enable debug logging
localStorage.setItem('debug', 'true')
```

### Backend Logs

Monitor FastAPI logs:
```bash
tail -f backend.log
```

### Network Debugging

Use browser DevTools → Network tab to inspect:
- Request headers
- Response headers
- Payload
- Response time

## Security Considerations

### Production Checklist

- [ ] Use HTTPS for production backend
- [ ] Configure proper CORS origins (not `*`)
- [ ] Set up rate limiting on backend
- [ ] Implement authentication if needed
- [ ] Sanitize file uploads
- [ ] Set appropriate CSP headers
- [ ] Enable HSTS headers
- [ ] Use environment variables for secrets

### HTTPS Setup

For production, use HTTPS:

1. **Backend:** Use reverse proxy (nginx) with SSL certificate
2. **Frontend:** Deploy to platform with automatic HTTPS (Netlify, Vercel)

## Performance Optimization

### Frontend

- [x] Code splitting (automatic with Vite)
- [x] Asset minification (automatic in production build)
- [ ] CDN for static assets
- [ ] Caching strategy
- [ ] Lazy loading for components

### Backend

- [ ] Response caching
- [ ] Database connection pooling
- [ ] Async/await for I/O operations
- [ ] Rate limiting
- [ ] Load balancing for scale

## Maintenance

### Updates

```bash
# Update frontend dependencies
npm update

# Rebuild
npm run build

# Redeploy
```

### Monitoring Health

Set up health checks:
- Frontend: Check if served correctly
- Backend: Monitor `/health` endpoint
- Database: Check connections
- API: Monitor response times

## Support

For issues:
1. Check browser console for frontend errors
2. Check backend logs for API errors
3. Review [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
4. Verify environment configuration
5. Test with curl to isolate frontend/backend issues
