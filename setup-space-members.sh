#!/bin/bash

# Apply the space_members schema to the database
echo "Applying space_members schema to the database..."
supabase db push --db-url postgresql://postgres:postgres@localhost:54322/postgres < supabase/space-members-schema.sql

echo "Space members schema applied successfully!"
