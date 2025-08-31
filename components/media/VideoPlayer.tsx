'use client';

import React, { useState, useRef, useEffect } from 'react';
import { VideoFile, Playlist } from '@/lib/media/types';
import { formatDuration, formatFileSize } from '@/lib/media/utils';
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Maximize,
    Upload,
    Trash2,
    Loader2,
} from 'lucide-react';

interface VideoPlayerProps {
    videos: VideoFile[];
    onClose: () => void;
    onFocus?: () => void;
    isAdmin?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    videos,
    onClose,
    onFocus,
    isAdmin = false,
}) => {
    const [playlist, setPlaylist] = useState<Playlist>({
        id: 'main',
        name: 'Video Playlist',
        items: videos,
        currentIndex: 0,
    });

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const currentVideo = playlist.items[playlist.currentIndex];

    // Video event handlers
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
            setIsLoading(false);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            // Auto-play next video if available
            if (playlist.currentIndex < playlist.items.length - 1) {
                handleNext();
            }
        };

        const handleLoadStart = () => {
            setIsLoading(true);
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('loadstart', handleLoadStart);

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('loadstart', handleLoadStart);
        };
    }, [playlist.currentIndex, playlist.items.length]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.target !== document.body) return; // Only when video player is focused

            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    handlePlayPause();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    handleSeek(-10);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    handleSeek(10);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    handleVolumeChange(volume + 0.1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    handleVolumeChange(volume - 0.1);
                    break;
                case 'KeyF':
                    e.preventDefault();
                    handleFullscreen();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [volume]);

    const handlePlayPause = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (seconds: number) => {
        const video = videoRef.current;
        if (!video) return;

        const newTime = Math.max(
            0,
            Math.min(video.duration, video.currentTime + seconds)
        );
        video.currentTime = newTime;
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const video = videoRef.current;
        const progressBar = progressRef.current;
        if (!video || !progressBar) return;

        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * video.duration;

        video.currentTime = newTime;
    };

    const handleVolumeChange = (newVolume: number) => {
        const video = videoRef.current;
        if (!video) return;

        const clampedVolume = Math.max(0, Math.min(1, newVolume));
        video.volume = clampedVolume;
        setVolume(clampedVolume);
        setIsMuted(clampedVolume === 0);
    };

    const handleMuteToggle = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isMuted) {
            video.volume = volume;
            setIsMuted(false);
        } else {
            video.volume = 0;
            setIsMuted(true);
        }
    };

    const handleFullscreen = () => {
        const video = videoRef.current;
        if (!video) return;

        if (!isFullscreen) {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        setIsFullscreen(!isFullscreen);
    };

    const handlePrevious = () => {
        if (playlist.currentIndex > 0) {
            setPlaylist((prev) => ({
                ...prev,
                currentIndex: prev.currentIndex - 1,
            }));
            setIsPlaying(false);
        }
    };

    const handleNext = () => {
        if (playlist.currentIndex < playlist.items.length - 1) {
            setPlaylist((prev) => ({
                ...prev,
                currentIndex: prev.currentIndex + 1,
            }));
            setIsPlaying(false);
        }
    };

    const handleVideoSelect = (index: number) => {
        setPlaylist((prev) => ({
            ...prev,
            currentIndex: index,
        }));
        setIsPlaying(false);
        setShowPlaylist(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && isAdmin) {
            // TODO: Implement file upload to Supabase
            console.log('Uploading file:', file.name);
        }
    };

    const handleDeleteVideo = (videoId: string) => {
        if (isAdmin && confirm('Are you sure you want to delete this video?')) {
            // TODO: Implement delete from Supabase
            console.log('Deleting video:', videoId);
        }
    };

    if (!currentVideo) {
        return (
            <div className="bg-white border rounded shadow-lg min-w-[600px] min-h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">🎬</div>
                    <p>No videos available</p>
                    {isAdmin && (
                        <div className="mt-4">
                            <label className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                                <Upload size={16} className="inline mr-2" />
                                Upload Video
                                <input
                                    type="file"
                                    accept="video/*"
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

    return (
        <div
            className="bg-white border rounded shadow-lg min-w-[600px] min-h-[400px]"
            onClick={onFocus}
        >
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b bg-gray-100">
                <div className="flex items-center">
                    <span className="text-lg mr-2">🎬</span>
                    <span className="font-bold text-sm">
                        {currentVideo.title}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                        ({playlist.currentIndex + 1} of {playlist.items.length})
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {isAdmin && (
                        <button
                            onClick={() => handleDeleteVideo(currentVideo.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                            title="Delete video"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                    <button
                        onClick={() => setShowPlaylist(!showPlaylist)}
                        className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                    >
                        Playlist
                    </button>
                    <button
                        onClick={onClose}
                        className="text-xs text-red-500 hover:underline px-2 py-1"
                    >
                        ×
                    </button>
                </div>
            </div>

            <div className="flex">
                {/* Main Video Area */}
                <div className="flex-1">
                    {/* Video Element */}
                    <div className="relative bg-black">
                        <video
                            ref={videoRef}
                            src={currentVideo.fileUrl}
                            className="w-full h-64 object-contain"
                            poster={currentVideo.thumbnailUrl}
                            onClick={handlePlayPause}
                        />

                        {/* Loading Overlay */}
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <Loader2
                                    className="animate-spin text-white"
                                    size={32}
                                />
                            </div>
                        )}

                        {/* Video Controls Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                            {/* Progress Bar */}
                            <div
                                ref={progressRef}
                                className="w-full h-1 bg-gray-600 rounded cursor-pointer mb-2"
                                onClick={handleProgressClick}
                            >
                                <div
                                    className="h-full bg-blue-500 rounded"
                                    style={{
                                        width: `${
                                            (currentTime / duration) * 100
                                        }%`,
                                    }}
                                />
                            </div>

                            {/* Control Buttons */}
                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePrevious}
                                        disabled={playlist.currentIndex === 0}
                                        className="p-1 hover:bg-white hover:bg-opacity-20 rounded disabled:opacity-50"
                                    >
                                        <SkipBack size={20} />
                                    </button>

                                    <button
                                        onClick={handlePlayPause}
                                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded"
                                    >
                                        {isPlaying ? (
                                            <Pause size={24} />
                                        ) : (
                                            <Play size={24} />
                                        )}
                                    </button>

                                    <button
                                        onClick={handleNext}
                                        disabled={
                                            playlist.currentIndex ===
                                            playlist.items.length - 1
                                        }
                                        className="p-1 hover:bg-white hover:bg-opacity-20 rounded disabled:opacity-50"
                                    >
                                        <SkipForward size={20} />
                                    </button>

                                    <div className="flex items-center gap-1 ml-4">
                                        <button
                                            onClick={handleMuteToggle}
                                            className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                                        >
                                            {isMuted ? (
                                                <VolumeX size={16} />
                                            ) : (
                                                <Volume2 size={16} />
                                            )}
                                        </button>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={isMuted ? 0 : volume}
                                            onChange={(e) =>
                                                handleVolumeChange(
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            className="w-16"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm">
                                        {formatDuration(currentTime)} /{' '}
                                        {formatDuration(duration)}
                                    </span>
                                    <button
                                        onClick={handleFullscreen}
                                        className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                                    >
                                        <Maximize size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-4">
                        <h3 className="font-medium text-lg mb-2">
                            {currentVideo.title}
                        </h3>
                        {currentVideo.description && (
                            <p className="text-gray-600 text-sm mb-2">
                                {currentVideo.description}
                            </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>
                                Duration:{' '}
                                {formatDuration(currentVideo.duration)}
                            </span>
                            <span>
                                Size: {formatFileSize(currentVideo.fileSize)}
                            </span>
                            <span>
                                Resolution: {currentVideo.resolution.width}x
                                {currentVideo.resolution.height}
                            </span>
                            <span>
                                Format: {currentVideo.format.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Playlist Sidebar */}
                {showPlaylist && (
                    <div className="w-64 border-l bg-gray-50">
                        <div className="p-3 border-b">
                            <h4 className="font-medium text-sm">Playlist</h4>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {playlist.items.map((video, index) => (
                                <div
                                    key={video.id}
                                    onClick={() => handleVideoSelect(index)}
                                    className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
                                        index === playlist.currentIndex
                                            ? 'bg-blue-100 border-blue-200'
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={video.thumbnailUrl}
                                            alt={video.title}
                                            className="w-12 h-8 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {video.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatDuration(video.duration)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Admin Upload Area */}
            {isAdmin && (
                <div className="border-t p-3 bg-gray-50">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <Upload size={16} />
                        Upload New Video
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </label>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;
