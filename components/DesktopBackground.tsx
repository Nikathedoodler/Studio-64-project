import React from 'react';

interface DesktopBackgroundProps {
    type?: 'gradient' | 'image';
    imageUrl?: string;
    className?: string;
}

const DesktopBackground: React.FC<DesktopBackgroundProps> = ({
    type = 'gradient',
    imageUrl,
    className = '',
}) => {
    const getBackgroundStyle = () => {
        switch (type) {
            case 'image':
                return {
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                };
            case 'gradient':
            default:
                return {
                    background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                };
        }
    };

    return (
        <div
            className={`absolute inset-0 z-0 ${className}`}
            style={getBackgroundStyle()}
        />
    );
};

export default DesktopBackground;
