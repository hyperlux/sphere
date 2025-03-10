-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    username TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Resource categories table
CREATE TABLE IF NOT EXISTS public.resource_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event categories table
CREATE TABLE IF NOT EXISTS public.event_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communities table
CREATE TABLE IF NOT EXISTS public.communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table with updated schema
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    category_id UUID REFERENCES public.event_categories(id),
    creator_id UUID REFERENCES public.users(id),
    community_id UUID REFERENCES public.communities(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event attendees table
CREATE TABLE IF NOT EXISTS public.event_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('attending', 'maybe', 'not_attending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Resources table with updated schema
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    url TEXT,
    file_type TEXT,
    size_in_bytes BIGINT,
    category_id UUID REFERENCES public.resource_categories(id),
    author_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed some initial data
INSERT INTO public.users (email, name, username) VALUES 
    ('admin@aurovillenetwork.us', 'Admin User', 'AuroAdmin'),
    ('community@aurovillenetwork.us', 'Community Lead', 'CommunityLead');

INSERT INTO public.resource_categories (name) VALUES 
    ('Documents'),
    ('Images'),
    ('Videos'),
    ('Audio'),
    ('Other');

INSERT INTO public.event_categories (name) VALUES 
    ('Workshop'),
    ('Meeting'),
    ('Celebration'),
    ('Cultural'),
    ('Educational');

INSERT INTO public.communities (name, description, created_by) VALUES 
    ('Auroville Network', 'Connecting Auroville communities', (SELECT id FROM public.users WHERE username = 'AuroAdmin')),
    ('Sustainable Living', 'Exploring sustainable community practices', (SELECT id FROM public.users WHERE username = 'CommunityLead'));
