-- Forum-related tables for AuroConnect

-- Forum Categories table
CREATE TABLE IF NOT EXISTS public.forum_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    community_id UUID REFERENCES public.communities(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sort_order INTEGER DEFAULT 0,
    icon TEXT
);

-- Forum Topics table
CREATE TABLE IF NOT EXISTS public.forum_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category_id UUID REFERENCES public.forum_categories(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0
);

-- Forum Posts table
CREATE TABLE IF NOT EXISTS public.forum_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    topic_id UUID REFERENCES public.forum_topics(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_solution BOOLEAN DEFAULT FALSE
);

-- Post Reactions table
CREATE TABLE IF NOT EXISTS public.post_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id),
    reaction_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id, reaction_type)
);

-- Seed some initial forum categories
INSERT INTO public.forum_categories (name, description, created_by, icon, sort_order) VALUES 
    ('Announcements', 'Official announcements from Auroville', 
     (SELECT id FROM public.users WHERE username = 'AuroAdmin'), '📢', 1),
    ('Community Projects', 'Discussions about ongoing and future community projects', 
     (SELECT id FROM public.users WHERE username = 'AuroAdmin'), '🌱', 2),
    ('Sustainability', 'Discussions about sustainable living and practices', 
     (SELECT id FROM public.users WHERE username = 'CommunityLead'), '♻️', 3),
    ('Volunteer Opportunities', 'Find and offer volunteer opportunities in Auroville', 
     (SELECT id FROM public.users WHERE username = 'CommunityLead'), '🤝', 4),
    ('Cultural Exchange', 'Share and discuss cultural experiences and events', 
     (SELECT id FROM public.users WHERE username = 'AuroAdmin'), '🎭', 5),
    ('Spiritual Growth', 'Discussions about spiritual practices and growth', 
     (SELECT id FROM public.users WHERE username = 'CommunityLead'), '🧘', 6),
    ('General Discussion', 'General topics related to Auroville', 
     (SELECT id FROM public.users WHERE username = 'AuroAdmin'), '💬', 7);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forum_topics_category_id ON public.forum_topics(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_topic_id ON public.forum_posts(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_parent_id ON public.forum_posts(parent_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON public.post_reactions(post_id);
