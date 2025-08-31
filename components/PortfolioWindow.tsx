'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import VideoPlayer from '@/components/media/VideoPlayer';
import ImageViewer from '@/components/media/ImageViewer';
import FontPreviewer from '@/components/media/FontPreviewer';
import { createMockVideoData } from '@/lib/media/utils';
import { createMockImageData } from '@/lib/media/imageUtils';
import { createMockFontData } from '@/lib/media/fontUtils';

interface PortfolioWindowProps {
    onClose: () => void;
    onFocus?: () => void;
    isAdmin?: boolean;
}

// Define the portfolio folder structure
const PORTFOLIO_FOLDERS = [
    { id: 'videos', name: 'Videos', icon: '🎬' },
    { id: 'photos', name: 'Photos', icon: '📸' },
    { id: 'logos', name: 'Logos', icon: '🎨' },
    { id: 'fonts', name: 'Fonts', icon: '🔤' },
    { id: 'brandbooks', name: 'Brandbooks', icon: '📚' },
    { id: 'clients', name: 'Our Clients', icon: '👥' },
];

const PortfolioWindow: React.FC<PortfolioWindowProps> = ({
    onClose,
    onFocus,
    isAdmin = false,
}) => {
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const { t } = useTranslation();

    // Mock data for videos, images, and fonts
    const mockVideos = createMockVideoData();
    const mockImages = createMockImageData();
    const mockFonts = createMockFontData();

    const handleFolderClick = (folderId: string) => {
        setCurrentFolder(folderId);
    };

    const handleBackClick = () => {
        setCurrentFolder(null);
    };

    const renderFolderContent = () => {
        if (!currentFolder) {
            return (
                <div className="grid grid-cols-2 gap-4 p-4">
                    {PORTFOLIO_FOLDERS.map((folder) => (
                        <button
                            key={folder.id}
                            onClick={() => handleFolderClick(folder.id)}
                            className="flex flex-col items-center p-4 border rounded hover:bg-gray-50 transition-colors text-black"
                        >
                            <span className="text-3xl mb-2">{folder.icon}</span>
                            <span className="text-sm font-medium text-black">
                                {folder.name}
                            </span>
                        </button>
                    ))}
                </div>
            );
        }

        // Handle different folder types
        const folder = PORTFOLIO_FOLDERS.find((f) => f.id === currentFolder);

        if (currentFolder === 'videos') {
            return (
                <VideoPlayer
                    videos={mockVideos}
                    onClose={onClose}
                    onFocus={onFocus}
                    isAdmin={isAdmin}
                />
            );
        }

        if (currentFolder === 'photos') {
            return (
                <ImageViewer
                    images={mockImages}
                    onClose={onClose}
                    onFocus={onFocus}
                    isAdmin={isAdmin}
                />
            );
        }

        if (currentFolder === 'fonts') {
            return (
                <FontPreviewer
                    fonts={mockFonts}
                    onClose={onClose}
                    onFocus={onFocus}
                    isAdmin={isAdmin}
                />
            );
        }

        // For other folders, show placeholder for now
        return (
            <div className="p-4">
                <div className="flex items-center mb-4">
                    <button
                        onClick={handleBackClick}
                        className="mr-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                    >
                        ← Back
                    </button>
                    <span className="text-lg font-medium text-black">
                        {folder?.name}
                    </span>
                </div>
                <div className="text-center text-gray-600 py-8">
                    <div className="text-4xl mb-2">{folder?.icon}</div>
                    <p className="text-black">
                        Content for {folder?.name} will be implemented next
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div
            className="bg-white border rounded shadow-lg min-w-[400px] min-h-[300px]"
            onClick={onFocus}
        >
            <div className="flex justify-between items-center p-3 border-b bg-gray-100">
                <div className="flex items-center">
                    <span className="text-lg mr-2">📁</span>
                    <span className="font-bold text-sm text-black">
                        {currentFolder
                            ? `${t('desktop.portfolio')} - ${
                                  PORTFOLIO_FOLDERS.find(
                                      (f) => f.id === currentFolder
                                  )?.name
                              }`
                            : t('desktop.portfolio')}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="text-xs text-red-500 hover:underline px-2 py-1"
                    aria-label="Close window"
                >
                    ×
                </button>
            </div>
            <div className="flex-1">{renderFolderContent()}</div>
        </div>
    );
};

export default PortfolioWindow;
