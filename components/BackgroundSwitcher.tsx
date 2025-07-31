import React, { useRef } from 'react';
import { Button } from '@heroui/react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useAdmin } from '@/lib/hooks/useAdmin';

interface BackgroundSwitcherProps {
    currentType: 'gradient' | 'image';
    currentValue: string;
    onTypeChange: (type: 'gradient' | 'image') => void;
    onValueChange: (value: string) => void;
    onClose: () => void;
}

const BackgroundSwitcher: React.FC<BackgroundSwitcherProps> = ({
    currentType,
    currentValue,
    onTypeChange,
    onValueChange,
    onClose,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    const { isAdmin, isLoading } = useAdmin();

    // Only show if user is admin
    if (!isAdmin) return null;

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('handleImageUpload called');
        console.log('event:', event);
        console.log('files:', event.target.files);

        const file = event.target.files?.[0];
        if (file) {
            console.log('file found:', file);
            const imageUrl = URL.createObjectURL(file);
            console.log('imageUrl created:', imageUrl);
            onTypeChange('image');
            onValueChange(imageUrl);
        } else {
            console.log('no file found');
        }
    };

    const handleUploadClick = () => {
        console.log('upload button clicked');
        fileInputRef.current?.click();
    };

    const handleResetClick = () => {
        console.log('reset clicked');
        onTypeChange('gradient');
        onValueChange('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
    };

    return (
        <div className="flex space-x-2">
            <Button
                className="bg-gray-700 px-3 py-1 rounded"
                variant="bordered"
                onClick={handleUploadClick}
            >
                {t('toolbar.background')}
            </Button>
            <Button
                className="bg-gray-700 px-3 py-1 rounded"
                variant="bordered"
                onClick={handleResetClick}
            >
                {t('toolbar.reset')}
            </Button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />
        </div>
    );
};

export default BackgroundSwitcher;
