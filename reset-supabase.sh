#!/bin/bash

# Reset Supabase Database and Apply Updated Schema
# This script will reset your local Supabase database and apply the updated schema

echo "Stopping Supabase..."
npx supabase stop

echo "Starting Supabase with reset flag..."
npx supabase start --reset

echo "Waiting for Supabase to start..."
sleep 10

echo "Applying updated schema..."
PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -f supabase/updated-seed.sql

echo "Schema update complete!"
echo "You can now restart your Next.js application with 'npm run dev'"
