-- Create the bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own bookmarks
CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks" ON public.bookmarks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own bookmarks
CREATE POLICY "Users can update their own bookmarks" ON public.bookmarks
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks
    FOR DELETE
    USING (auth.uid() = user_id);

-- Enable Realtime for the bookmarks table
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;
