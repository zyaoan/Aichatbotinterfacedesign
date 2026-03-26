#!/bin/bash

# Chatbot UI Template Creator
# Creates a new chatbot project from the ECEasy template
# Usage: ./create-new-chatbot.sh <project-name>

set -e

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
    echo "❌ Error: Project name is required"
    echo ""
    echo "Usage: ./create-new-chatbot.sh <project-name>"
    echo ""
    echo "Example:"
    echo "  ./create-new-chatbot.sh my-awesome-chatbot"
    exit 1
fi

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "${BLUE}🚀 Creating new chatbot project: ${PROJECT_NAME}${NC}"
echo ""

# Get current directory (template location)
TEMPLATE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$TEMPLATE_DIR")"
PROJECT_DIR="$PARENT_DIR/$PROJECT_NAME"

# Check if project already exists
if [ -d "$PROJECT_DIR" ]; then
    echo "${YELLOW}❌ Project '$PROJECT_NAME' already exists at:${NC}"
    echo "   $PROJECT_DIR"
    echo ""
    echo "Please choose a different name or remove the existing directory."
    exit 1
fi

# Copy template
echo "${BLUE}📁 Copying template files...${NC}"
cp -r "$TEMPLATE_DIR" "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Clean up build artifacts
echo "${BLUE}🧹 Cleaning up build artifacts...${NC}"
rm -rf node_modules dist .turbo 2>/dev/null || true
rm -f package-lock.json pnpm-lock.yaml 2>/dev/null || true

# Remove the creation script from new project
rm -f create-new-chatbot.sh

# Update package.json
echo "${BLUE}📝 Updating package.json...${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/\"name\": \".*\"/\"name\": \"$PROJECT_NAME\"/" package.json
else
    # Linux
    sed -i "s/\"name\": \".*\"/\"name\": \"$PROJECT_NAME\"/" package.json
fi

# Create .env from example
echo "${BLUE}⚙️  Creating .env file...${NC}"
if [ -f ".env.example" ]; then
    cp .env.example .env
    echo "${GREEN}✅ .env file created${NC}"
else
    echo "${YELLOW}⚠️  No .env.example found${NC}"
fi

# Initialize git repository
echo "${BLUE}🔧 Initializing git repository...${NC}"
rm -rf .git 2>/dev/null || true
git init
git add .
git commit -m "Initial commit: $PROJECT_NAME from chatbot template" --quiet

echo ""
echo "${GREEN}✅ Project created successfully!${NC}"
echo ""
echo "${BLUE}📍 Location:${NC} $PROJECT_DIR"
echo ""
echo "${YELLOW}📋 Next steps:${NC}"
echo ""
echo "  1. Navigate to project:"
echo "     ${BLUE}cd $PROJECT_DIR${NC}"
echo ""
echo "  2. Install dependencies:"
echo "     ${BLUE}npm install${NC}"
echo ""
echo "  3. Update configuration:"
echo "     ${BLUE}code .env${NC}"
echo "     - Set VITE_API_BASE_URL to your backend URL"
echo ""
echo "  4. Customize branding:"
echo "     - Update app name in src/app/pages/IntroPage.tsx"
echo "     - Update app name in src/app/pages/ChatPage.tsx"
echo "     - Replace logo in src/imports/"
echo "     - Update colors (search for 'amber' in files)"
echo ""
echo "  5. Start development server:"
echo "     ${BLUE}npm run dev${NC}"
echo ""
echo "  6. Build for production:"
echo "     ${BLUE}npm run build${NC}"
echo ""
echo "${YELLOW}📚 Documentation:${NC}"
echo "  - README.md              - Full project overview"
echo "  - QUICKSTART.md          - 5-minute setup guide"
echo "  - docs/TEMPLATE_SETUP.md - Template customization guide"
echo "  - docs/MODEL_SELECTION.md - LLM selection feature"
echo ""
echo "${GREEN}🎉 Happy coding!${NC}"
echo ""
