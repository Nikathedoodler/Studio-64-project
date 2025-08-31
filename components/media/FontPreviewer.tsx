'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FontFile } from '@/lib/media/types';
import { formatFileSize } from '@/lib/media/utils';
import {
    getFontFormatIcon,
    getFontPreviewText,
    getFontWeightName,
    loadFont,
} from '@/lib/media/fontUtils';
import { fontStorageUtils } from '@/lib/supabase/fontUtils';
import {
    Upload,
    Trash2,
    Download,
    Type,
    Palette,
    RotateCw,
    Grid3X3,
    List,
    Eye,
    EyeOff,
} from 'lucide-react';

interface FontPreviewerProps {
    fonts: FontFile[];
    onClose: () => void;
    onFocus?: () => void;
    isAdmin?: boolean;
}

const FontPreviewer: React.FC<FontPreviewerProps> = ({
    fonts: initialFonts,
    onClose,
    onFocus,
    isAdmin = false,
}) => {
    const [fonts, setFonts] = useState<FontFile[]>(initialFonts || []);
    const [selectedFont, setSelectedFont] = useState<FontFile | null>(
        fonts[0] || null
    );
    const [previewText, setPreviewText] = useState(
        'The quick brown fox jumps over the lazy dog'
    );
    const [fontSize, setFontSize] = useState(24);
    const [textColor, setTextColor] = useState('#000000');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [showGrid, setShowGrid] = useState(true);
    const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
    const [loadingFonts, setLoadingFonts] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const previewRef = useRef<HTMLDivElement>(null);

    // Load fonts from Supabase on component mount
    useEffect(() => {
        const loadFonts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const supabaseFonts = await fontStorageUtils.getAllFonts();

                // If no fonts in Supabase, show mock data for testing
                if (supabaseFonts.length === 0) {
                    console.log(
                        'No fonts in Supabase, showing mock data for testing'
                    );
                    const mockFonts = [
                        {
                            id: 'mock-1',
                            filename: 'roboto.ttf',
                            title: 'Roboto',
                            description: 'Mock font for testing (Google Fonts)',
                            fileType: 'font' as const,
                            fileSize: 168832,
                            fileUrl:
                                'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2',
                            folderId: 'fonts',
                            uploadedAt: new Date(),
                            uploadedBy: 'mock-user',
                            format: 'ttf',
                            fontFamily: 'Roboto',
                            fontWeight: '400',
                            fontStyle: 'normal',
                        },
                        {
                            id: 'mock-2',
                            filename: 'open-sans.ttf',
                            title: 'Open Sans',
                            description: 'Mock font for testing (Google Fonts)',
                            fileType: 'font' as const,
                            fileSize: 156672,
                            fileUrl:
                                'https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVIGxA.woff2',
                            folderId: 'fonts',
                            uploadedAt: new Date(),
                            uploadedBy: 'mock-user',
                            format: 'ttf',
                            fontFamily: 'Open Sans',
                            fontWeight: '300',
                            fontStyle: 'normal',
                        },
                    ];
                    setFonts(mockFonts);
                    if (!selectedFont) {
                        setSelectedFont(mockFonts[0]);
                    }
                } else {
                    setFonts(supabaseFonts);
                    if (supabaseFonts.length > 0 && !selectedFont) {
                        setSelectedFont(supabaseFonts[0]);
                    }
                }
            } catch (err) {
                console.error('Error loading fonts:', err);
                setError('Failed to load fonts');
            } finally {
                setIsLoading(false);
            }
        };

        loadFonts();
    }, []);

    // Update selected font when fonts change
    useEffect(() => {
        if (fonts.length > 0 && !selectedFont) {
            setSelectedFont(fonts[0]);
        }
    }, [fonts, selectedFont]);

    // Load selected font when it changes
    useEffect(() => {
        if (selectedFont && !loadedFonts.has(selectedFont.id)) {
            setLoadingFonts((prev) => new Set(prev).add(selectedFont.id));

            loadFont(selectedFont)
                .then(() => {
                    setLoadedFonts((prev) =>
                        new Set(prev).add(selectedFont.id)
                    );
                    setLoadingFonts((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(selectedFont.id);
                        return newSet;
                    });
                })
                .catch((error) => {
                    console.error('Failed to load font:', error);
                    setLoadingFonts((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(selectedFont.id);
                        return newSet;
                    });
                });
        }
    }, [selectedFont, loadedFonts]);

    // Set initial preview text when font changes
    useEffect(() => {
        if (selectedFont) {
            setPreviewText(getFontPreviewText(selectedFont));
        }
    }, [selectedFont]);

    const handleFontSelect = (font: FontFile) => {
        setSelectedFont(font);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !isAdmin) return;

        setUploading(true);
        setError(null);

        try {
            // Extract font family name from filename (remove extension and clean up)
            const fontFamily = file.name
                .replace(/\.[^/.]+$/, '') // Remove extension
                .replace(/[-_]/g, ' ') // Replace dashes/underscores with spaces
                .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize words

            const result = await fontStorageUtils.uploadFont(file, {
                title: fontFamily,
                description: `Uploaded font: ${file.name}`,
                fontFamily: fontFamily,
                fontWeight: '400',
                fontStyle: 'normal',
            });

            if (result.success && result.font) {
                // Add the new font to the list
                setFonts((prev) => [result.font!, ...prev]);
                setSelectedFont(result.font);
                // Clear the file input
                e.target.value = '';
            } else {
                setError(result.error || 'Upload failed');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteFont = async (fontId: string) => {
        if (
            !isAdmin ||
            !confirm('Are you sure you want to delete this font?')
        ) {
            return;
        }

        try {
            const result = await fontStorageUtils.deleteFont(fontId);

            if (result.success) {
                // Remove the font from the list
                setFonts((prev) => prev.filter((font) => font.id !== fontId));

                // If the deleted font was selected, select the first available font
                if (selectedFont?.id === fontId) {
                    const remainingFonts = fonts.filter(
                        (font) => font.id !== fontId
                    );
                    setSelectedFont(remainingFonts[0] || null);
                }
            } else {
                setError(result.error || 'Delete failed');
            }
        } catch (err) {
            console.error('Delete error:', err);
            setError('Delete failed. Please try again.');
        }
    };

    const handleDownload = (font: FontFile) => {
        const link = document.createElement('a');
        link.href = font.fileUrl;
        link.download = font.filename;
        link.click();
    };

    const resetPreview = () => {
        setPreviewText('The quick brown fox jumps over the lazy dog');
        setFontSize(24);
        setTextColor('#000000');
        setBackgroundColor('#ffffff');
    };

    if (isLoading) {
        return (
            <div className="bg-white border rounded shadow-lg min-w-[600px] min-h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">🔤</div>
                    <p>Loading fonts...</p>
                </div>
            </div>
        );
    }

    if (!fonts || fonts.length === 0) {
        return (
            <div className="bg-white border rounded shadow-lg min-w-[600px] min-h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">🔤</div>
                    <p>No fonts available</p>
                    {error && (
                        <div className="mt-2 text-red-500 text-sm">{error}</div>
                    )}
                    {isAdmin && (
                        <div className="mt-4">
                            <label
                                className={`px-4 py-2 text-white rounded cursor-pointer ${
                                    uploading
                                        ? 'bg-gray-400'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                            >
                                <Upload size={16} className="inline mr-2" />
                                {uploading ? 'Uploading...' : 'Upload Fonts'}
                                <input
                                    type="file"
                                    accept=".ttf,.otf,.woff,.woff2"
                                    multiple
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className="bg-white border rounded shadow-lg min-w-[600px] min-h-[400px]"
            onClick={onFocus}
        >
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b bg-gray-100">
                <div className="flex items-center">
                    <span className="text-lg mr-2">🔤</span>
                    <span className="font-bold text-sm text-black">
                        Fonts ({fonts.length} fonts)
                    </span>
                    {error && (
                        <div className="ml-4 text-red-500 text-xs">{error}</div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowGrid(!showGrid)}
                        className="p-1 hover:bg-gray-200 rounded"
                        title={showGrid ? 'List view' : 'Grid view'}
                    >
                        {showGrid ? <List size={16} /> : <Grid3X3 size={16} />}
                    </button>
                    {isAdmin && (
                        <label
                            className={`p-1 rounded cursor-pointer ${
                                uploading ? 'bg-gray-300' : 'hover:bg-gray-200'
                            }`}
                        >
                            {uploading ? (
                                <RotateCw size={16} className="animate-spin" />
                            ) : (
                                <Upload size={16} />
                            )}
                            <input
                                type="file"
                                accept=".ttf,.otf,.woff,.woff2"
                                multiple
                                onChange={handleFileUpload}
                                disabled={uploading}
                                className="hidden"
                            />
                        </label>
                    )}
                    <button
                        onClick={onClose}
                        className="text-xs text-red-500 hover:underline px-2 py-1"
                    >
                        ×
                    </button>
                </div>
            </div>

            <div className="flex h-96">
                {/* Font List */}
                <div
                    className={`${
                        showGrid ? 'w-64' : 'w-80'
                    } border-r bg-gray-50 overflow-y-auto`}
                >
                    <div className="p-3 border-b">
                        <h4 className="font-medium text-sm text-black">
                            Font Library
                        </h4>
                    </div>

                    {showGrid ? (
                        // Grid view
                        <div className="p-3 space-y-2">
                            {fonts.map((font) => (
                                <div
                                    key={font.id}
                                    onClick={() => handleFontSelect(font)}
                                    className={`p-3 border rounded cursor-pointer hover:bg-gray-100 transition-colors ${
                                        selectedFont?.id === font.id
                                            ? 'bg-blue-100 border-blue-300'
                                            : 'bg-white'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">
                                                {getFontFormatIcon(font.format)}
                                            </span>
                                            <span className="font-medium text-sm text-black truncate">
                                                {font.title}
                                            </span>
                                        </div>
                                        {isAdmin && (
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownload(font);
                                                    }}
                                                    className="p-1 text-gray-500 hover:text-blue-500"
                                                    title="Download"
                                                >
                                                    <Download size={12} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteFont(
                                                            font.id
                                                        );
                                                    }}
                                                    className="p-1 text-gray-500 hover:text-red-500"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <div>
                                            {getFontWeightName(
                                                font.fontWeight || '400'
                                            )}{' '}
                                            • {font.format.toUpperCase()}
                                        </div>
                                        <div>
                                            {formatFileSize(font.fileSize)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // List view
                        <div className="space-y-1">
                            {fonts.map((font) => (
                                <div
                                    key={font.id}
                                    onClick={() => handleFontSelect(font)}
                                    className={`p-3 border-b cursor-pointer hover:bg-gray-100 transition-colors ${
                                        selectedFont?.id === font.id
                                            ? 'bg-blue-100 border-blue-300'
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">
                                                {getFontFormatIcon(font.format)}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium text-sm text-black truncate">
                                                        {font.title}
                                                    </h3>
                                                    {loadingFonts.has(
                                                        font.id
                                                    ) && (
                                                        <RotateCw
                                                            size={12}
                                                            className="animate-spin text-blue-500"
                                                        />
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {font.description}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                                    <span>
                                                        {getFontWeightName(
                                                            font.fontWeight ||
                                                                '400'
                                                        )}
                                                    </span>
                                                    <span>
                                                        {font.format.toUpperCase()}
                                                    </span>
                                                    <span>
                                                        {formatFileSize(
                                                            font.fileSize
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {isAdmin && (
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownload(font);
                                                    }}
                                                    className="p-1 text-gray-500 hover:text-blue-500"
                                                    title="Download"
                                                >
                                                    <Download size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteFont(
                                                            font.id
                                                        );
                                                    }}
                                                    className="p-1 text-gray-500 hover:text-red-500"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Font Preview Area */}
                <div className="flex-1 flex flex-col">
                    {selectedFont ? (
                        <>
                            {/* Controls */}
                            <div className="p-4 border-b bg-gray-50">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Text Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-2">
                                            Preview Text
                                        </label>
                                        <textarea
                                            value={previewText}
                                            onChange={(e) =>
                                                setPreviewText(e.target.value)
                                            }
                                            className="w-full p-2 border rounded text-sm resize-none"
                                            rows={2}
                                            placeholder="Enter text to preview..."
                                        />
                                    </div>

                                    {/* Font Size */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-2">
                                            Font Size: {fontSize}px
                                        </label>
                                        <input
                                            type="range"
                                            min="12"
                                            max="72"
                                            value={fontSize}
                                            onChange={(e) =>
                                                setFontSize(
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Text Color */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-2">
                                            Text Color
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={textColor}
                                                onChange={(e) =>
                                                    setTextColor(e.target.value)
                                                }
                                                className="w-8 h-8 border rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={textColor}
                                                onChange={(e) =>
                                                    setTextColor(e.target.value)
                                                }
                                                className="flex-1 p-1 border rounded text-xs"
                                                placeholder="#000000"
                                            />
                                        </div>
                                    </div>

                                    {/* Background Color */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-2">
                                            Background Color
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={backgroundColor}
                                                onChange={(e) =>
                                                    setBackgroundColor(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-8 h-8 border rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={backgroundColor}
                                                onChange={(e) =>
                                                    setBackgroundColor(
                                                        e.target.value
                                                    )
                                                }
                                                className="flex-1 p-1 border rounded text-xs"
                                                placeholder="#ffffff"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <button
                                        onClick={resetPreview}
                                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm flex items-center gap-1"
                                    >
                                        <RotateCw size={14} />
                                        Reset
                                    </button>

                                    <div className="text-sm text-gray-600">
                                        {selectedFont.title} •{' '}
                                        {getFontWeightName(
                                            selectedFont.fontWeight || '400'
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="flex-1 p-6 flex items-center justify-center">
                                <div
                                    ref={previewRef}
                                    className="max-w-full text-center"
                                    style={{
                                        fontFamily: selectedFont.fontFamily,
                                        fontSize: `${fontSize}px`,
                                        color: textColor,
                                        backgroundColor: backgroundColor,
                                        fontWeight: selectedFont.fontWeight,
                                        fontStyle: selectedFont.fontStyle,
                                        padding: '20px',
                                        borderRadius: '8px',
                                        minHeight: '120px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        wordBreak: 'break-word',
                                        lineHeight: '1.4',
                                    }}
                                >
                                    {previewText || 'Enter text to preview...'}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <Type size={48} className="mx-auto mb-4" />
                                <p>Select a font to preview</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FontPreviewer;
