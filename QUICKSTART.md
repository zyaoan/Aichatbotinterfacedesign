# ECEasy Frontend - Quick Start Guide

Get up and running with the ECEasy frontend in 5 minutes.

## What You're Building

A modern AI chatbot interface for ECE students with:
- Real-time streaming responses
- Source citations from knowledge base
- File upload support (PDF, DOC)
- Chat history management
- Beautiful amber-themed UI

## Prerequisites

- Node.js 18+
- Backend from: https://github.com/LCinHK/ECEasy (branch: `ECEasy_zyaoan_2`)

## 5-Minute Setup

### Step 1: Install Frontend (1 min)

```bash
# Clone or navigate to frontend directory
cd eceasy-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Step 2: Configure Backend URL (30 seconds)

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Step 3: Start Backend (2 min)

```bash
# In a separate terminal
cd path/to/ECEasy
git checkout ECEasy_zyaoan_2

# Navigate to backend location (adjust as needed)
cd newDesign/AiChatBotInterfaceDesign

# Install and run
pip install -r requirements.txt
python main.py
```

Backend should start on `http://localhost:8000`

### Step 4: Start Frontend (30 seconds)

```bash
# Back in frontend directory
npm run dev
```

### Step 5: Test (1 min)

1. Open http://localhost:5173
2. Click "Start Chatting"
3. Send a test message
4. Verify you get a streaming response

✅ **Done!** Your ECEasy interface is running.

## What's Next?

### Verify Everything Works

- [ ] Send a message - see streaming response
- [ ] Check sources display correctly
- [ ] Try uploading a PDF file
- [ ] Create a new chat session
- [ ] Switch between chats in sidebar

### Customize (Optional)

1. **Change Colors**: Edit brand colors in `ChatPage.tsx` and `IntroPage.tsx`
2. **Update Logo**: Replace `src/imports/logo_noname_(1).svg`
3. **Modify Theme**: Change `bg-amber-*` classes throughout

### Deploy to Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Static hosting (Netlify, Vercel)
- Docker deployment
- Environment configuration

## Project Structure

```
src/
├── app/
│   ├── pages/
│   │   ├── IntroPage.tsx    # Landing page
│   │   └── ChatPage.tsx     # Chat interface
│   └── components/
│       ├── ChatMessage.tsx  # Message bubbles
│       ├── MessageInput.tsx # Input with file upload
│       └── Sidebar.tsx      # Chat history
├── services/
│   └── api.service.ts       # Backend API calls
├── config/
│   └── api.config.ts        # API endpoints
└── imports/
    └── logo.svg             # ECEasy logo
```

## Key Features

### 1. Real-time Streaming
Messages stream character-by-character for natural feel.

### 2. Source Citations
Every AI response includes references from the knowledge base.

### 3. Related Questions
AI suggests follow-up questions automatically.

### 4. File Upload
Upload PDFs and DOC files for context-aware responses.

### 5. Session Management
Chat history persists across sessions.

## Troubleshooting

### Problem: Can't reach backend

**Solution:**
```bash
# Check backend is running
curl http://localhost:8000/health

# Check your .env file
cat .env
```

### Problem: CORS errors

**Solution:**
Backend needs CORS enabled. Add to your FastAPI app:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Problem: Streaming doesn't work

**Solution:**
Backend must return `text/event-stream` or `application/x-ndjson` content-type.

### Problem: File uploads fail

**Solution:**
Check backend accepts `multipart/form-data` and has appropriate file size limits.

## Configuration

### Backend Endpoints Required

Your backend must implement:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/chat` | POST | Send messages |
| `/sessions` | GET | List sessions |
| `/sessions` | POST | Create session |
| `/history/{id}` | GET | Get history |
| `/sessions/{id}` | DELETE | Delete session |

### Response Format Expected

```json
{
  "response": "AI generated text",
  "sources": [
    {
      "title": "Source name",
      "content": "Relevant snippet",
      "metadata": { "source": "file.pdf" }
    }
  ],
  "relatedQuestions": ["Question 1", "Question 2"],
  "session_id": "unique-id"
}
```

## Customization Quick Tips

### Change Brand Colors

In `ChatPage.tsx` and `IntroPage.tsx`:
```typescript
<span style={{ color: '#1e3a8a' }}>EC</span>     // Your color 1
<span style={{ color: '#3b82f6' }}>Easy</span>   // Your color 2
```

### Change Theme from Amber

Find and replace Tailwind classes:
- `bg-amber-50` → `bg-blue-50` (or your color)
- `bg-amber-100` → `bg-blue-100`
- `border-amber-200` → `border-blue-200`
- etc.

### Change Welcome Message

In `ChatPage.tsx`:
```typescript
const [messages, setMessages] = useState<Message[]>([
  {
    id: '1',
    role: 'assistant',
    content: "Your custom welcome message here!",
  },
]);
```

### Add Custom Features

1. **New components**: Add to `/src/app/components/`
2. **New pages**: Add to `/src/app/pages/` and update `/src/app/routes.ts`
3. **New API methods**: Add to `/src/services/api.service.ts`

## Development Workflow

### Making Changes

1. Edit files in `/src`
2. Vite hot-reloads automatically
3. Check browser console for errors
4. Test in Network tab for API issues

### Before Committing

```bash
# Build to check for errors
npm run build

# Test production build
npm run preview
```

## Resources

- **📖 Full Documentation**: [README.md](./README.md)
- **🔧 Integration Guide**: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- **🚀 Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **✅ Checklist**: [CHECKLIST.md](./CHECKLIST.md)
- **🔗 Backend Repo**: https://github.com/LCinHK/ECEasy

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Setup
npm install          # Install dependencies
bash setup.sh        # Run setup script (Linux/Mac)

# Testing
curl http://localhost:8000/health  # Check backend
curl http://localhost:5173         # Check frontend
```

## Architecture Overview

```
┌─────────────────┐
│  User Browser   │
│  (localhost:    │
│     5173)       │
└────────┬────────┘
         │
         │ HTTP/SSE
         │
┌────────▼────────┐      ┌──────────────┐
│  React Frontend │◄────►│   Backend    │
│                 │      │   FastAPI    │
│  • UI/UX       │      │  (port 8000) │
│  • Routing     │      └──────┬───────┘
│  • State Mgmt  │             │
└─────────────────┘             │
                         ┌──────▼───────┐
                         │   LLM APIs   │
                         │  (OpenAI,    │
                         │   DeepSeek,  │
                         │   Ollama)    │
                         └──────┬───────┘
                                │
                         ┌──────▼───────┐
                         │    FAISS     │
                         │  Knowledge   │
                         │     Base     │
                         └──────────────┘
```

## Getting Help

1. **Check browser console** for frontend errors
2. **Check backend logs** for API errors
3. **Use Network tab** to debug API calls
4. **Review INTEGRATION_GUIDE.md** for detailed setup
5. **Check CHECKLIST.md** to verify everything is configured

## Next Steps

1. ✅ Get it running locally (you're here!)
2. 📝 Verify all features work
3. 🎨 Customize to your needs
4. 🧪 Test thoroughly
5. 🚀 Deploy to production

---

**Questions?** Check the [FAQ section in INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) or review the comprehensive [README.md](./README.md).
