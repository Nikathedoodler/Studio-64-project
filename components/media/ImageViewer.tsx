'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ImageFile } from '@/lib/media/types';
import { formatFileSize } from '@/lib/media/utils';
import { getImageFormatIcon } from '@/lib/media/imageUtils';
import {
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    RotateCw,
    Download,
    Upload,
    Trash2,
    Grid3X3,
    List,
    X,
    Maximize,
    Minimize,
} from 'lucide-react';

interface ImageViewerProps {
    images: ImageFile[];
    onClose: () => void;
    onFocus?: () => void;
    isAdmin?: boolean;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
    images,
    onClose,
    onFocus,
    isAdmin = false,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewMode, setViewMode] = useState<'gallery' | 'lightbox'>('gallery');
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [showGrid, setShowGrid] = useState(true);
    const [selectedImages, setSelectedImages] = useState<Set<string>>(
        new Set()
    );

    const imageRef = useRef<HTMLImageElement>(null);

    const currentImage = images[currentIndex];

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.target !== document.body) return;

            switch (e.code) {
                case 'ArrowLeft':
                    e.preventDefault();
                    handlePrevious();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    handleNext();
                    break;
                case 'Escape':
                    e.preventDefault();
                    if (viewMode === 'lightbox') {
                        setViewMode('gallery');
                    } else {
                        onClose();
                    }
                    break;
                case 'KeyF':
                    e.preventDefault();
                    setViewMode(
                        viewMode === 'lightbox' ? 'gallery' : 'lightbox'
                    );
                    break;
                case 'Equal':
                case 'NumpadAdd':
                    e.preventDefault();
                    handleZoomIn();
                    break;
                case 'Minus':
                case 'NumpadSubtract':
                    e.preventDefault();
                    handleZoomOut();
                    break;
                case 'KeyR':
                    e.preventDefault();
                    handleRotate();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [viewMode, currentIndex]);

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            resetImageTransform();
        }
    };

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
            resetImageTransform();
        }
    };

    const handleImageClick = (index: number) => {
        setCurrentIndex(index);
        setViewMode('lightbox');
        resetImageTransform();
    };

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.25, 0.25));
    };

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const resetImageTransform = () => {
        setZoom(1);
        setRotation(0);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && isAdmin) {
            // TODO: Implement file upload to Supabase
            console.log('Uploading image:', file.name);
        }
    };

    const handleDeleteImage = (imageId: string) => {
        if (isAdmin && confirm('Are you sure you want to delete this image?')) {
            // TODO: Implement delete from Supabase
            console.log('Deleting image:', imageId);
        }
    };

    const handleDownload = () => {
        if (currentImage) {
            const link = document.createElement('a');
            link.href = currentImage.fileUrl;
            link.download = currentImage.filename;
            link.click();
        }
    };

    const toggleImageSelection = (imageId: string) => {
        const newSelected = new Set(selectedImages);
        if (newSelected.has(imageId)) {
            newSelected.delete(imageId);
        } else {
            newSelected.add(imageId);
        }
        setSelectedImages(newSelected);
    };

    if (!images || images.length === 0) {
        return (
            <div className="bg-white border rounded shadow-lg min-w-[600px] min-h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📸</div>
                    <p>No images available</p>
                    {isAdmin && (
                        <div className="mt-4">
                            <label className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                                <Upload size={16} className="inline mr-2" />
                                Upload Images
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Lightbox view
    if (viewMode === 'lightbox') {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                <div className="relative max-w-full max-h-full">
                    {/* Close button */}
                    <button
                        onClick={() => setViewMode('gallery')}
                        className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                        <X size={24} />
                    </button>

                    {/* Image */}
                    <img
                        ref={imageRef}
                        src={currentImage.fileUrl}
                        alt={currentImage.title}
                        className="max-w-full max-h-full object-contain"
                        style={{
                            transform: `scale(${zoom}) rotate(${rotation}deg)`,
                            transition: 'transform 0.3s ease',
                        }}
                    />

                    {/* Controls overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentIndex === 0}
                                    className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 disabled:opacity-50"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <button
                                    onClick={handleZoomOut}
                                    className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
                                >
                                    <ZoomOut size={20} />
                                </button>

                                <span className="text-sm mx-2">
                                    {Math.round(zoom * 100)}%
                                </span>

                                <button
                                    onClick={handleZoomIn}
                                    className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
                                >
                                    <ZoomIn size={20} />
                                </button>

                                <button
                                    onClick={handleRotate}
                                    className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
                                >
                                    <RotateCw size={20} />
                                </button>

                                <button
                                    onClick={handleNext}
                                    disabled={
                                        currentIndex === images.length - 1
                                    }
                                    className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 disabled:opacity-50"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleDownload}
                                    className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
                                >
                                    <Download size={20} />
                                </button>

                                {isAdmin && (
                                    <button
                                        onClick={() =>
                                            handleDeleteImage(currentImage.id)
                                        }
                                        className="p-2 bg-red-600 bg-opacity-50 rounded-full hover:bg-opacity-70"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Image info */}
                        <div className="mt-2 text-center text-white text-sm">
                            <p className="font-medium">{currentImage.title}</p>
                            <p className="text-gray-300">
                                {currentIndex + 1} of {images.length} •{' '}
                                {currentImage.resolution.width}×
                                {currentImage.resolution.height} •{' '}
                                {formatFileSize(currentImage.fileSize)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Gallery view
    return (
        <div
            className="bg-white border rounded shadow-lg min-w-[600px] min-h-[400px]"
            onClick={onFocus}
        >
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b bg-gray-100">
                <div className="flex items-center">
                    <span className="text-lg mr-2">📸</span>
                    <span className="font-bold text-sm">
                        Photos ({images.length} images)
                    </span>
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
                        <label className="p-1 hover:bg-gray-200 rounded cursor-pointer">
                            <Upload size={16} />
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileUpload}
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

            {/* Main content */}
            <div className="flex-1 p-4">
                {showGrid ? (
                    // Grid view
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                            <div
                                key={image.id}
                                className={`relative group cursor-pointer border rounded overflow-hidden hover:shadow-lg transition-shadow ${
                                    selectedImages.has(image.id)
                                        ? 'ring-2 ring-blue-500'
                                        : ''
                                }`}
                                onClick={() => handleImageClick(index)}
                            >
                                <div className="aspect-square bg-gray-100">
                                    <img
                                        src={image.thumbnailUrl}
                                        alt={image.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-white bg-opacity-90 rounded-full p-2">
                                            <Maximize size={20} />
                                        </div>
                                    </div>
                                </div>

                                {/* Image info */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                                    <p className="text-white text-xs font-medium truncate">
                                        {image.title}
                                    </p>
                                    <p className="text-gray-300 text-xs">
                                        {image.resolution.width}×
                                        {image.resolution.height}
                                    </p>
                                </div>

                                {/* Selection checkbox */}
                                {isAdmin && (
                                    <div className="absolute top-2 left-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedImages.has(
                                                image.id
                                            )}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                toggleImageSelection(image.id);
                                            }}
                                            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </div>
                                )}

                                {/* Delete button */}
                                {isAdmin && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteImage(image.id);
                                        }}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    // List view
                    <div className="space-y-2">
                        {images.map((image, index) => (
                            <div
                                key={image.id}
                                className={`flex items-center gap-4 p-3 border rounded hover:bg-gray-50 cursor-pointer ${
                                    selectedImages.has(image.id)
                                        ? 'bg-blue-50 border-blue-200'
                                        : ''
                                }`}
                                onClick={() => handleImageClick(index)}
                            >
                                <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                    <img
                                        src={image.thumbnailUrl}
                                        alt={image.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">
                                            {getImageFormatIcon(image.format)}
                                        </span>
                                        <h3 className="font-medium text-sm truncate">
                                            {image.title}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">
                                        {image.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                                        <span>
                                            {image.resolution.width}×
                                            {image.resolution.height}
                                        </span>
                                        <span>
                                            {formatFileSize(image.fileSize)}
                                        </span>
                                        <span>
                                            {image.format.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {isAdmin && (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedImages.has(
                                                image.id
                                            )}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                toggleImageSelection(image.id);
                                            }}
                                            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteImage(image.id);
                                            }}
                                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bulk actions for selected images */}
            {isAdmin && selectedImages.size > 0 && (
                <div className="border-t p-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                            {selectedImages.size} image(s) selected
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    // TODO: Implement bulk download
                                    console.log(
                                        'Bulk download:',
                                        Array.from(selectedImages)
                                    );
                                }}
                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                            >
                                Download Selected
                            </button>
                            <button
                                onClick={() => {
                                    if (
                                        confirm(
                                            `Delete ${selectedImages.size} selected images?`
                                        )
                                    ) {
                                        // TODO: Implement bulk delete
                                        console.log(
                                            'Bulk delete:',
                                            Array.from(selectedImages)
                                        );
                                        setSelectedImages(new Set());
                                    }
                                }}
                                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                            >
                                Delete Selected
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageViewer;
