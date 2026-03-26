#!/bin/bash

# Quick reference for common chatbot template commands
# Save this file and run: source chatbot-commands.sh

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print available commands
chatbot-help() {
    echo ""
    echo "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo "${BLUE}   Chatbot Template - Quick Command Reference${NC}"
    echo "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "${YELLOW}📦 Project Setup${NC}"
    echo "  ${GREEN}chatbot-new <name>${NC}        Create new chatbot project"
    echo "  ${GREEN}chatbot-install${NC}           Install dependencies"
    echo "  ${GREEN}chatbot-clean${NC}             Clean build artifacts"
    echo ""
    echo "${YELLOW}🚀 Development${NC}"
    echo "  ${GREEN}chatbot-dev${NC}               Start development server"
    echo "  ${GREEN}chatbot-build${NC}             Build for production"
    echo "  ${GREEN}chatbot-preview${NC}           Preview production build"
    echo ""
    echo "${YELLOW}⚙️  Configuration${NC}"
    echo "  ${GREEN}chatbot-env${NC}               Open .env file"
    echo "  ${GREEN}chatbot-config${NC}            Open api.config.ts"
    echo ""
    echo "${YELLOW}🎨 Customization${NC}"
    echo "  ${GREEN}chatbot-brand${NC}             Open branding files"
    echo "  ${GREEN}chatbot-colors <color>${NC}    Change color theme"
    echo ""
    echo "${YELLOW}📚 Documentation${NC}"
    echo "  ${GREEN}chatbot-docs${NC}              Open documentation"
    echo "  ${GREEN}chatbot-readme${NC}            Open README"
    echo ""
    echo "${YELLOW}🔍 Useful${NC}"
    echo "  ${GREEN}chatbot-ports${NC}             Show running ports"
    echo "  ${GREEN}chatbot-kill <port>${NC}       Kill process on port"
    echo ""
    echo "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Create new project
chatbot-new() {
    if [ -z "$1" ]; then
        echo "${YELLOW}Usage: chatbot-new <project-name>${NC}"
        return 1
    fi
    ./create-new-chatbot.sh "$1"
}

# Development commands
chatbot-dev() {
    npm run dev
}

chatbot-build() {
    npm run build
}

chatbot-preview() {
    npm run preview
}

# Installation & cleanup
chatbot-install() {
    npm install
}

chatbot-clean() {
    echo "${BLUE}🧹 Cleaning build artifacts...${NC}"
    rm -rf node_modules dist .turbo
    rm -f package-lock.json pnpm-lock.yaml
    echo "${GREEN}✅ Clean complete!${NC}"
}

# Configuration
chatbot-env() {
    code .env
}

chatbot-config() {
    code src/config/api.config.ts
}

# Customization
chatbot-brand() {
    code src/app/pages/IntroPage.tsx src/app/pages/ChatPage.tsx
}

chatbot-colors() {
    if [ -z "$1" ]; then
        echo "${YELLOW}Usage: chatbot-colors <color>${NC}"
        echo "Example: chatbot-colors blue"
        echo ""
        echo "Available colors: amber, blue, purple, green, pink, indigo, red, orange"
        return 1
    fi
    
    local color=$1
    echo "${BLUE}🎨 Changing color theme to: $color${NC}"
    echo ""
    echo "Run this in VSCode (Cmd+Shift+H):"
    echo "  Find:    ${YELLOW}amber-${NC}"
    echo "  Replace: ${GREEN}$color-${NC}"
    echo ""
    echo "Or use command:"
    echo "  ${GREEN}find src -type f -name '*.tsx' -exec sed -i '' 's/amber-/$color-/g' {} +${NC}"
}

# Documentation
chatbot-docs() {
    code docs/INDEX.md
}

chatbot-readme() {
    code README.md
}

# Utilities
chatbot-ports() {
    echo "${BLUE}📡 Active ports:${NC}"
    lsof -iTCP -sTCP:LISTEN -n -P | grep -E "(node|vite|npm)" || echo "No active development servers"
}

chatbot-kill() {
    if [ -z "$1" ]; then
        echo "${YELLOW}Usage: chatbot-kill <port>${NC}"
        echo "Example: chatbot-kill 5173"
        return 1
    fi
    
    echo "${BLUE}🔪 Killing process on port $1...${NC}"
    lsof -ti:$1 | xargs kill -9 2>/dev/null && echo "${GREEN}✅ Killed${NC}" || echo "${YELLOW}No process found${NC}"
}

# Auto-show help when sourced
chatbot-help

# Export all functions
export -f chatbot-help
export -f chatbot-new
export -f chatbot-dev
export -f chatbot-build
export -f chatbot-preview
export -f chatbot-install
export -f chatbot-clean
export -f chatbot-env
export -f chatbot-config
export -f chatbot-brand
export -f chatbot-colors
export -f chatbot-docs
export -f chatbot-readme
export -f chatbot-ports
export -f chatbot-kill

echo "${GREEN}✅ Chatbot template commands loaded!${NC}"
echo "   Run ${BLUE}chatbot-help${NC} anytime to see available commands"
echo ""
