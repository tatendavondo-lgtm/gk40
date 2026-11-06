-- ==============================================================================
-- SUPABASE DATABASE SETUP FOR GK's 40th BIRTHDAY RSVP
-- Run this in your Supabase project: Dashboard -> SQL Editor -> New query -> Run
-- ==============================================================================

-- 1. Create the RSVPs table
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    attendance TEXT NOT NULL CHECK (attendance IN ('attending', 'declined')),
    guest_count INTEGER DEFAULT 1,
    plus_one_name TEXT,
    wishes TEXT
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow public/anonymous guests to submit their RSVP
CREATE POLICY "Allow anonymous RSVP submission"
ON public.rsvps
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. Policy: Allow reading RSVPs for Host Dashboard
CREATE POLICY "Allow reading RSVPs"
ON public.rsvps
FOR SELECT
TO anon, authenticated
USING (true);

-- Optional: Create index on created_at for fast sorting
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON public.rsvps(created_at DESC);
