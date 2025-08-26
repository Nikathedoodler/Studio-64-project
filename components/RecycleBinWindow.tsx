'use client';

import React from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface RecycleBinWindowProps {
    onClose: () => void;
    onFocus?: () => void;
}

// Fun, non-clickable icons for the recycle bin
const RECYCLE_BIN_ICONS = [
    {
        id: '1',
        icon: '🗑️',
        name: 'Empty Trash',
        description: 'This is where deleted files go',
    },
    {
        id: '2',
        icon: '📄',
        name: 'Old Document',
        description: 'A very old document from 1995',
    },
    {
        id: '3',
        icon: '🖼️',
        name: 'Corrupted Image',
        description: 'This image got corrupted somehow',
    },
    {
        id: '4',
        icon: '🎵',
        name: 'Bad Song',
        description: 'A song that was just terrible',
    },
    {
        id: '5',
        icon: '📹',
        name: 'Failed Video',
        description: 'Video that failed to render',
    },
    {
        id: '6',
        icon: '📁',
        name: 'Empty Folder',
        description: 'A folder with nothing in it',
    },
    {
        id: '7',
        icon: '💾',
        name: 'Old Backup',
        description: 'Backup from Windows 95',
    },
    {
        id: '8',
        icon: '🎮',
        name: 'Broken Game',
        description: 'A game that never worked',
    },
    {
        id: '9',
        icon: '📧',
        name: 'Spam Email',
        description: 'Email from a Nigerian prince',
    },
    {
        id: '10',
        icon: '🔗',
        name: 'Dead Link',
        description: 'A link that leads nowhere',
    },
    {
        id: '11',
        icon: '📱',
        name: 'Old App',
        description: 'An app from the early 2000s',
    },
    {
        id: '12',
        icon: '🎨',
        name: 'Bad Art',
        description: 'Art that was just... bad',
    },
];

const RecycleBinWindow: React.FC<RecycleBinWindowProps> = ({
    onClose,
    onFocus,
}) => {
    const { t } = useTranslation();

    return (
        <div
            className="bg-white border rounded shadow-lg min-w-[400px] min-h-[300px]"
            onClick={onFocus}
        >
            <div className="flex justify-between items-center p-3 border-b bg-gray-100">
                <div className="flex items-center">
                    <span className="text-lg mr-2">🗑️</span>
                    <span className="font-bold text-sm">
                        {t('desktop.recycleBin')}
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

            <div className="p-4">
                <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Recycle Bin</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        This is where deleted files go. These items are just for
                        fun and cannot be clicked!
                    </p>
                </div>

                {/* Fun Icons Grid */}
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                    {RECYCLE_BIN_ICONS.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col items-center p-3 border rounded bg-gray-50 hover:bg-gray-100 transition-colors cursor-not-allowed"
                            title={`${item.name}: ${item.description}`}
                        >
                            <span className="text-3xl mb-2">{item.icon}</span>
                            <span className="text-xs text-center text-gray-600 font-medium">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Fun Message */}
                <div className="mt-6 text-center text-gray-500">
                    <p className="text-sm italic">
                        "One man's trash is another man's treasure... but not
                        these items. These are just trash."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RecycleBinWindow;
