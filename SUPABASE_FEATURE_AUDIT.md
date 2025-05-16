# Supabase Feature Audit

This document details the usage of Supabase features within the Auroville social forum application. It serves as a reference for the migration to a self-hosted solution.

## Phase 0: Task 1 - Detailed Supabase Feature Audit

### 1. Authentication

*   **Methods Used:**
    *   [x] Email/Password (verified in [`app/login/page.tsx`](app/login/page.tsx:31) and [`app/signup/page.tsx`](app/signup/page.tsx:43))
    *   [x] Email Confirmation for Sign-up (verified in [`app/signup/page.tsx`](app/signup/page.tsx:47), redirects to `/auth/callback`)
    *   [ ] Social Logins (Specify providers: e.g., Google, GitHub) - TBD (No UI elements or code found yet)
    *   [ ] Password Reset / Magic Links for Login - TBD (Link to `/forgot-password` exists in [`app/login/page.tsx`](app/login/page.tsx:111) but `app/forgot-password/page.tsx` not found. Email confirmation for signup uses a link, which is a form of magic link.)
    *   [ ] Phone Auth - TBD
*   **Server-Side Logic:**
    *   Reviewed [`lib/supabase/serverClient.ts`](lib/supabase/serverClient.ts:8): Uses JWT extracted from Authorization header or cookies (`sb-access-token`, `sb-<project-ref>`). Uses `SUPABASE_SERVICE_ROLE_KEY`.
*   **Client-Side Logic:**
    *   [`app/login/page.tsx`](app/login/page.tsx:1): Implements email/password form. Calls `login` function from `useAuth()`.
    *   [`components/AuthProvider.tsx`](components/AuthProvider.tsx:1):
        *   Uses `createClientComponentClient()` from [`@/lib/supabase/client`](lib/supabase/client.ts:6) for Supabase client.
        *   Manages session state via `supabase.auth.getSession()` and `supabase.auth.onAuthStateChange()`.
        *   Provides `login` function which calls `supabase.auth.signInWithPassword()`.
        *   Provides `signOut` function which calls `supabase.auth.signOut()`.
    *   [`app/signup/page.tsx`](app/signup/page.tsx:1):
        *   Uses `createClientComponentClient()` from [`@/lib/supabase/client`](lib/supabase/client.ts:6).
        *   Calls `supabase.auth.signUp()` with email, password, and options including `emailRedirectTo` and additional `name` data.
        *   Handles email verification flow.
    *   [`app/auth/callback/page.tsx`](app/auth/callback/page.tsx:1):
        *   Handles the redirect from Supabase after actions like email confirmation.
        *   Extracts `access_token` and `refresh_token` from URL hash or query parameters.
        *   Calls `supabase.auth.setSession()` to establish the user's session.
        *   Redirects to `/dashboard` on success or `/login` on failure.
    *   Links to `/signup` ([`app/login/page.tsx`](app/login/page.tsx:135)) and `/forgot-password` ([`app/login/page.tsx`](app/login/page.tsx:111)) exist.
*   **User Profile Management:**
    *   `public.users` table linked to `auth.users`.
    *   `public.profiles` table used for forum posts, not directly linked to `auth.users`.
    *   Trigger `handle_new_auth_user` syncs `auth.users` to `public.users`.
*   **Key Files:**
    *   [`lib/supabase/serverClient.ts`](lib/supabase/serverClient.ts)
    *   [`lib/auth/getUserProfile.ts`](lib/auth/getUserProfile.ts)
    *   [`supabase_full_schema.sql`](supabase_full_schema.sql) (for `handle_new_auth_user` trigger and user table definitions)

### 2. Database

*   **Schema:** Documented in [`supabase_full_schema.sql`](supabase_full_schema.sql).
*   **Supabase-Specific SQL/Extensions (from schema review):**
    *   **`auth.users` table:** This table is part of Supabase's built-in authentication schema and will be replaced by the new authentication system's user management.
    *   **`auth.role()` function:** Used in RLS policies (e.g., `CREATE POLICY "Authenticated can view events" ON public.events FOR SELECT USING (auth.role() = 'authenticated');`). This will need to be replaced with equivalent logic in the application layer or with PostgreSQL roles if the new auth system can manage them.
    *   **`auth.uid()` function:** Used in RLS policies to get the current user's ID (e.g., `CREATE POLICY "Authenticated can insert posts" ON public.forum_posts FOR INSERT WITH CHECK (author_id = (SELECT id FROM public.profiles WHERE id = auth.uid()));`). This will also need replacement.
    *   **`gen_random_uuid()` function:** Used as a default for primary keys (e.g., `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`). This is a standard PostgreSQL function (from the `pgcrypto` extension, usually enabled by default) and can be kept.
    *   `supabase.functions` schema: No evidence of custom database functions deployed via this schema found yet. (TBD if any exist outside the main schema file).
*   **Row Level Security (RLS):**
    *   Extensively used. Policies rely on `auth.role()` and `auth.uid()`. Examples:
        *   `Authenticated can view events` on `public.events`
        *   `Authenticated can insert posts` on `public.forum_posts` (checks `author_id` against `auth.uid()`)
*   **Triggers:**
    *   `on_auth_user_created` on `auth.users` executes `public.handle_new_auth_user()`.

### 3. APIs (Next.js Route Handlers)

*   **Interaction Pattern:** Direct Supabase client usage via `getSupabaseServerClient()`, as seen in [`app/api/forum/topics/[topicId]/route.ts`](app/api/forum/topics/[topicId]/route.ts).
*   **Endpoint List (to be systematically reviewed for DB interactions):**
    *   [`app/api/forum/categories/route.ts`](app/api/forum/categories/route.ts)
    *   [`app/api/forum/categories/[categoryId]/topics/route.ts`](app/api/forum/categories/[categoryId]/topics/route.ts)
    *   [`app/api/forum/posts/[postId]/vote/route.ts`](app/api/forum/posts/[postId]/vote/route.ts)
    *   [`app/api/forum/topics/route.ts`](app/api/forum/topics/route.ts)
    *   [`app/api/forum/topics/[topicId]/route.ts`](app/api/forum/topics/[topicId]/route.ts) (Reviewed: Fetches single topic)
    *   [`app/api/forum/topics/[topicId]/posts/route.ts`](app/api/forum/topics/[topicId]/posts/route.ts)
    *   [`app/api/forum/topics/[topicId]/vote/route.ts`](app/api/forum/topics/[topicId]/vote/route.ts)
    *   [`app/api/health/route.ts`](app/api/health/route.ts) (Likely does not interact with Supabase)
*   **Authentication:** Relies on JWT passed to `getSupabaseServerClient()`.

### 4. Storage (File Uploads & Management)

*   **Current Implementation:**
    *   **Resources Module:** Uses Supabase Storage directly.
        *   [`components/UploadResourceForm.tsx`](components/UploadResourceForm.tsx:1):
            *   Uses `createClientComponentClient()` for Supabase client.
            *   Contains an `<input type="file">` ([`components/UploadResourceForm.tsx`](components/UploadResourceForm.tsx:123-127)).
            *   Uploads files using `supabase.storage.from('public').upload(filePath, selectedFile)` ([`components/UploadResourceForm.tsx`](components/UploadResourceForm.tsx:61-63)).
            *   Stores file metadata (title, description, path, type, size) in the `public.resources` table ([`components/UploadResourceForm.tsx`](components/UploadResourceForm.tsx:68-77)). The `url` field in `resources` table stores the `filePath`.
    *   **Forum Posts/Topics:**
        *   [`components/CreatePostForm.tsx`](components/CreatePostForm.tsx:1): No direct file input. Contains `Image` and `Paperclip` icon buttons ([`components/CreatePostForm.tsx`](components/CreatePostForm.tsx:146-165)) that are currently non-functional placeholders. Uploads for posts/topics seem not yet implemented.
    *   **User Avatars:**
        *   [`app/settings/account/page.tsx`](app/settings/account/page.tsx:1): Shows form fields for name and email, but no UI elements for avatar upload. Comments suggest the form is incomplete. Avatar upload functionality is TBD.
*   **Database References:**
    *   `users.avatar_url` (TEXT) - Likely for user profile pictures.
    *   `resources.url` (TEXT) - Stores the file path in Supabase Storage for uploaded resources.
    *   (Check other tables for potential file/media links)

### 5. Real-time

*   **Current Usage:** Appears to be not actively used for Supabase's core real-time database/presence features.
    *   Search for `supabase.channel()`, `.on()`, `.subscribe(` (Supabase Realtime SDK terms) in `*.{ts,tsx}` files yielded:
        *   [`hooks/usePWA.ts`](hooks/usePWA.ts:97): `serviceWorkerRegistration.pushManager.subscribe()`. This is for Web Push Notifications (PWA) and not Supabase Realtime channels.
    *   No direct evidence of Supabase Realtime channels for database changes or presence found yet.
*   **Potential Use Cases (if planned):**
    *   Live forum updates (new posts/comments)
    *   Notifications
    *   Chat features

### 6. Edge Functions

*   **Current Usage:** To be determined.
    *   No obvious `supabase/functions` directory or specific deployment scripts for Edge Functions are visible in the provided file list.
    *   This would ideally be confirmed by checking the Supabase project dashboard settings. For now, assuming not heavily used unless other evidence appears.