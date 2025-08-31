// Image utility functions

import { ImageFile } from './types';

/**
 * Create mock image data for testing
 */
export const createMockImageData = (): ImageFile[] => {
    return [
        {
            id: '1',
            filename: 'studio-workspace.jpg',
            title: 'Studio Workspace',
            description: 'Our creative workspace where the magic happens',
            fileType: 'image',
            fileSize: 2048576, // 2MB
            thumbnailUrl:
                'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Studio+Workspace',
            fileUrl: 'https://picsum.photos/800/600?random=1',
            folderId: 'photos',
            uploadedAt: new Date('2024-01-15'),
            uploadedBy: 'admin',
            format: 'jpg',
            resolution: { width: 800, height: 600 },
        },
        {
            id: '2',
            filename: 'team-photo.png',
            title: 'Team Photo',
            description: 'The amazing Studio 64 team',
            fileType: 'image',
            fileSize: 3145728, // 3MB
            thumbnailUrl:
                'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Team+Photo',
            fileUrl: 'https://picsum.photos/800/600?random=2',
            folderId: 'photos',
            uploadedAt: new Date('2024-01-20'),
            uploadedBy: 'admin',
            format: 'png',
            resolution: { width: 800, height: 600 },
        },
        {
            id: '3',
            filename: 'project-showcase.jpg',
            title: 'Project Showcase',
            description: 'Highlights from our latest creative projects',
            fileType: 'image',
            fileSize: 1572864, // 1.5MB
            thumbnailUrl:
                'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Project+Showcase',
            fileUrl: 'https://picsum.photos/800/600?random=3',
            folderId: 'photos',
            uploadedAt: new Date('2024-01-25'),
            uploadedBy: 'admin',
            format: 'jpg',
            resolution: { width: 800, height: 600 },
        },
        {
            id: '4',
            filename: 'behind-scenes.gif',
            title: 'Behind the Scenes',
            description: 'A glimpse into our creative process',
            fileType: 'image',
            fileSize: 5242880, // 5MB
            thumbnailUrl:
                'https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Behind+Scenes',
            fileUrl: 'https://picsum.photos/800/600?random=4',
            folderId: 'photos',
            uploadedAt: new Date('2024-02-01'),
            uploadedBy: 'admin',
            format: 'gif',
            resolution: { width: 800, height: 600 },
        },
        {
            id: '5',
            filename: 'client-work.webp',
            title: 'Client Work',
            description: 'Some of our best client collaborations',
            fileType: 'image',
            fileSize: 1048576, // 1MB
            thumbnailUrl:
                'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Client+Work',
            fileUrl: 'https://picsum.photos/800/600?random=5',
            folderId: 'photos',
            uploadedAt: new Date('2024-02-05'),
            uploadedBy: 'admin',
            format: 'webp',
            resolution: { width: 800, height: 600 },
        },
        {
            id: '6',
            filename: 'equipment-setup.jpg',
            title: 'Equipment Setup',
            description: 'Our professional equipment and tools',
            fileType: 'image',
            fileSize: 2621440, // 2.5MB
            thumbnailUrl:
                'https://via.placeholder.com/300x200/06B6D4/FFFFFF?text=Equipment+Setup',
            fileUrl: 'https://picsum.photos/800/600?random=6',
            folderId: 'photos',
            uploadedAt: new Date('2024-02-10'),
            uploadedBy: 'admin',
            format: 'jpg',
            resolution: { width: 800, height: 600 },
        },
    ];
};

/**
 * Check if file type is a supported image format
 */
export const isSupportedImageFormat = (filename: string): boolean => {
    const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const extension = filename
        .toLowerCase()
        .substring(filename.lastIndexOf('.'));
    return supportedFormats.includes(extension);
};

/**
 * Generate thumbnail URL for image (placeholder for now)
 */
export const generateImageThumbnailUrl = (
    imageUrl: string,
    width: number = 300,
    height: number = 200
): string => {
    // In a real implementation, this would generate thumbnails from the original image
    // For now, we'll use placeholder images
    return `https://via.placeholder.com/${width}x${height}/4F46E5/FFFFFF?text=Image+Thumbnail`;
};

/**
 * Get image format icon
 */
export const getImageFormatIcon = (format: string): string => {
    switch (format.toLowerCase()) {
        case 'jpg':
        case 'jpeg':
            return '🖼️';
        case 'png':
            return '🖼️';
        case 'gif':
            return '🎞️';
        case 'webp':
            return '🖼️';
        default:
            return '📷';
    }
};
