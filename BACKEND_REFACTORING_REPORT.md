# Supabase User Profile Trigger Issue Report

## Summary

The forum API returned 401 Unauthorized errors when creating topics because the `users` table was empty — no user profiles existed. To automate profile creation, a trigger was added on `auth.users` to insert a row into `public.users` whenever a new user signed up. However, this trigger caused all signup attempts to fail with a 500 Internal Server Error.

---

## Timeline of Actions

### Initial Problem
- Forum categories returned 500 due to missing table/data — fixed by creating table and seeding data.
- Persistent 401 errors when creating topics.
- Root cause: `getUserProfile()` returned null because no user profiles existed in `public.users`.

### Attempted Solution
- Created a trigger `on_auth_user_created` on `auth.users`:
  ```sql
  create or replace function public.handle_new_user()
  returns trigger as $$
  begin
    insert into public.users (auth_user_id)
    values (new.id)
    on conflict do nothing;
    return new;
  end;
  $$ language plpgsql;

  drop trigger if exists on_auth_user_created on auth.users;
  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
  ```
- Purpose: automatically insert a profile row when a new user signs up.

### Result
- After adding the trigger, **all signup attempts failed** with:
  ```
  500 Internal Server Error
  {"code":"unexpected_failure","message":"Database error saving new user"}
  ```
- Supabase Auth logs showed:
  ```
  ERROR: permission denied for schema public (SQLSTATE 42501)
  ```
- This indicated the Supabase Auth system role (`supabase_auth_admin`) lacked permissions to execute the trigger's insert.

### Fix Attempted
- Granted full privileges on `public`, `auth`, and `storage` schemas to `supabase_auth_admin`.
- Despite this, the 500 error persisted.

### Temporary Resolution
- **Dropped the trigger**:
  ```sql
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  ```
- After dropping, signup **succeeded again**.
- However, no user profile rows are created automatically, so topic creation still fails with 401 Unauthorized or user profile not found.

---

## Root Cause

- The trigger `on_auth_user_created` caused signup failures.
- Likely due to:
  - Insufficient permissions for the Supabase Auth system role to execute the trigger or insert into `public.users`.
  - Or, transaction conflicts or errors inside the trigger function.
- Disabling the trigger fixed signup, confirming it was the cause.

---

## Current State

- Signups work, but **no user profiles are created automatically**.
- This causes 401 errors when creating topics, since the API expects a profile row in `public.users`.
- The trigger is **disabled**.
- The underlying permission or logic issue with the trigger remains unresolved.

---

## Next Steps for Future Investigation

- Review and fix the trigger logic and permissions.
- Consider alternative approaches:
  - Use Supabase Auth hooks (Edge Functions) to create profiles.
  - Create profiles on first login via API logic.
- Ensure the `supabase_auth_admin` role has sufficient privileges to execute triggers and insert into `public.users`.
- Add error handling/logging inside the trigger to capture failures.
