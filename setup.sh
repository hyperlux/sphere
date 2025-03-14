#!/bin/bash

# Auronet Project Setup Script
# This script sets up the development environment for the Auronet project

echo "🚀 Setting up Auronet development environment..."

# 1. Start Supabase services using CLI
echo "🔵 Starting Supabase services..."
npx supabase start

# Wait for Supabase to start
echo "⏳ Waiting for Supabase to initialize (10 seconds)..."
sleep 10

# 2. Apply database schema and seed data
echo "🗄️ Applying database schema and seed data..."
PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -f supabase/seed.sql

# 3. Build and start the Next.js application in Docker
echo "🏗️ Building the Next.js application Docker container..."
docker-compose up --build -d

echo "✅ Setup complete!"
echo ""
echo "📊 Services:"
echo "- Next.js app: http://localhost:3000"
echo "- Supabase API: http://localhost:54321"
echo "- Supabase Studio: http://localhost:54323"
echo ""
echo "📝 To stop all services, run:"
echo "- npx supabase stop"
echo "- docker-compose down"
