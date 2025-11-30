import React, { useState, useEffect } from 'react';
import { WindowState } from '../../types';
import { RETRO_COLORS } from '../../constants';

interface Props {
  windows: WindowState[];
  activeWindowId: string | null;
  onWindowClick: (id: string) => void;
  onStartClick: () => void;
  time: number;
}

export const Taskbar: React.FC<Props> = ({ windows, activeWindowId, onWindowClick, onStartClick, time }) => {
  const [clockStr, setClockStr] = useState('');

  // Format time (seconds) to MM:SS
  const formatGameTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Real clock for realism
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClockStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-10 bg-[#c0c0c0] border-t-2 border-white flex items-center px-1 z-[9999] select-none shadow-md">
      {/* Start Button */}
      <button 
        onClick={onStartClick}
        className="flex items-center gap-1 px-2 py-1 mr-2 font-bold italic bg-[#c0c0c0] border-t-white border-l-white border-b-black border-r-black border-2 active:border-t-black active:border-l-black active:border-b-white active:border-r-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="w-4 h-4 bg-gradient-to-br from-red-500 via-green-500 to-blue-500 transform skew-x-[-10deg]"></div>
        <span className="text-black">开始</span>
      </button>

      <div className="w-px h-6 bg-gray-500 mx-1"></div>
      <div className="w-px h-6 bg-white mx-1"></div>

      {/* Window List */}
      <div className="flex-1 flex gap-1 overflow-x-auto px-1 hide-scrollbar">
        {windows.map(win => (
          <button
            key={win.id}
            onClick={() => onWindowClick(win.id)}
            className={`
              flex items-center gap-2 px-3 py-1 min-w-[120px] max-w-[160px] truncate
              border-2 text-sm
              ${activeWindowId === win.id 
                ? 'bg-gray-200 border-t-black border-l-black border-b-white border-r-white font-bold' 
                : 'bg-[#c0c0c0] border-t-white border-l-white border-b-black border-r-black'}
            `}
          >
            <div className="w-3 h-3 bg-gray-500 flex-shrink-0"></div>
            <span className="truncate">{win.title}</span>
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="ml-auto flex items-center gap-2 pl-2 border-l border-gray-500 border-r border-white bg-[#c0c0c0] h-8 px-2 inset-shadow border-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white">
        <span className="text-xs mr-2 text-red-600 font-bold animate-pulse">
           ⏳ {formatGameTime(time)}
        </span>
        <span className="text-xs">{clockStr}</span>
      </div>
    </div>
  );
};