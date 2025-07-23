import { useDraggable } from '@dnd-kit/core';
import React from 'react';

interface DraggableWindowProps {
    id: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const DraggableWindow: React.FC<DraggableWindowProps> = ({
    id,
    children,
    style,
}) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });

    const windowStyle: React.CSSProperties = {
        ...style,
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        position: 'absolute',
        zIndex: 10,
    };

    return (
        <div
            ref={setNodeRef}
            style={windowStyle}
            {...listeners}
            {...attributes}
        >
            {children}
        </div>
    );
};

export default DraggableWindow;
