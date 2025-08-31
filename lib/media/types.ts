// Media file types and interfaces

export interface MediaFile {
    id: string;
    filename: string;
    title: string;
    description?: string;
    fileType: 'video' | 'image' | 'font';
    fileSize: number; // in bytes
    duration?: number; // for videos, in seconds
    thumbnailUrl?: string;
    fileUrl: string;
    folderId: string; // 'videos', 'photos', 'fonts', etc.
    uploadedAt: Date;
    uploadedBy?: string;
}

export interface VideoFile extends MediaFile {
    fileType: 'video';
    duration: number;
    thumbnailUrl: string;
    format: 'mp4' | 'webm' | 'mov';
    resolution: {
        width: number;
        height: number;
    };
}

export interface ImageFile extends MediaFile {
    fileType: 'image';
    thumbnailUrl: string;
    format: 'jpg' | 'png' | 'gif' | 'webp';
    resolution: {
        width: number;
        height: number;
    };
}

export interface FontFile extends MediaFile {
    fileType: 'font';
    format: 'ttf' | 'otf' | 'woff' | 'woff2';
    fontFamily: string;
    fontWeight?: string;
    fontStyle?: 'normal' | 'italic';
}

export interface Playlist {
    id: string;
    name: string;
    items: VideoFile[];
    currentIndex: number;
}

export interface MediaViewerProps {
    folderId: string;
    mediaItems: MediaFile[];
    onClose: () => void;
    onFocus?: () => void;
    isAdmin?: boolean;
}
