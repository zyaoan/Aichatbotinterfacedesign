# Setting Up ECEasy UI as Your Default Chatbot Template

This guide will help you set up the ECEasy chatbot interface as your default template for future chatbot projects on macOS with VSCode.

## Quick Setup (5 Minutes)

### Step 1: Save This Project as Template

```bash
# Navigate to your projects directory
cd ~/Projects  # or wherever you keep projects

# Create a templates directory if it doesn't exist
mkdir -p ~/Templates

# Copy this entire project to your templates folder
# (Run this from the current project directory)
cp -r . ~/Templates/chatbot-ui-template

# Or create a git repository
cd ~/Templates
git clone <your-repo-url> chatbot-ui-template
```

### Step 2: Create an Alias for Quick Project Setup

Add to your `~/.zshrc` or `~/.bashrc`:

```bash
# Open your shell config
code ~/.zshrc  # or ~/.bashrc if using bash

# Add this function:
new-chatbot() {
    local project_name=$1
    if [ -z "$project_name" ]; then
        echo "Usage: new-chatbot <project-name>"
        return 1
    fi
    
    echo "Creating new chatbot project: $project_name"
    cp -r ~/Templates/chatbot-ui-template ~/Projects/$project_name
    cd ~/Projects/$project_name
    
    # Clean up
    rm -rf node_modules dist .turbo
    rm -f package-lock.json pnpm-lock.yaml
    
    # Update package.json name
    sed -i '' "s/\"name\": \".*\"/\"name\": \"$project_name\"/" package.json
    
    echo "✅ Project created at ~/Projects/$project_name"
    echo "📦 Installing dependencies..."
    npm install
    
    echo "✅ Opening in VSCode..."
    code .
    
    echo "🚀 Ready! Run 'npm run dev' to start"
}

# Save and reload
source ~/.zshrc  # or source ~/.bashrc
```

### Step 3: Use Your Template

```bash
# Create new chatbot project
new-chatbot my-awesome-chatbot

# Navigate into it
cd my-awesome-chatbot

# Start developing
npm run dev
```

## Manual Method (Alternative)

### Step 1: Download Project

```bash
# If you have this as a git repository
git clone <repo-url> ~/Projects/my-chatbot

# Or if you're copying files manually
cd ~/Downloads/eceasy-frontend  # wherever your files are
cp -r . ~/Projects/my-chatbot
```

### Step 2: Clean and Setup

```bash
cd ~/Projects/my-chatbot

# Remove build artifacts
rm -rf node_modules dist .turbo

# Remove lock files (you'll regenerate them)
rm -f package-lock.json pnpm-lock.yaml

# Update project name in package.json
code package.json
# Change "name": "eceasy-frontend" to your project name

# Install dependencies
npm install

# Open in VSCode
code .
```

### Step 3: Customize for Your Project

See "Customization Checklist" below.

## VSCode Workspace Setup

### Create a VSCode Workspace Template

1. Open the project in VSCode
2. File → Save Workspace As...
3. Save as `~/Templates/chatbot-ui-template.code-workspace`

**Workspace file content:**

```json
{
  "folders": [
    {
      "path": "."
    }
  ],
  "settings": {
    "typescript.tsdk": "node_modules/typescript/lib",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    },
    "files.exclude": {
      "node_modules": true,
      "dist": true
    },
    "search.exclude": {
      "node_modules": true,
      "dist": true,
      "package-lock.json": true
    }
  },
  "extensions": {
    "recommendations": [
      "dbaeumer.vscode-eslint",
      "esbenp.prettier-vscode",
      "bradlc.vscode-tailwindcss",
      "dsznajder.es7-react-js-snippets"
    ]
  }
}
```

### Recommended VSCode Extensions

Install these for best experience:

```bash
# Essential
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss

# React development
code --install-extension dsznajder.es7-react-js-snippets

# TypeScript
code --install-extension ms-vscode.vscode-typescript-next

# Icons
code --install-extension PKief.material-icon-theme
```

## Customization Checklist

### 1. Update Project Identity

```bash
# Update package.json
code package.json
```

Change:
- `"name"`: Your project name
- `"description"`: Your project description
- `"repository"`: Your repo URL
- `"author"`: Your name

### 2. Update Branding

**Replace App Name:**

```typescript
// src/app/pages/IntroPage.tsx
// src/app/pages/ChatPage.tsx

// Change this:
<h1 className="text-2xl font-bold">
  <span style={{ color: '#1e3a8a' }}>EC</span>
  <span style={{ color: '#3b82f6' }}>Easy</span>
</h1>

// To your brand:
<h1 className="text-2xl font-bold">
  <span style={{ color: '#yourcolor' }}>Your</span>
  <span style={{ color: '#yourcolor' }}>Bot</span>
</h1>
```

**Replace Logo:**

```bash
# Replace logo file
cp ~/Downloads/your-logo.svg src/imports/logo.svg

# Update imports in components
# Search for "logo_noname_(1).svg" and replace
```

**Update Colors:**

```typescript
// Search and replace in all files:
// bg-amber-50 → bg-your-color-50
// text-amber-600 → text-your-color-600
// border-amber-200 → border-your-color-200
```

### 3. Update Environment Config

```bash
# Copy env example
cp .env.example .env

# Edit for your backend
code .env
```

```env
VITE_API_BASE_URL=http://localhost:8000
# Add your own variables here
```

### 4. Update Documentation

```bash
# Update README.md with your project info
code README.md

# Remove ECEasy-specific docs (optional)
rm docs/MODEL_SELECTION.md  # if not needed
rm ARCHITECTURE.md          # if not needed
# Keep what's useful for you
```

### 5. Configure API Endpoints

```typescript
// src/config/api.config.ts
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  endpoints: {
    chat: '/chat',              // Customize these
    sessions: '/sessions',
    // Add your own endpoints
    yourEndpoint: '/your-path',
  },
};
```

## Create Project Template Script

### Advanced: Automated Template Generator

Save as `~/bin/create-chatbot`:

```bash
#!/bin/bash

# Create chatbot project from template
# Usage: create-chatbot <project-name>

set -e

PROJECT_NAME=$1
TEMPLATE_DIR="$HOME/Templates/chatbot-ui-template"
PROJECTS_DIR="$HOME/Projects"

if [ -z "$PROJECT_NAME" ]; then
    echo "Usage: create-chatbot <project-name>"
    exit 1
fi

PROJECT_DIR="$PROJECTS_DIR/$PROJECT_NAME"

if [ -d "$PROJECT_DIR" ]; then
    echo "❌ Project $PROJECT_NAME already exists!"
    exit 1
fi

echo "🚀 Creating new chatbot project: $PROJECT_NAME"
echo ""

# Copy template
echo "📁 Copying template files..."
cp -r "$TEMPLATE_DIR" "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Clean up
echo "🧹 Cleaning up..."
rm -rf node_modules dist .turbo
rm -f package-lock.json pnpm-lock.yaml

# Update package.json
echo "📝 Updating package.json..."
sed -i '' "s/\"name\": \".*\"/\"name\": \"$PROJECT_NAME\"/" package.json

# Create .env from example
echo "⚙️  Creating .env file..."
cp .env.example .env

# Initialize git if not already a repo
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit from chatbot template"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Project created successfully!"
echo ""
echo "📍 Location: $PROJECT_DIR"
echo ""
echo "Next steps:"
echo "  1. cd $PROJECT_DIR"
echo "  2. Update .env with your backend URL"
echo "  3. Customize branding (logo, colors, name)"
echo "  4. npm run dev"
echo ""
echo "Opening in VSCode..."
code "$PROJECT_DIR"

echo "🎉 Happy coding!"
```

Make it executable:

```bash
chmod +x ~/bin/create-chatbot

# Add ~/bin to PATH if not already (add to ~/.zshrc)
export PATH="$HOME/bin:$PATH"

# Reload shell
source ~/.zshrc
```

Usage:

```bash
create-chatbot my-new-bot
```

## VSCode Snippets for Quick Development

Create `.vscode/react-chatbot.code-snippets`:

```json
{
  "Chat Message Component": {
    "prefix": "chat-message",
    "body": [
      "interface ${1:MessageType} {",
      "  id: string;",
      "  role: 'user' | 'assistant';",
      "  content: string;",
      "}",
      "",
      "export function ${2:MessageComponent}({ message }: { message: ${1:MessageType} }) {",
      "  return (",
      "    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>",
      "      <div className=\"max-w-3xl px-4 py-3 rounded-lg\">",
      "        {message.content}",
      "      </div>",
      "    </div>",
      "  );",
      "}"
    ],
    "description": "Create a chat message component"
  },
  "API Service Method": {
    "prefix": "api-method",
    "body": [
      "async ${1:methodName}(${2:params}): Promise<${3:ReturnType}> {",
      "  const response = await fetch(`\\${this.baseURL}${4:/endpoint}`, {",
      "    method: '${5|GET,POST,PUT,DELETE|}',",
      "    headers: {",
      "      'Content-Type': 'application/json',",
      "    },",
      "    body: JSON.stringify(${2:params}),",
      "  });",
      "",
      "  if (!response.ok) {",
      "    throw new Error('Request failed');",
      "  }",
      "",
      "  return response.json();",
      "}"
    ],
    "description": "Create an API service method"
  }
}
```

## Project Structure Reference

Keep this structure as your template:

```
chatbot-ui-template/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── IntroPage.tsx        # Customize welcome message
│   │   │   └── ChatPage.tsx         # Main chat interface
│   │   ├── components/
│   │   │   ├── ChatMessage.tsx      # Reusable
│   │   │   ├── MessageInput.tsx     # Reusable
│   │   │   ├── Sidebar.tsx          # Reusable
│   │   │   └── ModelSelector.tsx    # Reusable
│   │   ├── routes.ts                # Update routes
│   │   └── App.tsx                  # Root component
│   ├── services/
│   │   └── api.service.ts           # Update API methods
│   ├── config/
│   │   └── api.config.ts            # Update endpoints
│   ├── imports/                     # Replace images/logos
│   └── styles/
│       ├── theme.css                # Update theme colors
│       └── fonts.css                # Update fonts
├── .env.example                     # Template for .env
├── package.json                     # Update name/details
└── README.md                        # Update docs
```

## Quick Customization Guide

### Minimal Changes (5 minutes)

1. **Update name** in `package.json`
2. **Change app title** in `IntroPage.tsx` and `ChatPage.tsx`
3. **Update .env** with your backend URL
4. **Replace logo** in `src/imports/`

### Full Customization (30 minutes)

1. **All minimal changes** above
2. **Change color scheme** (search/replace `amber` with your color)
3. **Update all documentation** files
4. **Customize API endpoints** in `api.config.ts`
5. **Update welcome message** in `IntroPage.tsx`
6. **Add your features** to components

## Git Template Method

### Create as Git Template

```bash
cd ~/Templates/chatbot-ui-template

# Initialize as template
git init
git add .
git commit -m "Initial chatbot UI template"

# Create new project from template
cd ~/Projects
git clone ~/Templates/chatbot-ui-template my-new-chatbot

# Or use as remote template
cd ~/Projects
mkdir my-new-chatbot
cd my-new-chatbot
git init
git remote add template ~/Templates/chatbot-ui-template
git pull template main
```

## Tips for Template Maintenance

### Keep Template Updated

```bash
# In your template directory
cd ~/Templates/chatbot-ui-template

# Pull latest dependencies
npm update

# Test that everything works
npm install
npm run dev

# Commit updates
git add .
git commit -m "Update dependencies"
```

### Version Your Template

```bash
# Tag versions of your template
git tag -a v1.0.0 -m "Initial template"
git tag -a v1.1.0 -m "Added model selector"

# Use specific version
git clone ~/Templates/chatbot-ui-template -b v1.0.0 my-project
```

## Common Workflows

### Workflow 1: Quick New Project

```bash
new-chatbot my-bot
cd my-bot
npm run dev
```

### Workflow 2: Copy and Customize

```bash
cp -r ~/Templates/chatbot-ui-template ~/Projects/my-bot
cd ~/Projects/my-bot
code .
# Customize in VSCode
npm install
npm run dev
```

### Workflow 3: Clone from Git

```bash
git clone <your-template-repo> ~/Projects/my-bot
cd ~/Projects/my-bot
npm install
npm run dev
```

## Checklist: Ready to Use as Template

- [ ] All dependencies install without errors
- [ ] `npm run dev` starts successfully
- [ ] `npm run build` completes without errors
- [ ] All ECEasy-specific content removed/customizable
- [ ] `.env.example` has all needed variables
- [ ] Documentation updated for template use
- [ ] Logo/images are replaceable
- [ ] Color scheme is easy to change
- [ ] API service is modular
- [ ] Components are reusable

## Troubleshooting

### "Command not found: new-chatbot"

```bash
# Make sure you reloaded shell
source ~/.zshrc

# Or restart terminal
```

### "Permission denied" when running script

```bash
chmod +x ~/bin/create-chatbot
```

### VSCode doesn't open automatically

```bash
# Install VSCode command line tools
# In VSCode: Cmd+Shift+P → "Shell Command: Install 'code' command in PATH"
```

## Next Steps

1. ✅ Save this project as template
2. ✅ Set up quick creation script
3. ✅ Customize for your first project
4. ✅ Create additional projects from template
5. ✅ Share template with team (optional)

---

**You now have a reusable chatbot UI template!** 🎉

Create new projects in seconds and focus on customization instead of setup.
