# 🎯 ECEasy Chatbot UI - Complete Setup for macOS & VSCode

## What You Have

A **production-ready chatbot UI template** that you can use for any chatbot project. This was built for ECEasy but is fully customizable for your needs.

## Quick Commands (Copy & Paste)

### Create Your First Chatbot (30 seconds)

```bash
# 1. Make creation script executable
chmod +x create-new-chatbot.sh

# 2. Create your project
./create-new-chatbot.sh my-awesome-bot

# 3. Navigate to it
cd ../my-awesome-bot

# 4. Install dependencies
npm install

# 5. Start it up!
npm run dev
```

**Done!** Open http://localhost:5173

### Set Up Reusable Template (5 minutes)

```bash
# 1. Save current project as template
mkdir -p ~/Templates
cp -r . ~/Templates/chatbot-ui-template

# 2. Add quick command to your shell
echo '
# Chatbot template command
new-chatbot() {
    cp -r ~/Templates/chatbot-ui-template ~/Projects/$1
    cd ~/Projects/$1
    rm -rf node_modules dist
    sed -i "" "s/\"name\": \".*\"/\"name\": \"$1\"/" package.json
    npm install
    code .
    echo "✅ Ready! Run: npm run dev"
}
' >> ~/.zshrc

# 3. Reload shell
source ~/.zshrc

# 4. Create projects instantly!
new-chatbot my-bot
new-chatbot another-bot
```

## What's Included

### ✨ Features

- ✅ **Streaming Chat** - Real-time AI responses
- ✅ **LLM Selector** - Switch between OpenAI, DeepSeek, Ollama
- ✅ **File Upload** - PDF and DOC support
- ✅ **Chat History** - Sidebar with sessions
- ✅ **Source Citations** - Show knowledge base references
- ✅ **Related Questions** - AI-generated suggestions
- ✅ **Responsive** - Mobile, tablet, desktop
- ✅ **Modern UI** - Smooth animations, beautiful design

### 📁 File Structure

```
your-project/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── IntroPage.tsx      # Landing page - CUSTOMIZE THIS
│   │   │   └── ChatPage.tsx       # Main chat - CUSTOMIZE THIS
│   │   └── components/
│   │       ├── ChatMessage.tsx    # Message bubbles
│   │       ├── MessageInput.tsx   # Input with upload
│   │       ├── Sidebar.tsx        # Chat history
│   │       └── ModelSelector.tsx  # LLM switcher
│   ├── services/
│   │   └── api.service.ts         # Backend API
│   ├── config/
│   │   └── api.config.ts          # Endpoints - CUSTOMIZE THIS
│   └── imports/
│       └── logo.svg               # Your logo - REPLACE THIS
├── .env                            # Config - CUSTOMIZE THIS
└── package.json                    # Project info - CUSTOMIZE THIS
```

## Customization Checklist

### 1. Project Name (1 minute)

**File:** `package.json`

```json
{
  "name": "your-bot-name",
  "description": "Your bot description"
}
```

### 2. App Branding (3 minutes)

**File:** `src/app/pages/ChatPage.tsx` (around line 280)

```typescript
// Find this:
<h1 className="text-2xl font-bold">
  <span style={{ color: '#1e3a8a' }}>EC</span>
  <span style={{ color: '#3b82f6' }}>Easy</span>
</h1>

// Change to:
<h1 className="text-2xl font-bold">
  <span style={{ color: '#your-color' }}>Your</span>
  <span style={{ color: '#your-color' }}>Bot</span>
</h1>
```

**File:** `src/app/pages/IntroPage.tsx` (around line 40)

```typescript
// Same change here
<h1 className="text-4xl md:text-6xl font-bold mb-6">
  <span style={{ color: '#your-color' }}>Your</span>
  <span style={{ color: '#your-color' }}>Bot</span>
</h1>
```

### 3. Logo (1 minute)

```bash
# Replace logo file
rm src/imports/logo_noname_\(1\).svg
cp ~/Downloads/your-logo.svg src/imports/logo.svg

# Update imports in ChatPage.tsx and IntroPage.tsx
import logo from '../../imports/logo.svg';
```

### 4. Colors (Optional - 5 minutes)

In VSCode, press `Cmd+Shift+H` (Find & Replace in Files):

```
Find:    amber-
Replace: blue-
```

Or use command line:

```bash
find src -type f -name '*.tsx' -exec sed -i '' 's/amber-/blue-/g' {} +
```

Available colors: `blue`, `purple`, `green`, `pink`, `red`, `indigo`, `orange`

### 5. Backend URL (1 minute)

**File:** `.env`

```env
VITE_API_BASE_URL=http://localhost:8000
```

Change to your backend URL.

### 6. Welcome Message (2 minutes)

**File:** `src/app/pages/IntroPage.tsx` (around line 55)

```typescript
<p className="text-lg text-gray-600 max-w-2xl">
  Your custom welcome message here.
  Describe what your chatbot does.
</p>
```

## VSCode Setup

### Install Recommended Extensions

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dsznajder.es7-react-js-snippets
```

Or in VSCode: `Cmd+Shift+X` and search for:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- ES7+ React/Redux snippets

### Useful Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+P` | Quick file open |
| `Cmd+Shift+F` | Search in all files |
| `Cmd+Shift+H` | Find & Replace all |
| `Cmd+B` | Toggle sidebar |
| `Ctrl+\`` | Toggle terminal |
| `Cmd+D` | Select next occurrence |
| `Cmd+Shift+L` | Select all occurrences |

## Development Workflow

### Daily Development

```bash
# Start development server
npm run dev

# Open browser
open http://localhost:5173

# Make changes → save → see updates instantly
```

### Before Committing

```bash
# Check for errors
npm run build

# Preview production build
npm run preview
```

### Deploying

```bash
# Build for production
npm run build

# Deploy dist/ folder to:
# - Netlify (drag & drop dist/)
# - Vercel (connect git repo)
# - GitHub Pages (follow Vite guide)
```

## Backend Integration

### What Your Backend Needs

**Endpoints:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/chat` | POST | Send messages, get responses |
| `/sessions` | GET | List chat sessions |
| `/sessions` | POST | Create new session |
| `/history/{id}` | GET | Get chat history |
| `/sessions/{id}` | DELETE | Delete session |

**CORS:**

```python
# In your FastAPI backend
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Testing Backend Connection

```bash
# Check backend is running
curl http://localhost:8000/health

# Test chat endpoint
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

## Helpful Commands

### Port Management

```bash
# Check what's running on port 5173
lsof -i :5173

# Kill process on port
lsof -ti:5173 | xargs kill -9

# Run on different port
npm run dev -- --port 5174
```

### Cleanup

```bash
# Clean everything
rm -rf node_modules dist .turbo
rm -f package-lock.json

# Fresh install
npm install
```

### Find & Replace Branding

```bash
# Find all ECEasy references
grep -r "ECEasy" src/

# Find all amber color references
grep -r "amber-" src/

# Replace in all files (backup first!)
find src -type f -name '*.tsx' -exec sed -i '' 's/ECEasy/YourBot/g' {} +
```

## Troubleshooting

### "Cannot find module" errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port already in use

```bash
lsof -ti:5173 | xargs kill -9
npm run dev
```

### Changes not showing

```bash
# Hard refresh in browser
Cmd+Shift+R

# Restart dev server
# Ctrl+C to stop, then:
npm run dev
```

### CORS errors

Check:
1. Backend CORS configuration
2. Backend is running
3. `.env` has correct URL
4. Restart frontend after `.env` changes

### Build errors

```bash
# Clear cache
rm -rf node_modules/.vite

# Rebuild
npm run build
```

## Quick Reference Card

### Create Project
```bash
./create-new-chatbot.sh my-bot
cd ../my-bot
npm install
npm run dev
```

### Customize
1. Update `package.json` name
2. Change branding in `IntroPage.tsx` & `ChatPage.tsx`
3. Replace `src/imports/logo.svg`
4. Set backend URL in `.env`
5. Change colors: Find `amber-` → Replace `yourcolor-`

### Deploy
```bash
npm run build
# Upload dist/ to hosting
```

## Documentation

| File | Purpose |
|------|---------|
| [START_HERE.md](START_HERE.md) | Quickest start |
| [MACOS_SETUP.md](docs/MACOS_SETUP.md) | This guide (detailed) |
| [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md) | Template instructions |
| [README.md](README.md) | Full documentation |
| [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) | Backend connection |
| [docs/INDEX.md](docs/INDEX.md) | All docs index |

## One-Time Setup (Optional Power User)

Save this to `~/.zshrc` for convenience:

```bash
# Chatbot template helpers
export CHATBOT_TEMPLATE="$HOME/Templates/chatbot-ui-template"

alias chatbot-new='function _new(){ cp -r $CHATBOT_TEMPLATE $1 && cd $1 && npm install; };_new'
alias chatbot-dev='npm run dev'
alias chatbot-build='npm run build'
alias chatbot-clean='rm -rf node_modules dist package-lock.json'
alias chatbot-ports='lsof -iTCP -sTCP:LISTEN -n -P | grep -E "(node|vite)"'
```

Then:

```bash
source ~/.zshrc

# Use anywhere:
chatbot-new my-project
chatbot-dev
chatbot-ports
```

## Summary

You now have:

✅ **A reusable chatbot template**  
✅ **Quick commands to create projects**  
✅ **Full customization guide**  
✅ **VSCode setup**  
✅ **Development workflow**  
✅ **Troubleshooting guide**  

## Next Steps

1. **Create your first project** using the quick command
2. **Customize branding** (5 minutes)
3. **Connect to backend** (see INTEGRATION_GUIDE.md)
4. **Start building features**

---

**Questions?** Check the docs in order:
1. This file (you're reading it!)
2. [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md)
3. [README.md](README.md)
4. [docs/INDEX.md](docs/INDEX.md)

**Happy coding!** 🚀
