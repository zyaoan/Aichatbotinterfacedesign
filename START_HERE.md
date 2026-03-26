# 🚀 Quick Start - Use This as Your Chatbot Template

**You're looking at a production-ready chatbot UI template!** Here's how to use it for your own projects.

## ⚡ Super Quick Method (macOS)

```bash
# 1. Make script executable (one time only)
chmod +x create-new-chatbot.sh

# 2. Create your project
./create-new-chatbot.sh my-awesome-chatbot

# 3. Navigate and install
cd ../my-awesome-chatbot
npm install

# 4. Configure backend
code .env
# Set: VITE_API_BASE_URL=http://localhost:8000

# 5. Start coding!
npm run dev
```

**That's it!** Your chatbot UI is running at http://localhost:5173

## 📝 What You Need to Customize

### Essential (5 minutes)

1. **App Name** - Update in `ChatPage.tsx` and `IntroPage.tsx`
2. **Backend URL** - Set in `.env` file
3. **Package Name** - Change in `package.json`

### Optional (15 minutes)

4. **Logo** - Replace `src/imports/logo.svg`
5. **Colors** - Find/replace `amber` with your color
6. **Welcome Message** - Edit in `IntroPage.tsx`

## 🎁 What's Included

✅ **Modern Chat UI** - Streaming responses, message bubbles  
✅ **LLM Selection** - Switch between OpenAI, DeepSeek, Ollama  
✅ **File Uploads** - PDF and DOC support  
✅ **Chat History** - Sidebar with session management  
✅ **Source Citations** - Display knowledge base references  
✅ **Responsive Design** - Works on mobile, tablet, desktop  
✅ **TypeScript** - Full type safety  
✅ **Production Ready** - Error handling, loading states  

## 📚 Documentation

| Guide | Use When |
|-------|----------|
| **TEMPLATE_USAGE.md** | Quick template usage reference |
| **docs/MACOS_SETUP.md** | Detailed macOS setup guide |
| **docs/TEMPLATE_SETUP.md** | Advanced template configuration |
| **README.md** | Full project documentation |
| **INTEGRATION_GUIDE.md** | Connecting to backend |
| **docs/MODEL_SELECTION.md** | LLM selection feature |

## 🎯 Quick Customization

### Change App Name

**Files:** `src/app/pages/ChatPage.tsx` and `IntroPage.tsx`

Find:
```typescript
<span style={{ color: '#1e3a8a' }}>EC</span>
<span style={{ color: '#3b82f6' }}>Easy</span>
```

Replace with:
```typescript
<span style={{ color: '#yourcolor' }}>Your</span>
<span style={{ color: '#yourcolor' }}>Bot</span>
```

### Change Colors

Use VSCode Find & Replace (Cmd+Shift+H):

- `amber-50` → `blue-50` (or any Tailwind color)
- `amber-100` → `blue-100`
- `amber-200` → `blue-200`
- etc.

### Replace Logo

```bash
# Remove old logo
rm src/imports/logo_noname_\(1\).svg

# Add yours
cp ~/Downloads/your-logo.svg src/imports/logo.svg

# Update imports in components
```

## 🔌 Backend Connection

This template works with FastAPI backends. Required endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/chat` | POST | Send messages |
| `/sessions` | GET | List sessions |
| `/sessions` | POST | Create session |
| `/history/{id}` | GET | Get chat history |

Configure in `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

## 📖 Full Setup Guides

- **macOS Users**: See [docs/MACOS_SETUP.md](docs/MACOS_SETUP.md)
- **Template Details**: See [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md)
- **Advanced Setup**: See [docs/TEMPLATE_SETUP.md](docs/TEMPLATE_SETUP.md)

## 🎨 Features Overview

### Intro Page (`/`)
- Welcome message
- Project description
- "Start Chatting" button
- Modern animations

### Chat Page (`/chat`)
- Real-time streaming responses
- LLM model selector (top-right)
- File upload button
- Collapsible sidebar
- Source citations
- Related questions
- Stop generation button

## 💻 Development Commands

```bash
npm install      # Install dependencies
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🚀 Deployment

```bash
# Build
npm run build

# Deploy dist/ folder to:
# - Netlify
# - Vercel  
# - GitHub Pages
# - Any static hosting
```

## ✨ Next Steps

1. ✅ Create your project using the script
2. ✅ Install dependencies
3. ✅ Customize branding (name, logo, colors)
4. ✅ Configure backend URL
5. ✅ Start developing!

## 🆘 Need Help?

Check the documentation:

1. **Setup Issues** → [docs/MACOS_SETUP.md](docs/MACOS_SETUP.md)
2. **Backend Integration** → [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
3. **Customization** → [TEMPLATE_USAGE.md](TEMPLATE_USAGE.md)
4. **Features** → [README.md](README.md)

## 🎉 Ready to Build!

This template gives you everything you need to create a professional chatbot UI. Just customize the branding and connect to your backend!

**Questions?** All the answers are in the docs! 📚

---

**Built with React • TypeScript • Tailwind CSS** • Ready for Production 🚀
