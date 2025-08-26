import { createClient } from './client';

const supabase = createClient();

export interface BackgroundImage {
    id: string;
    url: string;
    filename: string;
    created_at: string;
    user_id?: string;
}

export const storageUtils = {
    // Upload background image to Supabase Storage
    async uploadBackgroundImage(
        file: File,
        userId?: string
    ): Promise<BackgroundImage | null> {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `background-${Date.now()}.${fileExt}`;
            const filePath = userId
                ? `backgrounds/${userId}/${fileName}`
                : `backgrounds/${fileName}`;

            const { data, error } = await supabase.storage
                .from('backgrounds')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (error) {
                console.error('Error uploading background image:', error);
                return null;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('backgrounds')
                .getPublicUrl(data.path);

            return {
                id: data.path,
                url: urlData.publicUrl,
                filename: file.name,
                created_at: new Date().toISOString(),
                user_id: userId,
            };
        } catch (error) {
            console.error('Error in uploadBackgroundImage:', error);
            return null;
        }
    },

    // Get current background image
    async getCurrentBackground(
        userId?: string
    ): Promise<BackgroundImage | null> {
        try {
            // For now, we'll store the current background in localStorage as a fallback
            // Later we can create a database table to store this information
            const savedBackground = localStorage.getItem(
                'studio64-background-image'
            );
            if (savedBackground) {
                return {
                    id: 'local-background',
                    url: savedBackground,
                    filename: 'background.jpg',
                    created_at: new Date().toISOString(),
                    user_id: userId,
                };
            }
            return null;
        } catch (error) {
            console.error('Error getting current background:', error);
            return null;
        }
    },

    // Delete background image
    async deleteBackgroundImage(filePath: string): Promise<boolean> {
        try {
            const { error } = await supabase.storage
                .from('backgrounds')
                .remove([filePath]);

            if (error) {
                console.error('Error deleting background image:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error in deleteBackgroundImage:', error);
            return false;
        }
    },

    // List all background images for a user
    async listBackgroundImages(userId?: string): Promise<BackgroundImage[]> {
        try {
            const folderPath = userId
                ? `backgrounds/${userId}/`
                : 'backgrounds/';

            const { data, error } = await supabase.storage
                .from('backgrounds')
                .list(folderPath);

            if (error) {
                console.error('Error listing background images:', error);
                return [];
            }

            const backgrounds: BackgroundImage[] = [];

            for (const file of data) {
                const { data: urlData } = supabase.storage
                    .from('backgrounds')
                    .getPublicUrl(`${folderPath}${file.name}`);

                backgrounds.push({
                    id: `${folderPath}${file.name}`,
                    url: urlData.publicUrl,
                    filename: file.name,
                    created_at: file.created_at,
                    user_id: userId,
                });
            }

            return backgrounds;
        } catch (error) {
            console.error('Error in listBackgroundImages:', error);
            return [];
        }
    },
};
