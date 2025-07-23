import { useDraggable } from '@dnd-kit/core';
import React, { ReactElement } from 'react';

interface DraggableWindowProps {
    id: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
    dragHandle: ReactElement;
}

const DraggableWindow: React.FC<DraggableWindowProps> = ({
    id,
    children,
    style,
    dragHandle,
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

    // Clone the dragHandle and inject listeners/attributes
    const handle = React.cloneElement(dragHandle, {
        ...listeners,
        ...attributes,
    });

    return (
        <div ref={setNodeRef} style={windowStyle}>
            {handle}
            {children}
        </div>
    );
};

export default DraggableWindow;
