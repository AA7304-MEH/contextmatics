-- Create media_items table
CREATE TABLE IF NOT EXISTS media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'image', 'logo', 'video'
  prompt TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

-- Create Policies
DROP POLICY IF EXISTS "Users can view own media" ON media_items;
CREATE POLICY "Users can view own media" 
  ON media_items FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own media" ON media_items;
CREATE POLICY "Users can insert own media" 
  ON media_items FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own media" ON media_items;
CREATE POLICY "Users can delete own media" 
  ON media_items FOR DELETE 
  USING (auth.uid() = user_id);

-- Create Index
CREATE INDEX IF NOT EXISTS idx_media_items_user_id ON media_items(user_id);
CREATE INDEX IF NOT EXISTS idx_media_items_created_at ON media_items(created_at DESC);
