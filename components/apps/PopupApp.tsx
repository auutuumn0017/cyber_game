import React, { useState } from 'react';
import { WindowState, AppType } from '../../types';

interface Props {
  window: WindowState;
  onAction: (windowId: string, actionType: 'ACCEPT' | 'REJECT') => void;
}

export const PopupApp: React.FC<Props> = ({ window, onAction }) => {
  const { message, buttonText, trickClose, isSystemStyle, isMobile } = window.contentData;
  const isError = window.type === AppType.ERROR;
  const [hoverTrick, setHoverTrick] = useState(false);

  // Styling wrapper based on type
  const wrapperClass = isMobile 
    ? "h-full flex flex-col bg-gray-800 border-x-8 border-y-[20px] border-black rounded-lg text-white" 
    : isSystemStyle
    ? "h-full flex flex-col bg-white font-sans text-sm"
    : "h-full flex flex-col items-center justify-center bg-[#c0c0c0] p-4 text-center border-t-2 border-white border-l-2 border-white border-r-2 border-gray-600 border-b-2 border-gray-600";

  return (
    <div className={wrapperClass}>
        {/* Mobile Header */}
        {isMobile && (
            <div className="bg-gray-900 p-2 text-center text-xs font-mono text-gray-400 border-b border-gray-700">
                MESSAGES
            </div>
        )}

        {/* System Header Image (Fake) */}
        {isSystemStyle && (
             <div className="bg-blue-600 h-10 w-full flex items-center px-4">
                 <span className="text-white font-bold">Security Center</span>
             </div>
        )}

      <div className={`flex-1 flex flex-col items-center justify-center ${isMobile ? 'p-4' : 'p-2'}`}>
        {isError && !isSystemStyle && (
            <div className="mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 text-white flex items-center justify-center font-bold rounded-full border-2 border-white shadow-md">X</div>
            </div>
        )}
        {!isError && !isMobile && !isSystemStyle && (
            <div className="mb-2 text-4xl">🎉</div>
        )}
        
        <p className={`mb-6 font-medium ${isMobile ? 'bg-gray-700 p-3 rounded-lg text-left w-full' : ''} ${isSystemStyle ? 'text-left w-full px-4 mt-4' : ''}`}>
            {message}
        </p>

        <div className={`flex gap-4 ${isSystemStyle ? 'w-full justify-end px-4 mb-4' : ''}`}>
            {buttonText && (
                <button 
                onClick={() => onAction(window.id, 'ACCEPT')}
                className={`${isMobile 
                    ? 'bg-blue-500 text-white rounded px-4 py-2 w-full font-bold' 
                    : 'min-w-[80px] px-3 py-1 bg-[#c0c0c0] border-t-white border-l-white border-b-black border-r-black border-2 active:border-t-black active:border-l-black active:border-b-white active:border-r-white'}`}
                >
                {buttonText}
                </button>
            )}
            
            {!isMobile && (
                 <button 
                 onMouseEnter={() => trickClose && setHoverTrick(true)}
                 onMouseLeave={() => trickClose && setHoverTrick(false)}
                 onClick={() => onAction(window.id, 'REJECT')}
                 style={trickClose && hoverTrick ? { transform: `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px)` } : {}}
                 className={`min-w-[80px] px-3 py-1 bg-[#c0c0c0] border-t-white border-l-white border-b-black border-r-black border-2 active:border-t-black active:border-l-black active:border-b-white active:border-r-white transition-transform duration-75`}
               >
                 {isError || isSystemStyle ? '取消' : '关闭'}
               </button>
            )}
        </div>
      </div>
    </div>
  );
};