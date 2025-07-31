import React from 'react';
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from '@heroui/react';

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
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('file uploaded');
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            console.log(imageUrl, 'umageurl');
            onTypeChange('image');
            onValueChange(imageUrl);
        }
    };

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    className="bg-gray-700 px-3 py-1 rounded"
                    variant="bordered"
                >
                    Background
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Background Options">
                <DropdownItem key="upload">
                    <label className="cursor-pointer w-full">
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </label>
                </DropdownItem>
                <DropdownItem
                    key="reset"
                    onClick={() => {
                        onTypeChange('gradient');
                        onValueChange(
                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        );
                    }}
                >
                    Reset to Default
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

export default BackgroundSwitcher;
