# macOS Setup Guide - Using ECEasy UI as Your Template

This guide shows you exactly how to use this chatbot UI as a template for your projects on macOS with VSCode.

## 🎯 What You'll Learn

- Save this project as a reusable template
- Create new chatbot projects in seconds
- Customize branding and colors quickly
- Set up for your backend API

## 📋 Prerequisites

- macOS (any version)
- VSCode installed
- Node.js 18+ installed
- Terminal access

## Method 1: Quick & Easy (5 Minutes) ⚡

### Step 1: Save Current Project as Template

Open Terminal and run:

```bash
# Navigate to this project directory
cd /path/to/current/project

# Make the creation script executable
chmod +x create-new-chatbot.sh

# Done! You can now create new projects
```

### Step 2: Create a New Project

```bash
# In the template directory, run:
./create-new-chatbot.sh my-chatbot-name

# Example:
./create-new-chatbot.sh healthcare-bot
```

The script will:
- ✅ Copy all files to `../my-chatbot-name/`
- ✅ Clean up build artifacts
- ✅ Update package.json with new name
- ✅ Create .env file
- ✅ Initialize git repository
- ✅ Show you next steps

### Step 3: Complete Setup

```bash
# Navigate to new project
cd ../my-chatbot-name

# Install dependencies
npm install

# Configure backend URL
code .env
# Edit VITE_API_BASE_URL=http://localhost:8000

# Start development
npm run dev
```

**Done!** 🎉 Your new chatbot is running at http://localhost:5173

## Method 2: Manual Setup (10 Minutes) 📝

### Step 1: Copy Template

```bash
# Open Terminal
# Navigate to where you want the new project

# Copy current project
cp -r /path/to/eceasy-frontend ~/Projects/my-new-bot

# Navigate to new project
cd ~/Projects/my-new-bot
```

### Step 2: Clean Up

```bash
# Remove build artifacts
rm -rf node_modules dist .turbo

# Remove lock files
rm -f package-lock.json pnpm-lock.yaml

# Remove git history (start fresh)
rm -rf .git
```

### Step 3: Update Project Info

Open VSCode:

```bash
code .
```

Edit `package.json`:

```json
{
  "name": "my-new-bot",  // ← Change this
  "description": "My awesome chatbot",  // ← Change this
  "version": "1.0.0"
}
```

### Step 4: Install and Run

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env
code .env
```

Add your backend URL:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Start development:

```bash
npm run dev
```

## Method 3: Reusable Template Setup (Advanced) 🚀

Set up once, use forever!

### Step 1: Create Templates Directory

```bash
# Create a templates folder
mkdir -p ~/Templates/chatbot-templates

# Copy this project there
cp -r . ~/Templates/chatbot-templates/eceasy-ui

# Clean the template
cd ~/Templates/chatbot-templates/eceasy-ui
rm -rf node_modules dist .turbo
rm -f package-lock.json pnpm-lock.yaml
```

### Step 2: Create Alias Command

Edit your shell config:

```bash
# Open zsh config
code ~/.zshrc

# Add this function:
new-chatbot() {
    local project_name=$1
    if [ -z "$project_name" ]; then
        echo "Usage: new-chatbot <project-name>"
        return 1
    fi
    
    echo "🚀 Creating: $project_name"
    
    # Copy template
    cp -r ~/Templates/chatbot-templates/eceasy-ui ~/Projects/$project_name
    cd ~/Projects/$project_name
    
    # Clean and update
    rm -rf node_modules dist .turbo .git
    rm -f package-lock.json pnpm-lock.yaml
    
    # Update package.json name
    sed -i '' "s/\"name\": \".*\"/\"name\": \"$project_name\"/" package.json
    
    # Create .env
    cp .env.example .env
    
    # Initialize git
    git init
    git add .
    git commit -m "Initial commit"
    
    # Install
    npm install
    
    # Open in VSCode
    code .
    
    echo "✅ Done! Run 'npm run dev' to start"
}

# Save and exit (Cmd+S, then close)

# Reload shell config
source ~/.zshrc
```

### Step 3: Use Your New Command

```bash
# Create new projects instantly!
new-chatbot my-bot
new-chatbot customer-support-ai
new-chatbot medical-assistant

# Each command creates a ready-to-go project!
```

## 🎨 Quick Customization Guide

After creating a project, customize these files:

### 1. App Name & Branding

**File:** `src/app/pages/ChatPage.tsx`

Find and change:

```typescript
// Line ~280
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

**File:** `src/app/pages/IntroPage.tsx`

Find and change:

```typescript
// Around line ~40
<h1 className="text-4xl md:text-6xl font-bold mb-6">
  <span style={{ color: '#1e3a8a' }}>EC</span>
  <span style={{ color: '#3b82f6' }}>Easy</span>
</h1>

// Change to your branding
```

### 2. Logo

Replace logo file:

```bash
# In VSCode terminal
# Remove old logo
rm src/imports/logo_noname_\(1\).svg

# Add your logo (drag file into imports folder)
# Or use command line:
cp ~/Downloads/your-logo.svg src/imports/logo.svg
```

Update imports in components:

```typescript
// In ChatPage.tsx and IntroPage.tsx
import logo from '../../imports/logo.svg';
```

### 3. Colors

Use VSCode's Find & Replace (Cmd+Shift+H):

| Find | Replace With | Description |
|------|--------------|-------------|
| `amber-50` | `blue-50` | Light backgrounds |
| `amber-100` | `blue-100` | Medium backgrounds |
| `amber-200` | `blue-200` | Borders |
| `amber-600` | `blue-600` | Buttons |
| `amber-700` | `blue-700` | Button hover |

Choose any Tailwind color: `blue`, `purple`, `green`, `pink`, `indigo`, etc.

### 4. Welcome Message

**File:** `src/app/pages/IntroPage.tsx`

```typescript
// Around line ~55-60
<p className="text-lg text-gray-600 max-w-2xl">
  Your custom welcome message here.
  Describe what your chatbot does.
</p>
```

### 5. Backend API

**File:** `.env`

```env
VITE_API_BASE_URL=http://localhost:8000  # Your backend URL
```

### 6. API Endpoints

**File:** `src/config/api.config.ts`

```typescript
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  endpoints: {
    chat: '/chat',           // ← Customize these
    sessions: '/sessions',
    upload: '/upload',
    // Add your endpoints
  },
};
```

## 🔧 VSCode Tips

### Useful Extensions

Install these for better experience:

```bash
# In VSCode, press Cmd+Shift+X and search for:
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- ESLint
- Prettier
```

### Quick Commands

| Shortcut | Action |
|----------|--------|
| `Cmd+P` | Quick file open |
| `Cmd+Shift+F` | Search in all files |
| `Cmd+Shift+H` | Find & Replace in all files |
| `Cmd+B` | Toggle sidebar |
| `Ctrl+`` | Open terminal |

### Project Search

To find all branding references:

1. Press `Cmd+Shift+F`
2. Search for: `ECEasy` or `EC</span>`
3. Replace all instances

## 📦 Project Organization

Keep your projects organized:

```
~/Projects/
├── chatbot-template/        # This original template
├── healthcare-bot/          # Your first project
├── customer-support-ai/     # Another project
└── education-assistant/     # Another project

~/Templates/
└── chatbot-templates/
    └── eceasy-ui/          # Clean template copy
```

## ⚡ Quick Reference

### Create New Project

```bash
# Method 1: Use script
cd ~/path/to/template
./create-new-chatbot.sh my-bot

# Method 2: Use alias (if set up)
new-chatbot my-bot

# Method 3: Manual
cp -r ~/path/to/template ~/Projects/my-bot
cd ~/Projects/my-bot
npm install
npm run dev
```

### Essential Files to Customize

| File | What to Change |
|------|----------------|
| `package.json` | Project name, description |
| `.env` | Backend API URL |
| `src/app/pages/IntroPage.tsx` | Welcome message, title |
| `src/app/pages/ChatPage.tsx` | Chat header title |
| `src/imports/logo.svg` | Your logo |
| `src/config/api.config.ts` | API endpoints |

### Development Workflow

```bash
# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🐛 Troubleshooting

### "Command not found: new-chatbot"

```bash
# Reload your shell
source ~/.zshrc

# Or restart Terminal
```

### "Permission denied" on script

```bash
chmod +x create-new-chatbot.sh
```

### VSCode doesn't open with `code` command

```bash
# In VSCode:
# 1. Press Cmd+Shift+P
# 2. Type: "shell command"
# 3. Select: "Install 'code' command in PATH"
# 4. Restart Terminal
```

### npm install fails

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json

# Try again
npm install
```

### Port 5173 already in use

```bash
# Kill process on port
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 5174
```

## 🎯 Next Steps

After setup, check these guides:

1. **TEMPLATE_USAGE.md** - Quick template usage
2. **README.md** - Full project documentation
3. **INTEGRATION_GUIDE.md** - Connect to backend
4. **docs/MODEL_SELECTION.md** - LLM selector feature

## 💡 Best Practices

### Template Maintenance

```bash
# Periodically update your template
cd ~/Templates/chatbot-templates/eceasy-ui

# Update dependencies
npm install
npm update

# Test that it works
npm run dev

# Commit updates
git add .
git commit -m "Update dependencies"
```

### Version Control

```bash
# Each new project gets its own git repo
cd ~/Projects/my-new-bot
git init
git add .
git commit -m "Initial commit"

# Add remote
git remote add origin <your-repo-url>
git push -u origin main
```

### Backup Your Template

```bash
# Backup to cloud
cp -r ~/Templates/chatbot-templates ~/Dropbox/

# Or use git
cd ~/Templates/chatbot-templates/eceasy-ui
git init
git remote add origin <your-template-repo>
git push -u origin main
```

## ✅ Checklist

Before starting new project:

- [ ] Template saved in safe location
- [ ] Creation script is executable
- [ ] VSCode is installed
- [ ] Node.js is installed
- [ ] Backend API is ready (or URL known)

After creating new project:

- [ ] Project name updated in package.json
- [ ] App branding customized
- [ ] Logo replaced
- [ ] Colors updated (optional)
- [ ] .env configured with backend URL
- [ ] npm install completed
- [ ] npm run dev works
- [ ] Backend connection tested

## 🎉 Success!

You now have a reusable chatbot template! Create as many projects as you need in seconds.

**Questions?** Check the docs:
- `TEMPLATE_USAGE.md` - Quick reference
- `docs/TEMPLATE_SETUP.md` - Detailed setup
- `README.md` - Full documentation

---

**Happy coding!** 🚀
