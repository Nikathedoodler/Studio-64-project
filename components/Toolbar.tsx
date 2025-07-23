import React from 'react';

interface ToolbarProps {
    onMenuClick?: () => void;
    onLanguageChange?: (language: string) => void;
    currentLanguage?: string;
}

const Toolbar: React.FC<ToolbarProps> = ({
    onMenuClick,
    onLanguageChange,
    currentLanguage = 'EN',
}) => {
    return (
        <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
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

            {/* Right side - Language switcher */}
            <div className="flex items-center space-x-4">
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
