'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import {
    Settings,
    Image,
    Palette,
    Plus,
    Trash2,
    Save,
    Upload,
    Loader2,
} from 'lucide-react';
import { storageUtils, BackgroundImage } from '@/lib/supabase/storage';

interface DesktopIcon {
    id: string;
    label: string;
    icon: string;
    enabled: boolean;
}

interface AdminWindowProps {
    onClose: () => void;
    onFocus?: () => void;
    onIconUpdate?: (icons: DesktopIcon[]) => void;
    onBackgroundUpdate?: (type: 'image', value: string) => void;
    onClearBackground?: () => void;
    currentIcons?: DesktopIcon[];
    currentBackgroundValue?: string;
}

const AdminWindow: React.FC<AdminWindowProps> = ({
    onClose,
    onFocus,
    onIconUpdate,
    onBackgroundUpdate,
    onClearBackground,
    currentIcons = [],
    currentBackgroundValue = '',
}) => {
    const [activeTab, setActiveTab] = useState<
        'icons' | 'background' | 'settings'
    >('icons');
    const [icons, setIcons] = useState<DesktopIcon[]>(currentIcons);
    const [backgroundValue, setBackgroundValue] = useState(
        currentBackgroundValue
    );
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [backgroundImages, setBackgroundImages] = useState<BackgroundImage[]>(
        []
    );
    const [newIconLabel, setNewIconLabel] = useState('');
    const [newIconSymbol, setNewIconSymbol] = useState('');
    const { t } = useTranslation();

    // Default icons if none provided
    const defaultIcons: DesktopIcon[] = [
        { id: '1', label: t('desktop.portfolio'), icon: '📁', enabled: true },
        { id: '2', label: t('desktop.myFiles'), icon: '🗂️', enabled: true },
        { id: '3', label: t('desktop.merch'), icon: '🛒', enabled: true },
        { id: '4', label: t('desktop.recycleBin'), icon: '🗑️', enabled: true },
    ];

    const [desktopIcons, setDesktopIcons] = useState<DesktopIcon[]>(
        currentIcons.length > 0 ? currentIcons : defaultIcons
    );

    const handleIconToggle = (iconId: string) => {
        const updatedIcons = desktopIcons.map((icon) =>
            icon.id === iconId ? { ...icon, enabled: !icon.enabled } : icon
        );
        setDesktopIcons(updatedIcons);
        onIconUpdate?.(updatedIcons);
    };

    const handleAddIcon = () => {
        if (newIconLabel.trim() && newIconSymbol.trim()) {
            const newIcon: DesktopIcon = {
                id: Date.now().toString(),
                label: newIconLabel.trim(),
                icon: newIconSymbol.trim(),
                enabled: true,
            };
            const updatedIcons = [...desktopIcons, newIcon];
            setDesktopIcons(updatedIcons);
            onIconUpdate?.(updatedIcons);
            setNewIconLabel('');
            setNewIconSymbol('');
        }
    };

    const handleRemoveIcon = (iconId: string) => {
        const updatedIcons = desktopIcons.filter((icon) => icon.id !== iconId);
        setDesktopIcons(updatedIcons);
        onIconUpdate?.(updatedIcons);
    };

    const handleBackgroundChange = () => {
        onBackgroundUpdate?.('image', backgroundValue);
    };

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);
            setUploadProgress(0);

            try {
                // Upload to Supabase Storage
                const uploadedImage = await storageUtils.uploadBackgroundImage(
                    file
                );

                if (uploadedImage) {
                    setBackgroundValue(uploadedImage.url);
                    setBackgroundImages((prev) => [...prev, uploadedImage]);
                    console.log('Image uploaded successfully:', uploadedImage);
                } else {
                    console.error('Failed to upload image');
                    alert('Failed to upload image. Please try again.');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Error uploading image. Please try again.');
            } finally {
                setIsUploading(false);
                setUploadProgress(0);
            }
        }
    };

    const renderIconsTab = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Desktop Icons</h3>
                <span className="text-sm text-gray-500">
                    {desktopIcons.filter((icon) => icon.enabled).length} active
                </span>
            </div>

            {/* Add New Icon */}
            <div className="border rounded p-4 bg-gray-50">
                <h4 className="font-medium mb-3">Add New Icon</h4>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Icon label"
                        value={newIconLabel}
                        onChange={(e) => setNewIconLabel(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded text-sm"
                    />
                    <input
                        type="text"
                        placeholder="Icon symbol (emoji)"
                        value={newIconSymbol}
                        onChange={(e) => setNewIconSymbol(e.target.value)}
                        className="w-24 px-3 py-2 border rounded text-sm"
                    />
                    <button
                        onClick={handleAddIcon}
                        disabled={!newIconLabel.trim() || !newIconSymbol.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* Icon List */}
            <div className="space-y-2">
                {desktopIcons.map((icon) => (
                    <div
                        key={icon.id}
                        className="flex items-center justify-between p-3 border rounded"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{icon.icon}</span>
                            <span className="font-medium">{icon.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={icon.enabled}
                                    onChange={() => handleIconToggle(icon.id)}
                                    className="rounded"
                                />
                                Active
                            </label>
                            <button
                                onClick={() => handleRemoveIcon(icon.id)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                                title="Remove icon"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderBackgroundTab = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Desktop Background</h3>

            <div className="space-y-3">
                <label className="block text-sm font-medium">
                    Upload Background Image
                </label>
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="w-full p-2 border rounded text-sm disabled:opacity-50"
                    />
                    {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded">
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin" size={16} />
                                <span className="text-sm">Uploading...</span>
                            </div>
                        </div>
                    )}
                </div>
                {currentBackgroundValue && !backgroundValue && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Current Background
                        </label>
                        <img
                            src={currentBackgroundValue}
                            alt="Current background"
                            className="w-full h-32 object-cover rounded border"
                        />
                        <button
                            onClick={onClearBackground}
                            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                            Remove Background
                        </button>
                    </div>
                )}
                {backgroundValue && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Current Image
                        </label>
                        <img
                            src={backgroundValue}
                            alt="Background preview"
                            className="w-full h-32 object-cover rounded border"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleBackgroundChange}
                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                            >
                                Apply Image
                            </button>
                            <button
                                onClick={onClearBackground}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                )}

                {/* Uploaded Background Images */}
                {backgroundImages.length > 0 && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Uploaded Images
                        </label>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                            {backgroundImages.map((image) => (
                                <div key={image.id} className="relative group">
                                    <img
                                        src={image.url}
                                        alt={image.filename}
                                        className="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                                        onClick={() =>
                                            setBackgroundValue(image.url)
                                        }
                                    />
                                    <button
                                        onClick={async () => {
                                            if (
                                                await storageUtils.deleteBackgroundImage(
                                                    image.id
                                                )
                                            ) {
                                                setBackgroundImages((prev) =>
                                                    prev.filter(
                                                        (img) =>
                                                            img.id !== image.id
                                                    )
                                                );
                                                if (
                                                    backgroundValue ===
                                                    image.url
                                                ) {
                                                    setBackgroundValue('');
                                                }
                                            }
                                        }}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete image"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderSettingsTab = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">General Settings</h3>

            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                        <h4 className="font-medium">Window Focus Highlight</h4>
                        <p className="text-sm text-gray-600">
                            Highlight focused windows with blue border
                        </p>
                    </div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            defaultChecked
                            className="rounded"
                        />
                    </label>
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                        <h4 className="font-medium">Single Instance Windows</h4>
                        <p className="text-sm text-gray-600">
                            Prevent multiple windows of the same type
                        </p>
                    </div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            defaultChecked
                            className="rounded"
                        />
                    </label>
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                        <h4 className="font-medium">Auto-save Settings</h4>
                        <p className="text-sm text-gray-600">
                            Automatically save changes
                        </p>
                    </div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            defaultChecked
                            className="rounded"
                        />
                    </label>
                </div>
            </div>

            <div className="pt-4 border-t">
                <button className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm flex items-center justify-center gap-2">
                    <Save size={16} />
                    Save All Settings
                </button>
            </div>
        </div>
    );

    return (
        <div
            className="bg-white border rounded shadow-lg min-w-[600px] min-h-[500px] text-black"
            onClick={onFocus}
        >
            <div className="flex justify-between items-center p-3 border-b bg-gray-100">
                <div className="flex items-center">
                    <span className="text-lg mr-2">⚙️</span>
                    <span className="font-bold text-sm">Admin Panel</span>
                </div>
                <button
                    onClick={onClose}
                    className="text-xs text-red-500 hover:underline px-2 py-1"
                    aria-label="Close window"
                >
                    ×
                </button>
            </div>

            <div className="flex">
                {/* Sidebar Navigation */}
                <div className="w-48 border-r bg-gray-50">
                    <nav className="p-4 space-y-2">
                        <button
                            onClick={() => setActiveTab('icons')}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                                activeTab === 'icons'
                                    ? 'bg-blue-500 text-white'
                                    : 'hover:bg-gray-200'
                            }`}
                        >
                            <Settings size={16} />
                            Desktop Icons
                        </button>
                        <button
                            onClick={() => setActiveTab('background')}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                                activeTab === 'background'
                                    ? 'bg-blue-500 text-white'
                                    : 'hover:bg-gray-200'
                            }`}
                        >
                            <Image size={16} />
                            Background
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                                activeTab === 'settings'
                                    ? 'bg-blue-500 text-white'
                                    : 'hover:bg-gray-200'
                            }`}
                        >
                            <Palette size={16} />
                            Settings
                        </button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    {activeTab === 'icons' && renderIconsTab()}
                    {activeTab === 'background' && renderBackgroundTab()}
                    {activeTab === 'settings' && renderSettingsTab()}
                </div>
            </div>
        </div>
    );
};

export default AdminWindow;
