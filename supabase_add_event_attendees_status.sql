ALTER TABLE public.event_attendees
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('attending', 'maybe', 'not_attending'));
