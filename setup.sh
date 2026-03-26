#!/bin/bash

# ECEasy Frontend Setup Script
# This script helps you set up the frontend to connect with the ECEasy backend

set -e

echo "================================"
echo "ECEasy Frontend Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    
    # Prompt for backend URL
    read -p "Enter your backend API URL (default: http://localhost:8000): " backend_url
    backend_url=${backend_url:-http://localhost:8000}
    
    # Create .env file
    echo "VITE_API_BASE_URL=$backend_url" > .env
    
    echo "✅ .env file created with:"
    echo "   VITE_API_BASE_URL=$backend_url"
else
    echo "ℹ️  .env file already exists"
    echo "   Current configuration:"
    cat .env
fi
echo ""

# Test backend connection
echo "🔍 Testing backend connection..."
backend_url=$(grep VITE_API_BASE_URL .env | cut -d '=' -f2)

if curl -s --head --request GET "$backend_url" | grep "200\|404" > /dev/null; then 
    echo "✅ Backend is reachable at $backend_url"
else
    echo "⚠️  Warning: Cannot reach backend at $backend_url"
    echo "   Make sure your backend server is running before starting the frontend."
fi
echo ""

# Prompt to start dev server
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Make sure your backend is running"
echo "2. Start the development server with: npm run dev"
echo "3. Open http://localhost:5173 in your browser"
echo ""

read -p "Do you want to start the development server now? (y/N): " start_dev
if [ "$start_dev" = "y" ] || [ "$start_dev" = "Y" ]; then
    echo ""
    echo "🚀 Starting development server..."
    npm run dev
else
    echo ""
    echo "To start the development server later, run:"
    echo "  npm run dev"
fi
