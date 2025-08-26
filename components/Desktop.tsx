'use client';

import DesktopIcon from '@/components/DesktopIcon';
import Window from '@/components/Window';
import PortfolioWindow from '@/components/PortfolioWindow';
import MyFilesWindow from '@/components/MyFilesWindow';
import MerchWindow from '@/components/MerchWindow';
import RecycleBinWindow from '@/components/RecycleBinWindow';
import AdminWindow from '@/components/AdminWindow';
import Toolbar from '@/components/Toolbar';
import DesktopBackground from './DesktopBackground';
import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import DraggableWindow from '@/components/DraggableWindow';
import { useTranslation } from '@/lib/hooks/useTranslation';

export default function Desktop() {
    const [openWindows, setOpenWindows] = useState<
        { label: string; id: string; position: { x: number; y: number } }[]
    >([]);
    const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
    const [backgroundType, setBackgroundType] = useState<'gradient' | 'image'>(
        'gradient'
    );
    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState(true); // For demo purposes, set to true
    const [desktopIcons, setDesktopIcons] = useState([
        { id: '1', label: 'Portfolio', icon: '📁', enabled: true },
        { id: '2', label: 'My Files', icon: '🗂️', enabled: true },
        { id: '3', label: 'Merch', icon: '🛒', enabled: true },
        { id: '4', label: 'Recycle Bin', icon: '🗑️', enabled: true },
    ]);

    const { t, language, setLanguage } = useTranslation();

    // Load background from localStorage after component mounts (prevents hydration issues)
    useEffect(() => {
        const savedImage = localStorage.getItem('studio64-background-image');
        if (savedImage) {
            setBackgroundType('image');
            setBackgroundImageUrl(savedImage);
        }
    }, []);

    // Use dynamic desktop icons that can be managed by admin
    const ICONS = desktopIcons
        .filter((icon) => icon.enabled)
        .map((icon) => ({
            label: icon.label,
            icon: icon.icon,
            id: icon.id,
        }));

    const handleIconClick = (label: string) => {
        setOpenWindows((prev) => {
            // Check if a window of this type is already open
            const existingWindow = prev.find(
                (window) => window.label === label
            );

            if (existingWindow) {
                // If window exists, bring it to front by moving it to the end of the array
                // This ensures it renders on top of other windows
                setFocusedWindowId(existingWindow.id);
                return [
                    ...prev.filter((window) => window.label !== label),
                    existingWindow,
                ];
            }

            // If no window exists, create a new one
            const newWindow = {
                label,
                id: label + Date.now(), // Use timestamp for unique ID
                position: {
                    x: 100 + prev.length * 40,
                    y: 100 + prev.length * 40,
                },
            };
            setFocusedWindowId(newWindow.id);
            return [...prev, newWindow];
        });
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

    const handleLanguageChange = (language: string) => {
        setLanguage(language as 'EN' | 'KA');
        console.log('Language changed to:', language);
    };

    const handleBackgroundTypeChange = (type: 'gradient' | 'image') => {
        console.log('handleBackgroundTypeChange called with:', type);
        setBackgroundType(type);
    };

    const handleBackgroundValueChange = (value: string) => {
        console.log('handleBackgroundValueChange called with:', value);
        // If it's a blob URL (image upload), always update the image URL
        if (value.startsWith('blob:')) {
            console.log('Setting background image URL:', value);
            setBackgroundImageUrl(value);
        }
    };

    const handleWindowFocus = (windowId: string) => {
        setFocusedWindowId(windowId);
        // Bring window to front
        setOpenWindows((prev) => {
            const window = prev.find((w) => w.id === windowId);
            if (window) {
                return [...prev.filter((w) => w.id !== windowId), window];
            }
            return prev;
        });
    };

    // Admin handlers
    const handleIconUpdate = (newIcons: any[]) => {
        setDesktopIcons(newIcons);
    };

    const handleBackgroundUpdate = (type: 'image', value: string) => {
        setBackgroundType('image');
        setBackgroundImageUrl(value);
        // Save background image to localStorage for persistence
        if (typeof window !== 'undefined') {
            localStorage.setItem('studio64-background-image', value);
        }
    };

    const clearBackgroundImage = () => {
        setBackgroundType('gradient');
        setBackgroundImageUrl('');
        // Remove background image from localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('studio64-background-image');
        }
    };

    const handleMenuClick = () => {
        if (isAdmin) {
            // Open admin window
            setOpenWindows((prev) => {
                const existingAdmin = prev.find(
                    (window) => window.label === 'Admin Panel'
                );
                if (existingAdmin) {
                    setFocusedWindowId(existingAdmin.id);
                    return [
                        ...prev.filter((w) => w.label !== 'Admin Panel'),
                        existingAdmin,
                    ];
                }

                const newAdminWindow = {
                    label: 'Admin Panel',
                    id: 'admin-' + Date.now(),
                    position: {
                        x: 100 + prev.length * 40,
                        y: 100 + prev.length * 40,
                    },
                };
                setFocusedWindowId(newAdminWindow.id);
                return [...prev, newAdminWindow];
            });
        } else {
            console.log('Admin access required');
        }
    };

    return (
        <main className="min-h-screen w-full flex flex-col relative">
            <DesktopBackground
                type={backgroundType}
                imageUrl={backgroundImageUrl}
                className=""
            />
            <Toolbar
                onMenuClick={handleMenuClick}
                onLanguageChange={handleLanguageChange}
                currentLanguage={language}
                backgroundType={backgroundType}
                onBackgroundTypeChange={handleBackgroundTypeChange}
                onBackgroundValueChange={handleBackgroundValueChange}
                isAdmin={isAdmin}
            />
            <DndContext onDragEnd={handleDragEnd}>
                <div
                    className="flex-1 relative"
                    onClick={() => setFocusedWindowId(null)}
                >
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
                            dragHandle={
                                <div
                                    className={`flex justify-between text-black items-center mb-2 border-b pb-1 cursor-move select-none rounded-t px-2 py-1 transition-colors ${
                                        focusedWindowId === win.id
                                            ? 'bg-blue-100 border-blue-300'
                                            : 'bg-gray-100'
                                    }`}
                                    onClick={() => handleWindowFocus(win.id)}
                                >
                                    <span className="font-bold text-sm">
                                        {win.label}
                                    </span>
                                </div>
                            }
                        >
                            {win.label === t('desktop.portfolio') ? (
                                <PortfolioWindow
                                    onClose={() =>
                                        setOpenWindows((prev) =>
                                            prev.filter((w) => w.id !== win.id)
                                        )
                                    }
                                    onFocus={() => handleWindowFocus(win.id)}
                                />
                            ) : win.label === t('desktop.myFiles') ? (
                                <MyFilesWindow
                                    onClose={() =>
                                        setOpenWindows((prev) =>
                                            prev.filter((w) => w.id !== win.id)
                                        )
                                    }
                                    onFocus={() => handleWindowFocus(win.id)}
                                />
                            ) : win.label === t('desktop.merch') ? (
                                <MerchWindow
                                    onClose={() =>
                                        setOpenWindows((prev) =>
                                            prev.filter((w) => w.id !== win.id)
                                        )
                                    }
                                    onFocus={() => handleWindowFocus(win.id)}
                                />
                            ) : win.label === t('desktop.recycleBin') ? (
                                <RecycleBinWindow
                                    onClose={() =>
                                        setOpenWindows((prev) =>
                                            prev.filter((w) => w.id !== win.id)
                                        )
                                    }
                                    onFocus={() => handleWindowFocus(win.id)}
                                />
                            ) : win.label === 'Admin Panel' ? (
                                <AdminWindow
                                    onClose={() =>
                                        setOpenWindows((prev) =>
                                            prev.filter((w) => w.id !== win.id)
                                        )
                                    }
                                    onFocus={() => handleWindowFocus(win.id)}
                                    onIconUpdate={handleIconUpdate}
                                    onBackgroundUpdate={handleBackgroundUpdate}
                                    onClearBackground={clearBackgroundImage}
                                    currentIcons={desktopIcons}
                                    currentBackgroundValue={backgroundImageUrl}
                                />
                            ) : (
                                <Window
                                    title={win.label}
                                    onClose={() =>
                                        setOpenWindows((prev) =>
                                            prev.filter((w) => w.id !== win.id)
                                        )
                                    }
                                    renderHeader={(handleProps) => (
                                        <div
                                            className="flex justify-between items-center mb-2 border-b pb-1 cursor-move select-none bg-gray-100 rounded-t px-2 py-1"
                                            {...handleProps}
                                        >
                                            <span className="font-bold text-sm">
                                                {win.label}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    setOpenWindows((prev) =>
                                                        prev.filter(
                                                            (w) =>
                                                                w.id !== win.id
                                                        )
                                                    )
                                                }
                                                className="text-xs text-red-500 hover:underline px-2 py-1"
                                                aria-label="Close window"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                >
                                    <div>This is the {win.label} window.</div>
                                </Window>
                            )}
                        </DraggableWindow>
                    ))}
                </div>
            </DndContext>
        </main>
    );
}
