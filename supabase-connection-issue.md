# Supabase Connection Issue

## Problem

The application is encountering an error when trying to load resources from Supabase:

```
Error: Supabase error: {}
    at createUnhandledError (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/errors/console-error.js:27:71)
    at handleClientError (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/errors/use-error-handler.js:45:56)
    at console.error (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/globals/intercept-console-error.js:47:56)
    at loadResources (webpack-internal:///(app-pages-browser)/./app/resources/page.tsx:64:25)
```

## Root Cause

The issue is a mismatch between the database schema and what the application code is expecting. Specifically:

1. The application code in `app/resources/page.tsx` is trying to query fields and relationships that don't exist in the current database schema:
   - It's looking for `category:resource_categories(id, name)` but there's no `resource_categories` table
   - It's looking for `author:users!author_id(name)` but there's no `author_id` column in the resources table

2. Similarly, the `UploadResourceForm.tsx` component is trying to insert records with fields like `file_type`, `size_in_bytes`, and `category_id` that don't exist in the current resources table.

## Solution

An updated database schema has been created in `supabase/updated-seed.sql` that includes:

1. A new `resource_categories` table
2. Updated `resources` table with additional fields:
   - `file_type`
   - `size_in_bytes`
   - `category_id` (foreign key to resource_categories)
   - `author_id` (foreign key to users)

The `database.types.ts` file has also been updated to match this schema.

## How to Fix

### Option 1: Using the Reset Script

A convenience script has been created to automate the database reset and schema update process:

1. Run the reset script:
   ```bash
   ./reset-supabase.sh
   ```

2. Restart your Next.js application:
   ```bash
   npm run dev
   ```

### Option 2: Manual Steps

If you prefer to run the commands manually, follow these steps:

1. Stop the running Supabase instance:
   ```bash
   npx supabase stop
   ```

2. Start Supabase with the --reset flag to reset the database:
   ```bash
   npx supabase start --reset
   ```

3. Apply the updated schema:
   ```bash
   psql postgresql://postgres:postgres@localhost:54322/postgres -f supabase/updated-seed.sql
   ```

4. Restart your Next.js application:
   ```bash
   npm run dev
   ```

The resources page should now work correctly.

## Additional Notes

- The updated schema includes sample data for resource categories
- Make sure your Supabase instance is running before starting the Next.js application
- If you encounter any issues with authentication, you may need to recreate your user account
