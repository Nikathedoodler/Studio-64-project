import React from 'react';

interface WindowProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    renderHeader?: (
        handleProps: React.HTMLAttributes<HTMLDivElement>
    ) => React.ReactNode;
}

const Window: React.FC<WindowProps> = ({
    title,
    onClose,
    children,
    renderHeader,
}) => {
    if (renderHeader) {
        return (
            <div className="absolute bg-white text-black border rounded shadow-lg p-4 min-w-[250px] min-h-[120px]">
                {renderHeader({})}
                <div>{children}</div>
            </div>
        );
    }
    return (
        <div className="absolute bg-white border rounded shadow-lg p-4 min-w-[250px] min-h-[120px]">
            <div className="flex justify-between items-center mb-2 border-b pb-1">
                <span className="font-bold text-sm">{title}</span>
                <button
                    onClick={onClose}
                    className="text-xs text-red-500 hover:underline px-2 py-1"
                    aria-label="Close window"
                >
                    ×
                </button>
            </div>
            <div>{children}</div>
        </div>
    );
};

export default Window;
