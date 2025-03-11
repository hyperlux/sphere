#!/bin/bash

# Reset the database and apply all schema changes
echo "Resetting database and applying schema changes..."

# Reset the database
./reset-supabase.sh

# Apply the space_members schema
echo "Applying space_members schema..."
psql postgresql://postgres:postgres@localhost:54322/postgres -f supabase/space-members-schema.sql

echo "Database reset and schema changes applied successfully!"
