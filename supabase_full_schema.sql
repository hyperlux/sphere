-- ===========================
-- Full Integrated Supabase Schema with User Profiles
-- Generated on 2025-04-10
-- ===========================

-- ====== User Profile Table ======

-- Updated User Profile Table to match Supabase "test" project

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

-- (rest of the schema remains unchanged)
CREATE TABLE IF NOT EXISTS public.resource_categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.communities (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  votes INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.spaces (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  votes INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.bazaar_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  votes INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.events_extended (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id BIGINT REFERENCES public.event_categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  votes INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.event_attendees (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_id BIGINT REFERENCES public.events_extended(id),
  user_id UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT CHECK (status IN ('attending', 'maybe', 'not_attending')),
  UNIQUE(event_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.space_members (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  space_id BIGINT REFERENCES public.spaces(id),
  user_id UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(space_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.votes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  entity_type TEXT NOT NULL,
  entity_id BIGINT NOT NULL,
  vote INTEGER NOT NULL CHECK (vote IN (1, -1)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, entity_type, entity_id)
);

CREATE OR REPLACE VIEW public.vote_totals AS
SELECT entity_type, entity_id, SUM(vote) AS total_votes
FROM public.votes
GROUP BY entity_type, entity_id;

-- ====== Forum Schema ======

CREATE TABLE IF NOT EXISTS public.forum_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  type TEXT,
  isRead BOOLEAN DEFAULT false
);

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

CREATE TABLE IF NOT EXISTS public.forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES public.forum_topics(id),
  author_id uuid REFERENCES public.users(id),
  parent_post_id uuid REFERENCES public.forum_posts(id) NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_forum_posts_parent_post_id ON public.forum_posts(parent_post_id);

-- ====== Enable RLS ======

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

-- ====== RLS Policies ======

DROP POLICY IF EXISTS "Authenticated can view events" ON public.events;
CREATE POLICY "Authenticated can view events" ON public.events
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can view resources" ON public.resources;
CREATE POLICY "Authenticated can view resources" ON public.resources
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can insert topics" ON public.forum_topics;
CREATE POLICY "Authenticated can insert topics" ON public.forum_topics
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can insert posts" ON public.forum_posts;
CREATE POLICY "Authenticated can insert posts" ON public.forum_posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Note: Adjust policies as needed for your app's authorization model.
