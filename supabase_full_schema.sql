-- ===========================
-- Consolidated Supabase Schema
-- Generated on 2025-04-08
-- ===========================

-- ====== Custom Schema Additions ======

-- 1. Event categories
CREATE TABLE IF NOT EXISTS public.event_categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Resource categories
CREATE TABLE IF NOT EXISTS public.resource_categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Communities
CREATE TABLE IF NOT EXISTS public.communities (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  votes INTEGER DEFAULT 0
);

-- 4. Spaces
CREATE TABLE IF NOT EXISTS public.spaces (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  votes INTEGER DEFAULT 0
);

-- 5. Bazaar items
CREATE TABLE IF NOT EXISTS public.bazaar_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  votes INTEGER DEFAULT 0
);

-- 6. Events (extended version with category_id)
CREATE TABLE IF NOT EXISTS public.events_extended (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id BIGINT REFERENCES public.event_categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  votes INTEGER DEFAULT 0
);

-- 7. Event attendees
CREATE TABLE IF NOT EXISTS public.event_attendees (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_id BIGINT REFERENCES public.events_extended(id),
  user_id UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT CHECK (status IN ('attending', 'maybe', 'not_attending')),
  UNIQUE(event_id, user_id)
);

-- 8. Space members
CREATE TABLE IF NOT EXISTS public.space_members (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  space_id BIGINT REFERENCES public.spaces(id),
  user_id UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(space_id, user_id)
);

-- 9. Votes table
CREATE TABLE IF NOT EXISTS public.votes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  entity_type TEXT NOT NULL,
  entity_id BIGINT NOT NULL,
  vote INTEGER NOT NULL CHECK (vote IN (1, -1)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, entity_type, entity_id)
);

-- 10. Vote totals view
CREATE OR REPLACE VIEW public.vote_totals AS
SELECT entity_type, entity_id, SUM(vote) AS total_votes
FROM public.votes
GROUP BY entity_type, entity_id;

-- ====== Forum & RLS Schema ======

-- 1. Events table
CREATE TABLE IF NOT EXISTS public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  type text,
  isRead boolean default false
);

-- 2. Resources table
CREATE TABLE IF NOT EXISTS public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  author uuid references public.users(id),
  type text,
  tags jsonb
);

-- 3. Forum topics
CREATE TABLE IF NOT EXISTS public.forum_topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  content text,
  category_id uuid references public.forum_categories(id),
  author_id uuid references public.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  last_activity_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Forum posts
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references public.forum_topics(id),
  author_id uuid references public.users(id),
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Events
DROP POLICY IF EXISTS "Authenticated can view events" ON public.events;
CREATE POLICY "Authenticated can view events" ON public.events
FOR SELECT
USING (auth.role() = 'authenticated');

-- Resources
DROP POLICY IF EXISTS "Authenticated can view resources" ON public.resources;
CREATE POLICY "Authenticated can view resources" ON public.resources
FOR SELECT
USING (auth.role() = 'authenticated');

-- Forum topics
DROP POLICY IF EXISTS "Authenticated can insert topics" ON public.forum_topics;
CREATE POLICY "Authenticated can insert topics" ON public.forum_topics
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Forum posts
DROP POLICY IF EXISTS "Authenticated can insert posts" ON public.forum_posts;
CREATE POLICY "Authenticated can insert posts" ON public.forum_posts
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Note: Adjust policies as needed for your app's authorization model.
