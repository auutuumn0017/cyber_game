import React, { useEffect, useState } from 'react';
import { WindowState } from '../../types';

interface Props {
  window: WindowState;
  onAction: (windowId: string, actionType: 'WAIT' | 'INTERRUPT') => void;
}

export const UpdateApp: React.FC<Props> = ({ window, onAction }) => {
  const { progress, duration } = window.contentData;
  const [currentProgress, setCurrentProgress] = useState(progress);

  useEffect(() => {
    // Simulate progress
    const interval = setInterval(() => {
        setCurrentProgress((prev: number) => Math.min(prev + 1, 100));
    }, duration / 50);

    // Auto-complete (Success)
    const timeout = setTimeout(() => {
        onAction(window.id, 'WAIT');
    }, duration);

    return () => {
        clearInterval(interval);
        clearTimeout(timeout);
    };
  }, [duration, onAction, window.id]);

  return (
    <div 
        className="h-full flex flex-col items-center justify-center bg-[#005a9e] text-white p-6 font-['Segoe_UI'] cursor-progress select-none"
        onClick={() => onAction(window.id, 'INTERRUPT')} // Clicking penalizes
    >
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mb-6"></div>
      <h2 className="text-xl mb-2">正在配置 Windows 更新</h2>
      <p className="text-sm mb-6">{currentProgress}% 完成</p>
      <p className="text-xs opacity-70">请勿关闭计算机</p>
      
      {/* Invisible overlay to catch clicks */}
      <div className="absolute inset-0 z-50"></div>
    </div>
  );
};