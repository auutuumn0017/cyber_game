import { useState, useCallback } from 'react';
import { WindowState, AppType } from '../types';

export const useWindowManager = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  // Generate a safe spawn position so windows don't pile up exactly
  const getSpawnPosition = () => {
    const baseOffset = 50;
    const randomOffset = Math.floor(Math.random() * 150);
    return {
      x: baseOffset + randomOffset,
      y: baseOffset + randomOffset * 0.5,
    };
  };

  const openWindow = useCallback((type: AppType, contentData: any, title: string) => {
    const newId = `win_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const { x, y } = getSpawnPosition();
    
    // Determine max z-index
    const maxZ = windows.length > 0 ? Math.max(...windows.map(w => w.zIndex)) : 10;

    const newWindow: WindowState = {
      id: newId,
      type,
      title,
      x,
      y,
      width: type === AppType.POPUP || type === AppType.ERROR ? 300 : 500,
      height: type === AppType.POPUP || type === AppType.ERROR ? 200 : 400,
      zIndex: maxZ + 1,
      isMinimized: false,
      contentData,
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newId);
  }, [windows]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  }, [activeWindowId]);

  const focusWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    setWindows(prev => {
      const maxZ = prev.length > 0 ? Math.max(...prev.map(w => w.zIndex)) : 10;
      return prev.map(w => 
        w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w
      );
    });
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(null);
  }, []);

  return {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    focusWindow,
    moveWindow,
    minimizeWindow
  };
};