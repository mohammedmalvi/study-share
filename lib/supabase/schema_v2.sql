-- Drop existing tables
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS downloads CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  course TEXT NOT NULL,
  semester TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create materials table
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
  is_public BOOLEAN NOT NULL DEFAULT true,
  thumbnail TEXT,
  course TEXT,
  semester TEXT,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0.0,
  downloads INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create downloads table
CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, material_id)
);

-- RLS setup
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Subjects Policies
CREATE POLICY "Subjects are viewable by everyone." ON subjects FOR SELECT USING (true);
CREATE POLICY "Only admins can insert subjects" ON subjects FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Categories Policies
CREATE POLICY "Categories are viewable by everyone." ON categories FOR SELECT USING (true);
CREATE POLICY "Only admins can insert categories" ON categories FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Materials Policies
CREATE POLICY "Materials are viewable by everyone." ON materials FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert materials." ON materials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own materials." ON materials FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own materials." ON materials FOR DELETE USING (auth.uid() = user_id);

-- Downloads Policies
CREATE POLICY "Users can view own downloads." ON downloads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can insert downloads." ON downloads FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Favorites Policies
CREATE POLICY "Users can view own favorites." ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can insert favorites." ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites." ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Seed Subjects
INSERT INTO subjects (name, description) VALUES
  ('Programming in Python', 'Python Programming'),
  ('Database Management Systems', 'Database Management System'),
  ('Web Technologies', 'Web Development'),
  ('Theory of Computation', 'Automata Theory'),
  ('Computer Networks', 'Computer Networking'),
  ('Operating Systems', 'Operating System concepts'),
  ('Data Structures', 'Data Structures & Algorithms'),
  ('Cyber Security', 'Cyber Security'),
  ('Discrete Mathematics', 'Discrete Mathematics'),
  ('Software Engineering', 'Software Engineering'),
  ('Computer Graphics', 'Computer Graphics');

-- Seed Categories
INSERT INTO categories (name) VALUES
  ('Notes'),
  ('PDF'),
  ('Question Paper'),
  ('Assignment'),
  ('Practical File'),
  ('Study Guide');

-- Auth trigger to create profile
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, course, semester, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'course', 'BCA'),
    COALESCE(new.raw_user_meta_data->>'semester', '1st Semester'),
    'student'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Setup Storage Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('study-materials', 'study-materials', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for study-materials bucket
DROP POLICY IF EXISTS "Public can view study materials" ON storage.objects;
CREATE POLICY "Public can view study materials" ON storage.objects
FOR SELECT USING (bucket_id = 'study-materials');

DROP POLICY IF EXISTS "Authenticated users can upload study materials" ON storage.objects;
CREATE POLICY "Authenticated users can upload study materials" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'study-materials' AND auth.role() = 'authenticated'
);

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
