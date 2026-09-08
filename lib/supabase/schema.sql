-- StudyShare Database Schema
-- Run this in your Supabase SQL editor to create the required tables.

-- Materials table
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL,
  course TEXT NOT NULL,
  semester TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Notes', 'PDF', 'Question Paper', 'Assignment', 'Practical File', 'Study Guide')),
  author TEXT NOT NULL,
  upload_date TEXT NOT NULL DEFAULT to_char(NOW(), 'YYYY-MM-DD'),
  downloads INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0.0,
  file_size TEXT NOT NULL DEFAULT '0 MB',
  file_path TEXT,
  file_name TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('approved', 'pending', 'rejected')),
  thumbnail TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier TEXT NOT NULL,
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_identifier, material_id)
);

-- Downloads tracking table
CREATE TABLE IF NOT EXISTS downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier TEXT NOT NULL,
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  user_identifier TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_materials_status ON materials(status);
CREATE INDEX IF NOT EXISTS idx_materials_subject ON materials(subject);
CREATE INDEX IF NOT EXISTS idx_materials_course ON materials(course);
CREATE INDEX IF NOT EXISTS idx_materials_semester ON materials(semester);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_identifier);
CREATE INDEX IF NOT EXISTS idx_downloads_user ON downloads(user_identifier);
CREATE INDEX IF NOT EXISTS idx_downloads_material ON downloads(material_id);
CREATE INDEX IF NOT EXISTS idx_comments_material ON comments(material_id);

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(material_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE materials
  SET downloads = downloads + 1,
      updated_at = NOW()
  WHERE id = material_id;
END;
$$ LANGUAGE plpgsql;

-- Storage bucket (run in Supabase dashboard or via API)
-- CREATE POLICY for study-materials bucket:
-- Bucket name: study-materials
-- Public access for downloads, authenticated for uploads

-- Row Level Security
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow public read access to approved materials
CREATE POLICY "Public can read approved materials" ON materials
  FOR SELECT USING (status = 'approved' AND is_public = true);

-- Allow all operations with anon key (since we are not using Supabase Auth)
-- TODO: When implementing proper authentication, replace these permissive policies
-- with proper user-based RLS policies.
CREATE POLICY "Allow insert materials" ON materials
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read all materials for management" ON materials
  FOR SELECT USING (true);

CREATE POLICY "Allow update materials" ON materials
  FOR UPDATE USING (true);

CREATE POLICY "Allow delete materials" ON materials
  FOR DELETE USING (true);

CREATE POLICY "Allow all on favorites" ON favorites
  FOR ALL USING (true);

CREATE POLICY "Allow all on downloads" ON downloads
  FOR ALL USING (true);

CREATE POLICY "Allow all on comments" ON comments
  FOR ALL USING (true);
