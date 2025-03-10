#!/bin/bash

# Reset Supabase Database and Apply Updated Schema
# This script will reset your local Supabase database and apply the updated schema

echo "Stopping Supabase..."
npx supabase stop

echo "Starting Supabase..."
npx supabase start

echo "Waiting for Supabase to start..."
sleep 10

echo "Applying initial schema..."
PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -f supabase/seed.sql

echo "Schema update complete!"
echo "You can now restart your Next.js application with 'npm run dev'"
