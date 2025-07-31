import React from 'react';
import BackgroundSwitcher from './BackgroundSwitcher';

interface ToolbarProps {
    onMenuClick?: () => void;
    onLanguageChange?: (language: string) => void;
    currentLanguage?: string;
    backgroundType?: 'gradient' | 'image';
    onBackgroundTypeChange?: (type: 'gradient' | 'image') => void;
    onBackgroundValueChange?: (value: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
    onMenuClick,
    onLanguageChange,
    currentLanguage = 'EN',
    backgroundType = 'gradient',
    onBackgroundTypeChange,
    onBackgroundValueChange,
}) => {
    return (
        <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center relative z-10">
            {/* Left side - Logo and Menu */}
            <div className="flex items-center space-x-4">
                <div className="text-xl font-bold">Studio 64</div>
                <button
                    onClick={onMenuClick}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded"
                >
                    Menu
                </button>
            </div>

            {/* Right side - Background Switcher and Language switcher */}
            <div className="flex items-center space-x-4">
                <BackgroundSwitcher
                    currentType={backgroundType}
                    currentValue=""
                    onTypeChange={onBackgroundTypeChange || (() => {})}
                    onValueChange={onBackgroundValueChange || (() => {})}
                    onClose={() => {}}
                />
                <select
                    value={currentLanguage}
                    onChange={(e) => onLanguageChange?.(e.target.value)}
                    className="bg-gray-700 text-white px-2 py-1 rounded"
                >
                    <option value="EN">English</option>
                    <option value="KA">ქართული</option>
                </select>
            </div>
        </div>
    );
};

export default Toolbar;
