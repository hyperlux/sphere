-- Enable UUID extension
DROP TABLE IF EXISTS event_attendees CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS communities CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS resource_categories CASCADE;
DROP TABLE IF EXISTS event_categories CASCADE;
DROP TABLE IF EXISTS bazaar_items CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    username TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Communities table
CREATE TABLE IF NOT EXISTS public.communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    image_url TEXT
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    location TEXT,
    community_id UUID REFERENCES public.communities(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    url TEXT,
    type TEXT,
    community_id UUID REFERENCES public.communities(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bazaar Items table
CREATE TABLE IF NOT EXISTS public.bazaar_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    condition TEXT NOT NULL,
    location TEXT,
    image_url TEXT,
    seller_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed some initial data (optional)
INSERT INTO public.users (email, username) VALUES 
    ('admin@aurovillenetwork.us', 'AuroAdmin'),
    ('community@aurovillenetwork.us', 'CommunityLead');

INSERT INTO public.communities (name, description, created_by) VALUES 
    ('Auroville Network', 'Connecting Auroville communities', (SELECT id FROM public.users WHERE username = 'AuroAdmin')),
    ('Sustainable Living', 'Exploring sustainable community practices', (SELECT id FROM public.users WHERE username = 'CommunityLead'));

-- Seed some bazaar items
INSERT INTO public.bazaar_items (name, description, price, condition, location, seller_id) VALUES 
    ('Vintage Bicycle', 'Well-maintained vintage bicycle, perfect for getting around Auroville', 120.00, 'good', 'Auroville Center', (SELECT id FROM public.users WHERE username = 'AuroAdmin')),
    ('Handmade Pottery Set', 'Beautiful handcrafted pottery set made in Auroville', 45.50, 'new', 'Creativity Community', (SELECT id FROM public.users WHERE username = 'CommunityLead')),
    ('Solar Lamp', 'Eco-friendly solar lamp, perfect for outdoor spaces', 35.00, 'like_new', 'Solar Kitchen', (SELECT id FROM public.users WHERE username = 'AuroAdmin'));
