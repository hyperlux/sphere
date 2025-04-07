-- Fix existing forum_posts author_id values that incorrectly use Supabase Auth user IDs
-- Sets author_id to the internal public.users.id where matching auth_user_id

UPDATE forum_posts
SET author_id = u.id
FROM public.users u
WHERE forum_posts.author_id = u.auth_user_id;
