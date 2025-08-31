// Media utility functions

import { MediaFile, VideoFile } from './types';

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format duration in MM:SS format
 */
export const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Generate thumbnail URL for video (placeholder for now)
 */
export const generateThumbnailUrl = (videoUrl: string): string => {
    // In a real implementation, this would generate thumbnails from video frames
    // For now, we'll use placeholder images
    return `https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Video+Thumbnail`;
};

/**
 * Check if file type is supported
 */
export const isSupportedVideoFormat = (filename: string): boolean => {
    const supportedFormats = ['.mp4', '.webm', '.mov', '.avi'];
    const extension = filename
        .toLowerCase()
        .substring(filename.lastIndexOf('.'));
    return supportedFormats.includes(extension);
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
    return filename.toLowerCase().substring(filename.lastIndexOf('.') + 1);
};

/**
 * Create mock video data for testing
 */
export const createMockVideoData = (): VideoFile[] => {
    return [
        {
            id: '1',
            filename: 'studio-intro.mp4',
            title: 'Studio 64 Introduction',
            description: 'Welcome video showcasing our creative studio',
            fileType: 'video',
            fileSize: 15728640, // 15MB
            duration: 120, // 2 minutes
            thumbnailUrl:
                'https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Studio+Intro',
            fileUrl:
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            folderId: 'videos',
            uploadedAt: new Date('2024-01-15'),
            uploadedBy: 'admin',
            format: 'mp4',
            resolution: { width: 1920, height: 1080 },
        },
        {
            id: '2',
            filename: 'portfolio-showcase.mp4',
            title: 'Portfolio Showcase',
            description: 'Highlights of our best creative work',
            fileType: 'video',
            fileSize: 25165824, // 25MB
            duration: 180, // 3 minutes
            thumbnailUrl:
                'https://via.placeholder.com/320x180/10B981/FFFFFF?text=Portfolio',
            fileUrl:
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            folderId: 'videos',
            uploadedAt: new Date('2024-01-20'),
            uploadedBy: 'admin',
            format: 'mp4',
            resolution: { width: 1920, height: 1080 },
        },
        {
            id: '3',
            filename: 'behind-scenes.mp4',
            title: 'Behind the Scenes',
            description: 'A look at our creative process',
            fileType: 'video',
            fileSize: 31457280, // 30MB
            duration: 240, // 4 minutes
            thumbnailUrl:
                'https://via.placeholder.com/320x180/F59E0B/FFFFFF?text=Behind+Scenes',
            fileUrl:
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            folderId: 'videos',
            uploadedAt: new Date('2024-01-25'),
            uploadedBy: 'admin',
            format: 'mp4',
            resolution: { width: 1280, height: 720 },
        },
        {
            id: '4',
            filename: 'client-testimonial.mp4',
            title: 'Client Testimonial',
            description: 'What our clients say about working with us',
            fileType: 'video',
            fileSize: 20971520, // 20MB
            duration: 90, // 1.5 minutes
            thumbnailUrl:
                'https://via.placeholder.com/320x180/EF4444/FFFFFF?text=Testimonial',
            fileUrl:
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            folderId: 'videos',
            uploadedAt: new Date('2024-02-01'),
            uploadedBy: 'admin',
            format: 'mp4',
            resolution: { width: 1920, height: 1080 },
        },
    ];
};
