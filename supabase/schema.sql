-- SUPABASE SQL SCHEMA FOR DERIN BUSE DEMIRKAYA (PHASE 2)
-- Copy & paste this into the Supabase SQL Editor if you are creating a new Supabase project.

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  city TEXT DEFAULT 'İstanbul, TR',
  member_since TEXT DEFAULT '2026',
  membership_tier TEXT DEFAULT 'Koleksiyoner Üye',
  saved_artworks TEXT[] DEFAULT ARRAY['selflove']::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Workshop Reservations Table
CREATE TABLE IF NOT EXISTS public.reservations (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workshop_id TEXT NOT NULL,
  workshop_title TEXT NOT NULL,
  workshop_date TEXT NOT NULL,
  workshop_time TEXT NOT NULL,
  location TEXT NOT NULL,
  instructor TEXT NOT NULL,
  seat_count INT DEFAULT 1,
  total_price TEXT NOT NULL,
  ticket_code TEXT NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own reservations"
  ON public.reservations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reservations"
  ON public.reservations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reservations"
  ON public.reservations FOR UPDATE
  USING (auth.uid() = user_id);
