-- Create fonts table for storing font metadata
CREATE TABLE IF NOT EXISTS fonts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    file_type TEXT NOT NULL DEFAULT 'font' CHECK (file_type = 'font'),
    file_size BIGINT NOT NULL,
    file_url TEXT NOT NULL,
    folder_id TEXT NOT NULL DEFAULT 'fonts',
    format TEXT NOT NULL CHECK (format IN ('ttf', 'otf', 'woff', 'woff2')),
    font_family TEXT NOT NULL,
    font_weight TEXT DEFAULT '400',
    font_style TEXT DEFAULT 'normal' CHECK (font_style IN ('normal', 'italic')),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fonts_folder_id ON fonts(folder_id);
CREATE INDEX IF NOT EXISTS idx_fonts_format ON fonts(format);
CREATE INDEX IF NOT EXISTS idx_fonts_font_family ON fonts(font_family);
CREATE INDEX IF NOT EXISTS idx_fonts_uploaded_by ON fonts(uploaded_by);

-- Enable Row Level Security
ALTER TABLE fonts ENABLE ROW LEVEL SECURITY;

-- Create policies for fonts table
-- Public read access (anyone can view fonts)
CREATE POLICY "Public read access for fonts" ON fonts
    FOR SELECT USING (true);

-- Authenticated users can insert fonts
CREATE POLICY "Authenticated users can insert fonts" ON fonts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own fonts
CREATE POLICY "Users can update their own fonts" ON fonts
    FOR UPDATE USING (auth.uid() = uploaded_by);

-- Users can delete their own fonts
CREATE POLICY "Users can delete their own fonts" ON fonts
    FOR DELETE USING (auth.uid() = uploaded_by);

-- Admin users can do everything
CREATE POLICY "Admin users can manage all fonts" ON fonts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_fonts_updated_at 
    BEFORE UPDATE ON fonts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
