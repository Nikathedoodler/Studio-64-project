import { createClient } from './client';
import { FontFile } from '@/lib/media/types';

const supabase = createClient();

export interface FontUploadResult {
    success: boolean;
    font?: FontFile;
    error?: string;
}

export interface FontDeleteResult {
    success: boolean;
    error?: string;
}

export const fontStorageUtils = {
    /**
     * Upload a font file to Supabase Storage and create database record
     */
    async uploadFont(
        file: File,
        metadata: {
            title: string;
            description?: string;
            fontFamily: string;
            fontWeight?: string;
            fontStyle?: string;
        },
        userId?: string
    ): Promise<FontUploadResult> {
        try {
            // Validate file type
            const supportedFormats = ['ttf', 'otf', 'woff', 'woff2'];
            const fileExtension = file.name.split('.').pop()?.toLowerCase();

            if (!fileExtension || !supportedFormats.includes(fileExtension)) {
                return {
                    success: false,
                    error: `Unsupported font format. Supported formats: ${supportedFormats.join(
                        ', '
                    )}`,
                };
            }

            // Validate file size (10MB limit)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                return {
                    success: false,
                    error: 'Font file too large. Maximum size is 10MB.',
                };
            }

            // Generate unique filename
            const timestamp = Date.now();
            const fileName = `${metadata.fontFamily
                .replace(/\s+/g, '-')
                .toLowerCase()}-${timestamp}.${fileExtension}`;
            const filePath = userId
                ? `fonts/${userId}/${fileName}`
                : `fonts/${fileName}`;

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } =
                await supabase.storage.from('fonts').upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) {
                console.error('Error uploading font file:', uploadError);
                return {
                    success: false,
                    error: `Upload failed: ${uploadError.message}`,
                };
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('fonts')
                .getPublicUrl(uploadData.path);

            // Create database record
            const { data: dbData, error: dbError } = await supabase
                .from('fonts')
                .insert({
                    filename: file.name,
                    title: metadata.title,
                    description: metadata.description,
                    file_type: 'font',
                    file_size: file.size,
                    file_url: urlData.publicUrl,
                    folder_id: 'fonts',
                    format: fileExtension,
                    font_family: metadata.fontFamily,
                    font_weight: metadata.fontWeight || '400',
                    font_style: metadata.fontStyle || 'normal',
                    uploaded_by: userId,
                })
                .select()
                .single();

            if (dbError) {
                console.error('Error creating font record:', dbError);
                // Clean up uploaded file
                await supabase.storage.from('fonts').remove([uploadData.path]);
                return {
                    success: false,
                    error: `Database error: ${dbError.message}`,
                };
            }

            // Convert to FontFile format
            const font: FontFile = {
                id: dbData.id,
                filename: dbData.filename,
                title: dbData.title,
                description: dbData.description,
                fileType: 'font',
                fileSize: dbData.file_size,
                fileUrl: dbData.file_url,
                folderId: dbData.folder_id,
                uploadedAt: new Date(dbData.uploaded_at),
                uploadedBy: dbData.uploaded_by,
                format: dbData.format,
                fontFamily: dbData.font_family,
                fontWeight: dbData.font_weight,
                fontStyle: dbData.font_style,
            };

            return {
                success: true,
                font,
            };
        } catch (error) {
            console.error('Error in uploadFont:', error);
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error occurred',
            };
        }
    },

    /**
     * Get all fonts from the database
     */
    async getAllFonts(): Promise<FontFile[]> {
        try {
            const { data, error } = await supabase
                .from('fonts')
                .select('*')
                .order('uploaded_at', { ascending: false });

            if (error) {
                console.error('Error fetching fonts:', error);
                return [];
            }

            return data.map((font) => ({
                id: font.id,
                filename: font.filename,
                title: font.title,
                description: font.description,
                fileType: 'font' as const,
                fileSize: font.file_size,
                fileUrl: font.file_url,
                folderId: font.folder_id,
                uploadedAt: new Date(font.uploaded_at),
                uploadedBy: font.uploaded_by,
                format: font.format,
                fontFamily: font.font_family,
                fontWeight: font.font_weight,
                fontStyle: font.font_style,
            }));
        } catch (error) {
            console.error('Error in getAllFonts:', error);
            return [];
        }
    },

    /**
     * Delete a font from both storage and database
     */
    async deleteFont(
        fontId: string,
        userId?: string
    ): Promise<FontDeleteResult> {
        try {
            // Get font record first
            const { data: font, error: fetchError } = await supabase
                .from('fonts')
                .select('*')
                .eq('id', fontId)
                .single();

            if (fetchError) {
                console.error('Error fetching font for deletion:', fetchError);
                return {
                    success: false,
                    error: 'Font not found',
                };
            }

            // Check permissions (user can only delete their own fonts, unless admin)
            if (userId && font.uploaded_by !== userId) {
                // Check if user is admin
                const { data: user } = await supabase.auth.getUser();
                const isAdmin = user.user?.user_metadata?.role === 'admin';

                if (!isAdmin) {
                    return {
                        success: false,
                        error: 'Permission denied. You can only delete your own fonts.',
                    };
                }
            }

            // Extract file path from URL for storage deletion
            const url = new URL(font.file_url);
            const pathParts = url.pathname.split('/');
            const filePath = pathParts
                .slice(pathParts.indexOf('fonts'))
                .join('/');

            // Delete from storage
            const { error: storageError } = await supabase.storage
                .from('fonts')
                .remove([filePath]);

            if (storageError) {
                console.error(
                    'Error deleting font file from storage:',
                    storageError
                );
                // Continue with database deletion even if storage deletion fails
            }

            // Delete from database
            const { error: dbError } = await supabase
                .from('fonts')
                .delete()
                .eq('id', fontId);

            if (dbError) {
                console.error('Error deleting font from database:', dbError);
                return {
                    success: false,
                    error: `Database error: ${dbError.message}`,
                };
            }

            return {
                success: true,
            };
        } catch (error) {
            console.error('Error in deleteFont:', error);
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error occurred',
            };
        }
    },

    /**
     * Get fonts by folder ID
     */
    async getFontsByFolder(folderId: string): Promise<FontFile[]> {
        try {
            const { data, error } = await supabase
                .from('fonts')
                .select('*')
                .eq('folder_id', folderId)
                .order('uploaded_at', { ascending: false });

            if (error) {
                console.error('Error fetching fonts by folder:', error);
                return [];
            }

            return data.map((font) => ({
                id: font.id,
                filename: font.filename,
                title: font.title,
                description: font.description,
                fileType: 'font' as const,
                fileSize: font.file_size,
                fileUrl: font.file_url,
                folderId: font.folder_id,
                uploadedAt: new Date(font.uploaded_at),
                uploadedBy: font.uploaded_by,
                format: font.format,
                fontFamily: font.font_family,
                fontWeight: font.font_weight,
                fontStyle: font.font_style,
            }));
        } catch (error) {
            console.error('Error in getFontsByFolder:', error);
            return [];
        }
    },

    /**
     * Search fonts by title or font family
     */
    async searchFonts(query: string): Promise<FontFile[]> {
        try {
            const { data, error } = await supabase
                .from('fonts')
                .select('*')
                .or(`title.ilike.%${query}%,font_family.ilike.%${query}%`)
                .order('uploaded_at', { ascending: false });

            if (error) {
                console.error('Error searching fonts:', error);
                return [];
            }

            return data.map((font) => ({
                id: font.id,
                filename: font.filename,
                title: font.title,
                description: font.description,
                fileType: 'font' as const,
                fileSize: font.file_size,
                fileUrl: font.file_url,
                folderId: font.folder_id,
                uploadedAt: new Date(font.uploaded_at),
                uploadedBy: font.uploaded_by,
                format: font.format,
                fontFamily: font.font_family,
                fontWeight: font.font_weight,
                fontStyle: font.font_style,
            }));
        } catch (error) {
            console.error('Error in searchFonts:', error);
            return [];
        }
    },
};
