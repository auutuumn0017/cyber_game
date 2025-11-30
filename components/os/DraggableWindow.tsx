import React, { useState, useEffect, useRef } from 'react';
import { WindowState } from '../../types';
import { RETRO_COLORS } from '../../constants';

interface Props {
  window: WindowState;
  isActive: boolean;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onMinimize: (id: string) => void;
  children: React.ReactNode;
}

export const DraggableWindow: React.FC<Props> = ({
  window,
  isActive,
  onFocus,
  onClose,
  onMove,
  onMinimize,
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFocus(window.id);
    if (windowRef.current) {
        // Calculate offset from the top-left corner of the window
        const rect = windowRef.current.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    }
    setIsDragging(true);
  };

  // Global mouse listeners for drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onMove(window.id, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, window.id, onMove]);

  if (window.isMinimized) return null;

  return (
    <div
      ref={windowRef}
      style={{
        transform: `translate(${window.x}px, ${window.y}px)`,
        width: window.width,
        height: window.height,
        zIndex: window.zIndex,
      }}
      className={`absolute flex flex-col ${RETRO_COLORS.winBg} border-2 ${RETRO_COLORS.winBorderLight} shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]`}
      onMouseDown={() => onFocus(window.id)}
    >
      {/* Title Bar */}
      <div
        className={`flex items-center justify-between px-1 py-0.5 select-none cursor-default ${isActive ? RETRO_COLORS.blueHeader : 'bg-gray-400'}`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
            {/* Icon placeholder */}
           <div className="w-4 h-4 bg-white border border-gray-500"></div>
           <span className="text-white font-bold text-sm tracking-wide font-[VT323] truncate">{window.title}</span>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(window.id); }}
            className="w-5 h-5 bg-[#c0c0c0] border-t-white border-l-white border-b-black border-r-black border text-black font-bold text-xs flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
          >
            _
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(window.id); }}
            className="w-5 h-5 bg-[#c0c0c0] border-t-white border-l-white border-b-black border-r-black border text-black font-bold text-xs flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
          >
            X
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-1 border-t border-l border-gray-400 border-b border-r border-white bg-[#c0c0c0]">
        {children}
      </div>
    </div>
  );
};