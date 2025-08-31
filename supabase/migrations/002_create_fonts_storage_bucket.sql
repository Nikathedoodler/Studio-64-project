-- Create fonts storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'fonts',
    'fonts',
    true,
    10485760, -- 10MB limit for font files
    ARRAY[
        'font/ttf',
        'font/otf',
        'font/woff',
        'font/woff2',
        'application/font-ttf',
        'application/font-otf',
        'application/font-woff',
        'application/font-woff2'
    ]
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for fonts bucket
-- Public read access (anyone can download fonts)
CREATE POLICY "Public read access for fonts storage" ON storage.objects
    FOR SELECT USING (bucket_id = 'fonts');

-- Authenticated users can upload fonts
CREATE POLICY "Authenticated users can upload fonts" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'fonts' 
        AND auth.role() = 'authenticated'
    );

-- Users can update their own font files
CREATE POLICY "Users can update their own font files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'fonts' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Users can delete their own font files
CREATE POLICY "Users can delete their own font files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'fonts' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Admin users can manage all font files
CREATE POLICY "Admin users can manage all font files" ON storage.objects
    FOR ALL USING (
        bucket_id = 'fonts' 
        AND EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );
