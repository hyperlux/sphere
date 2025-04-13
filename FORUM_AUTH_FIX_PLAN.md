# Plan to Fix Forum Post Authentication (401 Error)

## 1. Problem Diagnosis

The `POST /api/forum/topics/[topicId]/posts` API endpoint currently returns a `401 Unauthorized` error when a user tries to create a new post.

**Root Cause:**
The server-side Supabase client, created by the `getSupabaseServerClient` function in `lib/supabase/serverClient.ts`, is initialized using the `SUPABASE_SERVICE_ROLE_KEY`. When using the service role key, the client operates with administrative privileges and bypasses standard user authentication checks based on session cookies.

As a result:
- The `supabase.auth.getUser()` call within the `getUserProfile` function (`lib/auth/getUserProfile.ts`) cannot identify the actual user making the request from their session cookie.
- `supabase.auth.getUser()` returns `null` for the user.
- `getUserProfile` subsequently returns `null`.
- The API route handler (`app/api/forum/topics/[topicId]/posts/route.ts`) receives `null` for the user profile and correctly returns the `401 Unauthorized` status.

## 2. Proposed Solution

Implement server-side user authentication correctly using the official `@supabase/ssr` library. This library provides helper functions (`createServerClient`) specifically designed to create Supabase clients that can securely read user session information from cookies within Next.js server environments (like API Route Handlers, Server Components, and Server Actions).

## 3. Implementation Steps

1.  **Install Dependency:**
    *   Add the `@supabase/ssr` package to the project's dependencies.
    *   Command: `npm install @supabase/ssr`

2.  **Create SSR Cookie Helper:**
    *   Create a new file, e.g., `lib/supabase/ssrCookieHelper.ts`.
    *   Implement utility functions based on the Supabase documentation for reading and writing cookies using the `cookies` function from `next/headers`. This ensures compatibility with Next.js Route Handlers and other server-side contexts.

3.  **Update/Create Server Client Logic:**
    *   Create a new function, potentially named `createSupabaseServerClientForUser` (or similar), possibly within `lib/supabase/serverClient.ts` or a new dedicated file (e.g., `lib/supabase/ssrClient.ts`).
    *   This function will:
        *   Import `createServerClient` from `@supabase/ssr`.
        *   Import the cookie helper functions created in Step 2.
        *   Call `createServerClient`, passing the Supabase URL, **anon key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`), and the cookie helper object.
    *   **Important:** This client uses the *anon* key, not the service role key. Authentication relies on the user's session cookie being correctly processed by `@supabase/ssr`.

4.  **Update API Route:**
    *   Modify the `POST` function in `app/api/forum/topics/[topicId]/posts/route.ts`.
    *   Instead of calling the old `getSupabaseServerClient(request)`, call the *new* function created in Step 3 (e.g., `createSupabaseServerClientForUser()`). Note that the way cookies are accessed might change slightly depending on the exact implementation of the cookie helper (e.g., using `cookies()` from `next/headers` directly in the route or passing the `request` object if needed by the helper).
    *   Pass the resulting client instance to `getUserProfile`.

## 4. Expected Outcome

- The `@supabase/ssr`-based client will correctly read the user's session cookie from the incoming request.
- `supabase.auth.getUser()` (called within `getUserProfile`) will successfully retrieve the authenticated user's details.
- `getUserProfile` will return a valid `UserProfile` object.
- The API route will no longer return `401 Unauthorized` due to authentication failure.
- Authenticated users will be able to successfully create posts in forum topics.

## 5. Next Action

Switch to "Code" mode to begin implementing these steps.