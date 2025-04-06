-- 1. Create 'events' table if it does not exist
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  type text,
  isRead boolean default false
);

-- 2. Create 'resources' table if it does not exist
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  author uuid references public.users(id),
  type text,
  tags jsonb
);

-- 3. Create 'forum_topics' table if it does not exist
create table if not exists public.forum_topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  content text,
  category_id uuid references public.forum_categories(id),
  author_id uuid references public.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  last_activity_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Create 'forum_posts' table if it does not exist
create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references public.forum_topics(id),
  author_id uuid references public.users(id),
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. RLS policies

-- Enable RLS on events, resources, forum_topics, forum_posts
alter table public.events enable row level security;
alter table public.resources enable row level security;
alter table public.forum_topics enable row level security;
alter table public.forum_posts enable row level security;

-- Drop and recreate policies for events
drop policy if exists "Authenticated can view events" on public.events;
create policy "Authenticated can view events" on public.events
for select
using (auth.role() = 'authenticated');

-- Drop and recreate policies for resources
drop policy if exists "Authenticated can view resources" on public.resources;
create policy "Authenticated can view resources" on public.resources
for select
using (auth.role() = 'authenticated');

-- Drop and recreate policies for forum topics
drop policy if exists "Authenticated can insert topics" on public.forum_topics;
create policy "Authenticated can insert topics" on public.forum_topics
for insert
with check (auth.role() = 'authenticated');

-- Drop and recreate policies for forum posts
drop policy if exists "Authenticated can insert posts" on public.forum_posts;
create policy "Authenticated can insert posts" on public.forum_posts
for insert
with check (auth.role() = 'authenticated');

-- Note: Adjust policies as needed for your app's authorization model.
