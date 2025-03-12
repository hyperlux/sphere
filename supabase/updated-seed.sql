-- Seed some initial data
INSERT INTO public.users (email, username) VALUES 
    ('admin@aurovillenetwork.us', 'AuroAdmin'),
    ('community@aurovillenetwork.us', 'CommunityLead');

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
    ('Auroville Network', 'Connecting Auroville communities', (SELECT id FROM public.users WHERE username = 'AuroAdmin' LIMIT 1)),
    ('Sustainable Living', 'Exploring sustainable community practices', (SELECT id FROM public.users WHERE username = 'CommunityLead' LIMIT 1));

-- Seed some events
INSERT INTO public.events (title, description, start_time, end_time, location, category_id, created_by, community_id) VALUES
    ('Auroville Film Festival', 'A celebration of films made in Auroville', '2024-04-20T18:00:00+00:00', '2024-04-22T22:00:00+00:00', 'Auroville Theatre', (SELECT id FROM public.event_categories WHERE name = 'Cultural' LIMIT 1), (SELECT id FROM public.users WHERE username = 'AuroAdmin' LIMIT 1), (SELECT id FROM public.communities WHERE name = 'Auroville Network' LIMIT 1)),
    ('Sustainable Living Workshop', 'Learn about sustainable practices for community living', '2024-05-10T10:00:00+00:00', '2024-05-10T16:00:00+00:00', 'Sadhana Forest', (SELECT id FROM public.event_categories WHERE name = 'Workshop' LIMIT 1), (SELECT id FROM public.users WHERE username = 'CommunityLead' LIMIT 1), (SELECT id FROM public.communities WHERE name = 'Sustainable Living' LIMIT 1));

-- Seed some event attendees
INSERT INTO public.event_attendees (event_id, user_id, status) VALUES
    ((SELECT id FROM public.events WHERE title = 'Auroville Film Festival' LIMIT 1), (SELECT id FROM public.users WHERE username = 'AuroAdmin' LIMIT 1), 'attending'),
    ((SELECT id FROM public.events WHERE title = 'Sustainable Living Workshop' LIMIT 1), (SELECT id FROM public.users WHERE username = 'CommunityLead' LIMIT 1), 'attending');
