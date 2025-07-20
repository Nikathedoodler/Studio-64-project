'use client';

import DesktopIcon from '@/components/DesktopIcon';
import Window from '@/components/Window';
import { useState } from 'react';

const ICONS = [
    { label: 'Portfolio', icon: '📁' },
    { label: 'My Files', icon: '🗂️' },
    { label: 'Merch', icon: '🛒' },
    { label: 'Recycle Bin', icon: '🗑️' },
];

export default function Desktop() {
    const [openWindows, setOpenWindows] = useState<string[]>([]);

    const handleIconClick = (label: string) => {
        setOpenWindows((prev) => [...prev, label]);
    };
    return (
        <main className="min-h-screen w-full bg-gradient-to-br from-blue-200 to-blue-500 flex flex-col">
            {/* Toolbar here */}
            <div className="flex-1 relative">
                <div className="absolute left-8 top-8 flex flex-col gap-4">
                    {ICONS.map((icon) => (
                        <DesktopIcon
                            key={icon.label}
                            icon={icon.icon}
                            label={icon.label}
                            onClick={() => handleIconClick(icon.label)}
                        />
                    ))}
                </div>
                {/* Render open windows here */}
                {openWindows.map((label, idx) => (
                    <Window
                        key={idx}
                        title={label}
                        onClose={() =>
                            setOpenWindows((prev) =>
                                prev.filter((_, i) => i !== idx)
                            )
                        }
                    >
                        <div className="text-black">
                            {/* Placeholder content for each window */}
                            This is the {label} window.
                        </div>
                    </Window>
                ))}
            </div>
        </main>
    );
}
