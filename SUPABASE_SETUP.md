# Supabase Storage Setup Guide

## 1. Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Name the bucket: `backgrounds`
5. Set it as **Public** (so images can be accessed without authentication)
6. Click **Create bucket**

## 2. Configure Storage Policies

### Public Read Access

```sql
-- Allow public read access to background images
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'backgrounds');
```

### Authenticated Upload Access

```sql
-- Allow authenticated users to upload background images
CREATE POLICY "Authenticated upload access" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'backgrounds' AND auth.role() = 'authenticated');
```

### Authenticated Delete Access

```sql
-- Allow authenticated users to delete their own background images
CREATE POLICY "Authenticated delete access" ON storage.objects
FOR DELETE USING (bucket_id = 'backgrounds' AND auth.role() = 'authenticated');
```

## 3. Environment Variables

Make sure your `.env.local` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. Testing the Setup

1. Start your development server: `npm run dev`
2. Open the admin panel
3. Try uploading a background image
4. Check the Supabase Storage dashboard to see the uploaded file
5. Verify the image appears as the desktop background

## 5. Next Steps

After this setup is working, we can:

-   Create a database table to track background selections
-   Add user-specific background management
-   Implement media management for Portfolio and My Files folders
-   Add image optimization and resizing

## Troubleshooting

### Common Issues:

1. **"Bucket not found" error**: Make sure the bucket name is exactly `backgrounds`
2. **"Permission denied" error**: Check that the storage policies are correctly configured
3. **Images not loading**: Verify the bucket is set to public
4. **Upload fails**: Check that the file size is within limits (default is 50MB)

### File Size Limits:

-   Default Supabase Storage limit: 50MB per file
-   For larger files, consider implementing client-side compression
-   For production, consider using a CDN for better performance
