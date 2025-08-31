'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import ImageViewer from '@/components/media/ImageViewer';
import { createMockImageData } from '@/lib/media/imageUtils';

interface MyFilesWindowProps {
    onClose: () => void;
    onFocus?: () => void;
    isAdmin?: boolean;
}

// Define the My Files folder structure
const MY_FILES_FOLDERS = [
    { id: 'team', name: 'Team', icon: '👥' },
    { id: 'workProcess', name: 'Work Process', icon: '⚙️' },
    { id: 'myVideos', name: 'My Videos', icon: '🎥' },
    { id: 'equipment', name: 'Equipment', icon: '📷' },
];

const MyFilesWindow: React.FC<MyFilesWindowProps> = ({
    onClose,
    onFocus,
    isAdmin = false,
}) => {
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const { t } = useTranslation();

    // Mock data for images
    const mockImages = createMockImageData();

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
                    {MY_FILES_FOLDERS.map((folder) => (
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
        const folder = MY_FILES_FOLDERS.find((f) => f.id === currentFolder);

        if (currentFolder === 'equipment') {
            return (
                <ImageViewer
                    images={mockImages}
                    onClose={onClose}
                    onFocus={onFocus}
                    isAdmin={isAdmin}
                />
            );
        }

        if (currentFolder === 'team') {
            return (
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <button
                                onClick={handleBackClick}
                                className="mr-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                            >
                                ← Back
                            </button>
                            <span className="text-lg font-medium">
                                {folder?.name}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded p-4">
                            <div className="flex items-center mb-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-xl">👨‍💼</span>
                                </div>
                                <div>
                                    <h3 className="font-medium">John Doe</h3>
                                    <p className="text-sm text-gray-600">
                                        Lead Designer
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700">
                                Experienced designer with 8+ years in creative
                                direction and brand development.
                            </p>
                        </div>
                        <div className="border rounded p-4">
                            <div className="flex items-center mb-3">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-xl">👩‍💻</span>
                                </div>
                                <div>
                                    <h3 className="font-medium">Jane Smith</h3>
                                    <p className="text-sm text-gray-600">
                                        Video Editor
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700">
                                Professional video editor specializing in
                                commercial and documentary content.
                            </p>
                        </div>
                        <div className="border rounded p-4">
                            <div className="flex items-center mb-3">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-xl">👨‍🎨</span>
                                </div>
                                <div>
                                    <h3 className="font-medium">
                                        Mike Johnson
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Photographer
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700">
                                Award-winning photographer with expertise in
                                portrait and commercial photography.
                            </p>
                        </div>
                        <div className="border rounded p-4">
                            <div className="flex items-center mb-3">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-xl">👩‍🔧</span>
                                </div>
                                <div>
                                    <h3 className="font-medium">
                                        Sarah Wilson
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Technical Specialist
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700">
                                Technical expert handling equipment maintenance
                                and setup for all projects.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        if (currentFolder === 'workProcess') {
            return (
                <div className="p-4">
                    <div className="flex items-center mb-4">
                        <button
                            onClick={handleBackClick}
                            className="mr-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                        >
                            ← Back
                        </button>
                        <span className="text-lg font-medium">
                            {folder?.name}
                        </span>
                    </div>
                    <div className="space-y-4">
                        <div className="border rounded p-4">
                            <h3 className="font-medium mb-2">
                                1. Discovery & Planning
                            </h3>
                            <p className="text-sm text-gray-700">
                                Initial client consultation, project scope
                                definition, and timeline planning.
                            </p>
                        </div>
                        <div className="border rounded p-4">
                            <h3 className="font-medium mb-2">
                                2. Concept Development
                            </h3>
                            <p className="text-sm text-gray-700">
                                Creative brainstorming, concept creation, and
                                initial mockups.
                            </p>
                        </div>
                        <div className="border rounded p-4">
                            <h3 className="font-medium mb-2">3. Production</h3>
                            <p className="text-sm text-gray-700">
                                Active content creation, filming, editing, and
                                design implementation.
                            </p>
                        </div>
                        <div className="border rounded p-4">
                            <h3 className="font-medium mb-2">
                                4. Review & Revision
                            </h3>
                            <p className="text-sm text-gray-700">
                                Client feedback integration, revisions, and
                                final adjustments.
                            </p>
                        </div>
                        <div className="border rounded p-4">
                            <h3 className="font-medium mb-2">5. Delivery</h3>
                            <p className="text-sm text-gray-700">
                                Final file delivery, project documentation, and
                                client handoff.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        if (currentFolder === 'myVideos') {
            return (
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <button
                                onClick={handleBackClick}
                                className="mr-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                            >
                                ← Back
                            </button>
                            <span className="text-lg font-medium">
                                {folder?.name}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500">3 videos</span>
                    </div>
                    <div className="space-y-4">
                        <div className="border rounded p-4">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3">🎬</span>
                                <div>
                                    <h3 className="font-medium">
                                        Behind the Scenes - Project Alpha
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Duration: 5:23 | Size: 45MB
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700">
                                Behind the scenes footage from our latest
                                commercial shoot.
                            </p>
                        </div>
                        <div className="border rounded p-4">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3">🎥</span>
                                <div>
                                    <h3 className="font-medium">
                                        Equipment Setup Tutorial
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Duration: 12:45 | Size: 120MB
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700">
                                Step-by-step guide for setting up professional
                                lighting and camera equipment.
                            </p>
                        </div>
                        <div className="border rounded p-4">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3">📹</span>
                                <div>
                                    <h3 className="font-medium">
                                        Client Interview - Success Story
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Duration: 8:12 | Size: 78MB
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700">
                                Interview with satisfied client discussing
                                project outcomes and results.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        if (currentFolder === 'equipment') {
            return (
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <button
                                onClick={handleBackClick}
                                className="mr-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                            >
                                ← Back
                            </button>
                            <span className="text-lg font-medium">
                                {folder?.name}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500">8 items</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded p-4">
                            <div className="text-center">
                                <span className="text-3xl mb-2 block">📷</span>
                                <h3 className="font-medium">Canon EOS R5</h3>
                                <p className="text-sm text-gray-600">
                                    45MP Mirrorless Camera
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Status: Available
                                </p>
                            </div>
                        </div>
                        <div className="border rounded p-4">
                            <div className="text-center">
                                <span className="text-3xl mb-2 block">🎥</span>
                                <h3 className="font-medium">Sony FX3</h3>
                                <p className="text-sm text-gray-600">
                                    Cinema Camera
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Status: In Use
                                </p>
                            </div>
                        </div>
                        <div className="border rounded p-4">
                            <div className="text-center">
                                <span className="text-3xl mb-2 block">💡</span>
                                <h3 className="font-medium">
                                    Aputure 600D Pro
                                </h3>
                                <p className="text-sm text-gray-600">
                                    LED Light
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Status: Available
                                </p>
                            </div>
                        </div>
                        <div className="border rounded p-4">
                            <div className="text-center">
                                <span className="text-3xl mb-2 block">🎤</span>
                                <h3 className="font-medium">Shure SM7B</h3>
                                <p className="text-sm text-gray-600">
                                    Dynamic Microphone
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Status: Available
                                </p>
                            </div>
                        </div>
                        <div className="border rounded p-4">
                            <div className="text-center">
                                <span className="text-3xl mb-2 block">🖥️</span>
                                <h3 className="font-medium">MacBook Pro M2</h3>
                                <p className="text-sm text-gray-600">
                                    Editing Station
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Status: In Use
                                </p>
                            </div>
                        </div>
                        <div className="border rounded p-4">
                            <div className="text-center">
                                <span className="text-3xl mb-2 block">🎚️</span>
                                <h3 className="font-medium">DJI RS 3 Pro</h3>
                                <p className="text-sm text-gray-600">
                                    Gimbal Stabilizer
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Status: Available
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Fallback for unknown folders
        return (
            <div className="p-4">
                <div className="flex items-center mb-4">
                    <button
                        onClick={handleBackClick}
                        className="mr-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                    >
                        ← Back
                    </button>
                    <span className="text-lg font-medium">{folder?.name}</span>
                </div>
                <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">{folder?.icon}</div>
                    <p>Content for {folder?.name} will be implemented next</p>
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
                    <span className="text-lg mr-2">🗂️</span>
                    <span className="font-bold text-sm text-black">
                        {currentFolder
                            ? `${t('desktop.myFiles')} - ${
                                  MY_FILES_FOLDERS.find(
                                      (f) => f.id === currentFolder
                                  )?.name
                              }`
                            : t('desktop.myFiles')}
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

export default MyFilesWindow;
