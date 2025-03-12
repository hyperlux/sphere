#!/bin/bash

# Auronet Project Teardown Script
# This script properly shuts down all services for the Auronet project

echo "🛑 Shutting down Auronet development environment..."

# 1. Stop the Docker containers
echo "🔽 Stopping Docker containers..."
docker-compose down

# 2. Stop Supabase services
echo "🔵 Stopping Supabase services..."
npx supabase stop

echo "✅ Teardown complete! All services have been stopped."
