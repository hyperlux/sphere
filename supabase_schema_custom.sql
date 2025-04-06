-- Custom schema additions for missing tables

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
