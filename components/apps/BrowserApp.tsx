import React from 'react';
import { WindowState } from '../../types';

interface Props {
  window: WindowState;
  onAction: (windowId: string, actionType: 'ACCEPT' | 'REJECT') => void;
}

export const BrowserApp: React.FC<Props> = ({ window, onAction }) => {
  const { url, content } = window.contentData;

  return (
    <div className="h-full flex flex-col bg-[#c0c0c0]">
      {/* Address Bar */}
      <div className="p-1 flex items-center gap-2 border-b border-gray-400">
        <span className="text-xs text-gray-600">地址:</span>
        <div className="flex-1 bg-white border border-gray-500 px-2 py-0.5 font-mono text-sm truncate select-text shadow-inner">
          http://{url}
        </div>
        <button className="px-2 bg-[#c0c0c0] border border-gray-500 text-xs">GO</button>
      </div>

      {/* Web View */}
      <div className="flex-1 bg-white m-1 border-2 border-gray-500 overflow-y-auto p-4 flex flex-col items-center justify-center text-center">
         <h1 className="text-2xl font-bold mb-4 text-blue-900">Security Alert</h1>
         <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-3xl mb-4 border-2 border-black">
            !
         </div>
         <p className="mb-6 max-w-sm">{content}</p>
         
         <div className="flex flex-col gap-3 w-full max-w-xs">
            <button 
                onClick={() => onAction(window.id, 'ACCEPT')}
                className="py-2 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 active:bg-blue-800"
            >
                [提交信息/登录]
            </button>
            <div className="h-px bg-gray-300 my-2"></div>
             <button 
                onClick={() => onAction(window.id, 'REJECT')}
                className="text-xs text-gray-500 underline hover:text-red-500"
            >
                关闭网页并拦截
            </button>
         </div>
      </div>
      
      {/* Status Bar */}
      <div className="px-2 py-0.5 text-[10px] text-gray-600 border-t border-gray-400">
        正在等待响应...
      </div>
    </div>
  );
};