# Quick Start: Using This as Your Chatbot Template

This project is now set up as a reusable template for building chatbot UIs!

## 🚀 Quick Method (macOS)

### Option 1: Use the Creation Script

```bash
# Make the script executable (one time only)
chmod +x create-new-chatbot.sh

# Create a new project
./create-new-chatbot.sh my-awesome-chatbot

# Follow the instructions printed by the script
```

### Option 2: Manual Copy

```bash
# Copy this entire directory to a new location
cp -r . ../my-new-chatbot

# Navigate to new project
cd ../my-new-chatbot

# Clean up
rm -rf node_modules dist
rm -f package-lock.json

# Update project name in package.json
# Then install and start
npm install
npm run dev
```

## 📝 Essential Customizations

After creating your project, customize these:

### 1. **Project Name** (package.json)
```json
{
  "name": "your-project-name",
  "description": "Your chatbot description"
}
```

### 2. **App Branding** 
Files to update:
- `src/app/pages/IntroPage.tsx` - Welcome page title
- `src/app/pages/ChatPage.tsx` - Chat header title

```typescript
// Change from:
<h1>
  <span style={{ color: '#1e3a8a' }}>EC</span>
  <span style={{ color: '#3b82f6' }}>Easy</span>
</h1>

// To your brand:
<h1>
  <span style={{ color: '#yourcolor' }}>Your</span>
  <span style={{ color: '#yourcolor' }}>Bot</span>
</h1>
```

### 3. **Logo**
Replace `src/imports/logo_noname_(1).svg` with your logo

### 4. **Colors** (Optional)
Search and replace throughout project:
- `amber-50` → `yourcolor-50`
- `amber-100` → `yourcolor-100`
- `amber-200` → `yourcolor-200`
- etc.

### 5. **Backend URL** (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
```

## 🎯 What You Get

✅ Modern chatbot UI with streaming responses  
✅ LLM model selector (OpenAI, DeepSeek, Ollama)  
✅ File upload support (PDF, DOC)  
✅ Chat history with sidebar  
✅ Source citations display  
✅ Related questions  
✅ Responsive design  
✅ TypeScript + React + Tailwind  
✅ Production-ready  

## 📚 Full Documentation

See `docs/TEMPLATE_SETUP.md` for:
- Advanced setup options
- VSCode integration
- Automated project creation scripts
- Template maintenance
- Detailed customization guide

## 🔄 Workflow

```bash
# 1. Create new project from template
./create-new-chatbot.sh my-bot

# 2. Navigate and install
cd ../my-bot
npm install

# 3. Customize branding
code .

# 4. Configure environment
cp .env.example .env
# Edit .env with your settings

# 5. Start developing
npm run dev
```

## 💡 Pro Tips

1. **Keep template updated** - Regularly update dependencies in template
2. **Version your template** - Use git tags for template versions
3. **Save time** - Add common customizations to the template
4. **Share with team** - Push template to shared repository

## ⚡ Next Steps

1. Read `docs/TEMPLATE_SETUP.md` for advanced setup
2. Customize branding and colors
3. Connect to your backend API
4. Add your own features
5. Deploy to production

---

**Template ready!** Create as many chatbot projects as you need! 🚀
