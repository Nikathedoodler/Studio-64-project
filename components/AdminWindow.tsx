'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { Settings, Image, Palette, Plus, Trash2, Save } from 'lucide-react';

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

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setBackgroundValue(result);
                // Don't apply immediately - wait for user to click "Apply Image"
            };
            reader.readAsDataURL(file);
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
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full p-2 border rounded text-sm"
                />
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
