#!/bin/bash

# YemCart Complete Setup Script
# This script initializes the entire YemCart project

set -e  # Exit on error

echo "================================"
echo "🚀 YemCart Complete Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

echo "✅ npm $(npm -v) detected"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found!"
    echo "📋 Copying from .env.local.example..."
    cp .env.local.example .env.local
    echo "✅ Created .env.local (Please edit it with your Supabase credentials)"
    echo ""
    echo "📝 Edit .env.local with your values:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo ""
    exit 1
fi

echo "✅ .env.local found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Verify database
echo "🔍 Verifying database..."
node deploy-db-verify.js

echo ""
echo "================================"
echo "✨ Setup completed successfully!"
echo "================================"
echo ""
echo "🎉 Next steps:"
echo "   1. Run: npm run dev"
echo "   2. Open: http://localhost:3000"
echo ""
echo "📖 For more information, see:"
echo "   - README.md"
echo "   - DATABASE_SETUP.md"
echo ""
