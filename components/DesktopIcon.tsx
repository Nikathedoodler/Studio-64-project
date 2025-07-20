import React from 'react';

type DesktopIconProps = {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
};

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, label, onClick }) => {
    return (
        <div
            className=""
            onClick={onClick}
            tabIndex={0}
            role="button"
            aria-label={label}
        >
            <div className="text-4xl mb-2">{icon}</div>
            <span className="text-xs text-center">{label}</span>
        </div>
    );
};

export default DesktopIcon;
