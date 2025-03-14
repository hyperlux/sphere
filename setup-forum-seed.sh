#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Error: .env file not found."
    exit 1
fi

# Check if SUPABASE_URL and SUPABASE_KEY are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "Error: SUPABASE_URL or SUPABASE_SERVICE_KEY not found in .env file."
    exit 1
fi

echo "Setting up realistic forum posts and users..."

# Apply the forum seed SQL
PGPASSWORD=${POSTGRES_PASSWORD} psql -h localhost -U postgres -d postgres -f supabase/forum-seed.sql

echo "Realistic forum content has been added to the database."
echo "You can now see enhanced posts in the forum UI."

exit 0
