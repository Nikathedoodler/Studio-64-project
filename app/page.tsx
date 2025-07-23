'use client';

import DesktopIcon from '@/components/DesktopIcon';
import Window from '@/components/Window';
import { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import DraggableWindow from '@/components/DraggableWindow';

const ICONS = [
    { label: 'Portfolio', icon: '📁' },
    { label: 'My Files', icon: '🗂️' },
    { label: 'Merch', icon: '🛒' },
    { label: 'Recycle Bin', icon: '🗑️' },
];

export default function Desktop() {
    const [openWindows, setOpenWindows] = useState<
        { label: string; id: string; position: { x: number; y: number } }[]
    >([]);

    const handleIconClick = (label: string) => {
        setOpenWindows((prev) => [
            ...prev,
            {
                label,
                id: label + prev.length,
                position: {
                    x: 100 + prev.length * 40,
                    y: 100 + prev.length * 40,
                },
            },
        ]);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        if (
            !delta ||
            typeof delta.x !== 'number' ||
            typeof delta.y !== 'number'
        )
            return;
        setOpenWindows((prev) =>
            prev.map((win) =>
                win.id === active.id
                    ? {
                          ...win,
                          position: {
                              x: win.position.x + delta.x,
                              y: win.position.y + delta.y,
                          },
                      }
                    : win
            )
        );
    };

    return (
        <main className="min-h-screen w-full bg-gradient-to-br from-blue-200 to-blue-500 flex flex-col">
            {/* Toolbar here */}
            <DndContext onDragEnd={handleDragEnd}>
                <div className="flex-1 relative">
                    {/* Desktop icons */}
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
                    {/* Render draggable windows */}
                    {openWindows.map((win, idx) => (
                        <DraggableWindow
                            key={win.id}
                            id={win.id}
                            style={{
                                left: win.position.x,
                                top: win.position.y,
                            }}
                        >
                            <Window
                                title={win.label}
                                onClose={() =>
                                    setOpenWindows((prev) =>
                                        prev.filter((w) => w.id !== win.id)
                                    )
                                }
                            >
                                <div>This is the {win.label} window.</div>
                            </Window>
                        </DraggableWindow>
                    ))}
                </div>
            </DndContext>
        </main>
    );
}
