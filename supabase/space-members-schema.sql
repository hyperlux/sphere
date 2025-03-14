-- Space Members table
CREATE TABLE IF NOT EXISTS public.space_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'moderator', 'member')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(space_id, user_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_space_members_space_id ON public.space_members(space_id);
CREATE INDEX IF NOT EXISTS idx_space_members_user_id ON public.space_members(user_id);
