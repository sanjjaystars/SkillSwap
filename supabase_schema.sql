-- SkillSwap Supabase Database Schema (Complete)
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    handle TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    title TEXT DEFAULT 'SkillSwap Member',
    bio TEXT,
    rating NUMERIC DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    sessions_completed INT DEFAULT 0,
    streak_days INT DEFAULT 1,
    xp INT DEFAULT 150,
    level INT DEFAULT 1,
    referral_code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Skills Table (Skills Taught and Learned)
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('teach', 'learn')),
    proficiency TEXT CHECK (proficiency IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Intermediate',
    category TEXT DEFAULT 'General',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Connections Table (User to User Network)
CREATE TABLE IF NOT EXISTS public.connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sender_id, receiver_id)
);

-- 4. Learning Sessions Table
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    learner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    topic TEXT NOT NULL,
    skill_exchanged TEXT NOT NULL,
    date_str TEXT NOT NULL,
    duration TEXT DEFAULT '60 mins',
    status TEXT CHECK (status IN ('upcoming', 'completed', 'cancelled')) DEFAULT 'upcoming',
    meet_url TEXT NOT NULL,
    rating INT,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Direct Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    meet_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Community Feed Posts Table
CREATE TABLE IF NOT EXISTS public.feed_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    likes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════
-- PROFILES POLICIES
-- ═══════════════════════════════════════════════════════════
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ═══════════════════════════════════════════════════════════
-- SKILLS POLICIES
-- ═══════════════════════════════════════════════════════════
CREATE POLICY "Skills are viewable by everyone"
  ON public.skills FOR SELECT USING (true);

CREATE POLICY "Users can insert own skills"
  ON public.skills FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
  ON public.skills FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
  ON public.skills FOR DELETE USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════
-- CONNECTIONS POLICIES
-- ═══════════════════════════════════════════════════════════
CREATE POLICY "Connections viewable by involved users"
  ON public.connections FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send connection requests"
  ON public.connections FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Receiver can update connection status"
  ON public.connections FOR UPDATE
  USING (auth.uid() = receiver_id);

CREATE POLICY "Users can delete own sent connections"
  ON public.connections FOR DELETE
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- ═══════════════════════════════════════════════════════════
-- SESSIONS POLICIES
-- ═══════════════════════════════════════════════════════════
CREATE POLICY "Sessions viewable by participants"
  ON public.sessions FOR SELECT
  USING (auth.uid() = teacher_id OR auth.uid() = learner_id);

CREATE POLICY "Users can create sessions"
  ON public.sessions FOR INSERT
  WITH CHECK (auth.uid() = teacher_id OR auth.uid() = learner_id);

CREATE POLICY "Participants can update sessions"
  ON public.sessions FOR UPDATE
  USING (auth.uid() = teacher_id OR auth.uid() = learner_id);

CREATE POLICY "Participants can delete sessions"
  ON public.sessions FOR DELETE
  USING (auth.uid() = teacher_id OR auth.uid() = learner_id);

-- ═══════════════════════════════════════════════════════════
-- MESSAGES POLICIES
-- ═══════════════════════════════════════════════════════════
CREATE POLICY "Messages viewable by sender and recipient"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- ═══════════════════════════════════════════════════════════
-- FEED POSTS POLICIES
-- ═══════════════════════════════════════════════════════════
CREATE POLICY "Feed posts viewable by everyone"
  ON public.feed_posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create feed posts"
  ON public.feed_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own feed posts"
  ON public.feed_posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own feed posts"
  ON public.feed_posts FOR DELETE
  USING (auth.uid() = author_id);

-- ═══════════════════════════════════════════════════════════
-- AUTO-CREATE PROFILE ON SIGNUP (Trigger)
-- ═══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, handle, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    '@' || lower(replace(COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), ' ', '')),
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      'https://ui-avatars.com/api/?name=' || encode(COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))::bytea, 'base64') || '&background=6366f1&color=fff&size=200'
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it already exists, then create it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ═══════════════════════════════════════════════════════════
-- ENABLE REALTIME for messages
-- ═══════════════════════════════════════════════════════════
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
