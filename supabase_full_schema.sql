-- ===========================
-- Full Integrated Supabase Schema with User Profiles
-- Generated on 2025-04-10
-- ===========================

--
-- SCHEMA SUMMARY (Quick Reference)
--
-- Tables:
--   - public.users: App user profile table, linked to auth.users (Supabase Auth)
--   - public.profiles: Minimal profile table, referenced by forum_posts (author_id)
--   - public.resource_categories: Resource category definitions
--   - public.communities: Community groups
--   - public.spaces: Community spaces
--   - public.bazaar_items: Marketplace items, linked to auth.users
--   - public.events_extended: Extended event info, linked to event_categories
--   - public.event_attendees: Event attendance, linked to events_extended and auth.users
--   - public.space_members: Space membership, linked to spaces and auth.users
--   - public.votes: Voting on entities, linked to auth.users
--   - public.forum_categories: Forum category definitions
--   - public.events: Simple events table
--   - public.resources: Shared resources, author references public.users
--   - public.forum_topics: Forum topics, author references public.users
--   - public.forum_posts: Forum posts, author references public.profiles
--
-- Relationships (Foreign Keys):
--   - users.auth_user_id → auth.users.id
--   - bazaar_items.user_id → auth.users.id
--   - event_attendees.event_id → events_extended.id
--   - event_attendees.user_id → auth.users.id
--   - space_members.space_id → spaces.id
--   - space_members.user_id → auth.users.id
--   - votes.user_id → auth.users.id
--   - events_extended.category_id → event_categories.id
--   - resources.author → users.id
--   - forum_topics.category_id → forum_categories.id
--   - forum_topics.author_id → users.id
--   - forum_posts.topic_id → forum_topics.id
--   - forum_posts.author_id → profiles.id
--   - forum_posts.parent_post_id → forum_posts.id
--
-- Views:
--   - vote_totals: Aggregates votes by entity
--   - forum_posts_with_user: Joins forum_posts with profiles for user info
--
-- RLS Policies:
--   - See section at end of file for all enabled policies and their logic.
--
-- Triggers/Functions:
--   - handle_new_auth_user: Syncs new auth.users to public.users
--   - on_auth_user_created: Trigger for above function
--
-- For details, see inline comments below.

-- ====== User Profile Table ======

-- Updated User Profile Table to match Supabase "test" project

--
-- Table: public.users
-- App user profile table, linked to Supabase Auth (auth.users)
-- Each user has a unique auth_user_id (from Supabase Auth), plus profile fields.
--
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  interests TEXT[],
  skills TEXT[],
  project_links JSONB
);

ALTER TABLE public.users
  ADD CONSTRAINT users_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES auth.users(id);

-- Note: The "author" field in public.resources and "author_id" in forum tables reference public.users(id)

-- ====== Profiles Table (from live "test" DB) ======
--
-- Table: public.profiles
-- Minimal profile table, referenced by forum_posts.author_id
-- Used for forum user display, not directly linked to auth.users.
--
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL,
  username TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  avatar_url TEXT
);

-- ====== Trigger: Sync public.users with auth.users ======
--
-- Function: public.handle_new_auth_user
-- Triggered after insert on auth.users, ensures a matching row in public.users.
--
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new public.users row if it doesn't exist
  INSERT INTO public.users (auth_user_id, username, created_at)
  VALUES (NEW.id, NEW.email, NOW())
  ON CONFLICT (auth_user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- (rest of the schema remains unchanged)
--
-- Table: public.resource_categories
-- Categories for resources (e.g., documents, links)
--
CREATE TABLE IF NOT EXISTS public.resource_categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

--
-- Table: public.communities
-- Community groups within the app.
--
CREATE TABLE IF NOT EXISTS public.communities (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  votes INTEGER DEFAULT 0
);

--
-- Table: public.spaces
-- Spaces within communities.
--
CREATE TABLE IF NOT EXISTS public.spaces (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  votes INTEGER DEFAULT 0
);

--
-- Table: public.bazaar_items
-- Marketplace items, linked to auth.users.
--
CREATE TABLE IF NOT EXISTS public.bazaar_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  votes INTEGER DEFAULT 0
);

--
-- Table: public.events_extended
-- Extended event info, linked to event_categories.
--
CREATE TABLE IF NOT EXISTS public.events_extended (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id BIGINT REFERENCES public.event_categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  votes INTEGER DEFAULT 0
);

--
-- Table: public.event_attendees
-- Tracks which users are attending which events.
--
CREATE TABLE IF NOT EXISTS public.event_attendees (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_id BIGINT REFERENCES public.events_extended(id),
  user_id UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT CHECK (status IN ('attending', 'maybe', 'not_attending')),
  UNIQUE(event_id, user_id)
);

--
-- Table: public.space_members
-- Membership of users in spaces.
--
CREATE TABLE IF NOT EXISTS public.space_members (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  space_id BIGINT REFERENCES public.spaces(id),
  user_id UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(space_id, user_id)
);

--
-- Table: public.votes
-- Voting on entities (e.g., posts, items), linked to auth.users.
--
CREATE TABLE IF NOT EXISTS public.votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL,
  entity_type text NOT NULL,
  vote boolean NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

--
-- View: public.vote_totals
-- Aggregates total votes for each entity.
--
CREATE OR REPLACE VIEW public.vote_totals AS
SELECT entity_type, entity_id, SUM(vote) AS total_votes
FROM public.votes
GROUP BY entity_type, entity_id;

-- ====== Forum Schema ======

--
-- Table: public.forum_categories
-- Categories for forum topics.
--
CREATE TABLE IF NOT EXISTS public.forum_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

--
-- Table: public.events
-- Simple events table.
--
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  type TEXT,
  isRead BOOLEAN DEFAULT false
);

--
-- Table: public.resources
-- Shared resources (documents, links), author references public.users.
--
CREATE TABLE IF NOT EXISTS public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  author UUID REFERENCES public.users(id),
  type TEXT,
  tags JSONB
);

--
-- Table: public.forum_topics
-- Forum topics, author references public.users.
--
CREATE TABLE IF NOT EXISTS public.forum_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT,
  category_id uuid REFERENCES public.forum_categories(id),
  author_id uuid REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  last_activity_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

--
-- Table: public.forum_posts
-- Forum posts, author references public.profiles, supports threading via parent_post_id.
--
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES public.forum_topics(id),
  author_id uuid REFERENCES public.profiles(id),
  parent_post_id uuid REFERENCES public.forum_posts(id) NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_forum_posts_parent_post_id ON public.forum_posts(parent_post_id);

-- ====== Forum Posts View with User Info ======
--
-- View: public.forum_posts_with_user
-- Joins forum_posts with profiles for user info display.
--
CREATE OR REPLACE VIEW public.forum_posts_with_user AS
SELECT
  fp.*,
  p.id AS user_id,
  p.username,
  p.avatar_url
FROM public.forum_posts fp
LEFT JOIN public.profiles p ON fp.author_id = p.id;

-- ====== Enable RLS ======

--
-- Enable Row Level Security (RLS) on key tables.
--
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

-- ====== RLS Policies ======

--
-- RLS Policy: Authenticated users can view events.
--
DROP POLICY IF EXISTS "Authenticated can view events" ON public.events;
CREATE POLICY "Authenticated can view events" ON public.events
  FOR SELECT USING (auth.role() = 'authenticated');

--
-- RLS Policy: Authenticated users can view resources.
--
DROP POLICY IF EXISTS "Authenticated can view resources" ON public.resources;
CREATE POLICY "Authenticated can view resources" ON public.resources
  FOR SELECT USING (auth.role() = 'authenticated');

--
-- RLS Policy: Authenticated users can insert forum topics.
--
DROP POLICY IF EXISTS "Authenticated can insert topics" ON public.forum_topics;
CREATE POLICY "Authenticated can insert topics" ON public.forum_topics
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

--
-- RLS Policy: Authenticated users can insert forum posts if their profile matches auth.uid().
--
DROP POLICY IF EXISTS "Authenticated can insert posts" ON public.forum_posts;
CREATE POLICY "Authenticated can insert posts" ON public.forum_posts
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND author_id = (
      SELECT id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Note: Adjust policies as needed for your app's authorization model.

