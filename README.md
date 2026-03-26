# ECEasy Frontend

Modern AI chatbot interface for ECEasy - An intelligent assistant designed specifically for ECE students to handle inter-department queries with advanced RAG (Retrieval-Augmented Generation) capabilities.

![ECEasy](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4.0-blue)

## Features

### 🎨 Modern UI/UX
- **Warm Amber Theme**: Professional warm color palette with amber backgrounds
- **Responsive Design**: Fully responsive from mobile to desktop
- **Smooth Animations**: Motion-based animations for enhanced user experience
- **Collapsible Sidebar**: Expandable chat history navigation
- **Brand Identity**: Custom ECEasy branding with dual-tone blue logo

### 💬 Chat Interface
- **Real-time Streaming**: Live response streaming from AI models
- **File Upload**: Support for PDF and DOC/DOCX file uploads
- **Source Citations**: Display references from knowledge base
- **Related Questions**: AI-generated follow-up suggestions
- **Typing Indicators**: Visual feedback during message processing
- **Stop Generation**: Ability to interrupt long responses

### 🔌 Backend Integration
- **Multiple LLM Support**: Compatible with OpenAI, DeepSeek, and Ollama
- **FAISS Knowledge Base**: Vector search integration
- **Session Management**: Persistent chat history
- **API Service Layer**: Clean separation of concerns
- **Error Handling**: Graceful fallbacks when backend is unavailable

### 🚀 Technical Features
- **React Router**: Multi-page navigation (Intro → Chat)
- **TypeScript**: Full type safety
- **Tailwind CSS v4**: Modern utility-first styling
- **Vite**: Lightning-fast development and builds
- **Environment Config**: Easy deployment configuration

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ChatMessage.tsx      # Message bubble component
│   │   │   ├── MessageInput.tsx     # Input with file upload
│   │   │   └── Sidebar.tsx          # Chat history sidebar
│   │   ├── pages/
│   │   │   ├── IntroPage.tsx        # Landing page
│   │   │   └── ChatPage.tsx         # Main chat interface
│   │   ├── App.tsx                  # Root component
│   │   └── routes.ts                # React Router config
│   ├── config/
│   │   └── api.config.ts            # API endpoint configuration
│   ├── services/
│   │   └── api.service.ts           # Backend API integration
│   ├── imports/
│   │   └── logo_noname_(1).svg      # ECEasy logo
│   └── styles/
│       ├── theme.css                # Theme tokens
│       └── fonts.css                # Font imports
├── .env.example                      # Environment template
├── INTEGRATION_GUIDE.md              # Backend integration docs
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Backend API running (see [Backend Setup](#backend-setup))

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your backend URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   
   The app will be available at http://localhost:5173

### Backend Setup

This frontend is designed to work with the ECEasy FastAPI backend:

**Repository:** https://github.com/LCinHK/ECEasy/tree/ECEasy_zyaoan_2

1. Clone and set up the backend following its README
2. Ensure the backend is running on the configured port (default: 8000)
3. Make sure CORS is enabled for your frontend origin

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed backend integration instructions.

## Available Scripts

### Development
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Configuration

### API Endpoints

Configure in `/src/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  ENDPOINTS: {
    CHAT: '/chat',
    QUERY: '/query',
    UPLOAD: '/upload',
    HISTORY: '/history',
    SESSIONS: '/sessions',
  },
};
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000` |

## Usage

### Navigation

1. **Intro Page** (`/`): Landing page with project information and "Start Chatting" button
2. **Chat Page** (`/chat`): Main chat interface

### Chat Features

- **Send Message**: Type and press Enter (Shift+Enter for new line)
- **Upload Files**: Click paperclip icon to attach PDFs or DOC files
- **View Sources**: Click "View Sources" to see knowledge base references
- **Related Questions**: Click suggested questions to continue conversation
- **New Chat**: Click "New chat" in sidebar to start fresh conversation
- **Chat History**: Select previous conversations from sidebar

### File Upload

Supported formats:
- PDF (`.pdf`)
- Microsoft Word (`.doc`, `.docx`)

Multiple files can be uploaded simultaneously.

## Deployment

### Production Build

```bash
npm run build
```

This creates optimized static files in the `dist/` directory.

### Deploy to Static Hosting

#### Netlify
```bash
# Build command
npm run build

# Publish directory
dist
```

#### Vercel
```bash
vercel --prod
```

#### GitHub Pages
See the [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html#github-pages)

### Environment Configuration

For production:
1. Update `.env` with production backend URL
2. Rebuild the application
3. Ensure backend CORS allows production domain

## Customization

### Brand Colors

Edit colors in components to match your brand:

```typescript
// ECEasy brand colors
<span style={{ color: '#1e3a8a' }}>EC</span>  // Dark blue
<span style={{ color: '#3b82f6' }}>Easy</span> // Light blue
```

### Theme Colors

The amber theme is applied via Tailwind classes:
- Backgrounds: `bg-amber-50`, `bg-amber-100`
- Borders: `border-amber-200`
- Buttons: `bg-amber-600`, `hover:bg-amber-700`

Modify these classes throughout components to change the color scheme.

### Logo

Replace `/src/imports/logo_noname_(1).svg` with your logo and update imports:

```typescript
import logo from '../../imports/your-logo.svg';
```

## Architecture

### Component Hierarchy

```
App
├── IntroPage (/)
└── ChatPage (/chat)
    ├── Sidebar
    │   └── Chat history items
    ├── ChatMessage (multiple)
    │   ├── Sources display
    │   └── Related questions
    └── MessageInput
        └── File upload
```

### Data Flow

1. User sends message → `MessageInput`
2. `ChatPage` calls `apiService.sendMessage()`
3. Backend processes with RAG pipeline
4. Response streams back in chunks
5. `ChatMessage` renders with sources and suggestions

### API Service

The API service handles all backend communication:

```typescript
// Send message with streaming
await apiService.sendMessage(
  { message, sessionId, files },
  (chunk) => {
    // Handle streaming chunks
    updateUI(chunk);
  }
);
```

See [api.service.ts](/src/services/api.service.ts) for implementation details.

## Troubleshooting

### Backend Connection Errors

**Problem:** "Failed to fetch" or CORS errors

**Solutions:**
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check CORS configuration in backend
3. Confirm `VITE_API_BASE_URL` is correct
4. Check browser console for detailed errors

### Streaming Not Working

**Problem:** Responses don't stream, appear all at once

**Solutions:**
1. Verify backend returns `text/event-stream` or `application/x-ndjson`
2. Check response format matches expected structure
3. Review `handleStreamingResponse()` in api.service.ts

### File Upload Fails

**Problem:** Files don't upload or cause errors

**Solutions:**
1. Check file size (backend may have limits)
2. Verify file type is supported (.pdf, .doc, .docx)
3. Confirm backend accepts `multipart/form-data`
4. Check backend logs for processing errors

## Contributing

This is a frontend interface for the ECEasy project. For backend contributions, see the main repository.

### Development Guidelines

1. Follow existing component patterns
2. Maintain TypeScript type safety
3. Use Tailwind CSS for styling
4. Test with backend integration
5. Ensure responsive design works on all devices

## Tech Stack

- **React 18** - UI framework
- **TypeScript 5** - Type safety
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **React Router** - Navigation
- **Motion** - Animations
- **Lucide React** - Icons

## License

This project is part of ECEasy. See the main repository for license information.

## Links

- **Backend Repository**: https://github.com/LCinHK/ECEasy
- **Integration Guide**: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- **ECEasy Branch**: `ECEasy_zyaoan_2`

## Acknowledgments

Built for ECE students to provide intelligent assistance with course information, prerequisites, and department queries using advanced RAG technology.
