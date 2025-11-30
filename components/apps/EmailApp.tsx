import React from 'react';
import { WindowState } from '../../types';

interface Props {
  window: WindowState;
  onAction: (windowId: string, actionType: 'ACCEPT' | 'REJECT') => void;
}

export const EmailApp: React.FC<Props> = ({ window, onAction }) => {
  const { from, subject, body, attachment } = window.contentData;

  // Check for dangerous double extensions for visual hints
  const isDoubleExtension = attachment && attachment.endsWith('.pdf.exe');
  
  // Extract display name (fake or real)
  const displayFileName = attachment;

  return (
    <div className="h-full flex flex-col bg-white border border-gray-500 font-sans text-sm">
      {/* Toolbar */}
      <div className="flex gap-2 p-1 border-b border-gray-300 bg-[#f0f0f0]">
        <button className="px-2 border border-gray-400 bg-gray-100 hover:bg-gray-200">回复</button>
        <button className="px-2 border border-gray-400 bg-gray-100 hover:bg-gray-200">转发</button>
        <button className="px-2 border border-gray-400 bg-gray-100 hover:bg-gray-200 text-red-600">删除</button>
      </div>

      {/* Header */}
      <div className="bg-gray-100 p-2 border-b border-gray-300 text-xs sm:text-sm">
        <div className="grid grid-cols-[60px_1fr] gap-1 mb-1">
          <span className="text-gray-500 text-right">发件人:</span>
          <span className="font-mono bg-white border border-gray-300 px-1 select-text">{from}</span>
        </div>
        <div className="grid grid-cols-[60px_1fr] gap-1">
          <span className="text-gray-500 text-right">主题:</span>
          <span className="font-bold select-text">{subject}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 overflow-y-auto font-serif relative">
        <p className="mb-4 whitespace-pre-wrap">{body}</p>
        
        {attachment && (
          <div className="mt-4 p-2 border border-gray-300 bg-gray-50 flex items-center gap-2 max-w-xs cursor-pointer hover:bg-blue-50 group">
            <div className={`w-8 h-8 flex items-center justify-center text-[10px] font-bold border ${isDoubleExtension ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-100 border-blue-300 text-blue-800'}`}>
              {/* If double extension, the icon might deceptively look like PDF */}
              {isDoubleExtension ? 'PDF' : 'FILE'}
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="truncate text-xs font-mono group-hover:whitespace-normal group-hover:break-all">
                    {displayFileName}
                </div>
                <div className="text-[10px] text-gray-500">128 KB</div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-2 border-t border-gray-300 bg-[#f0f0f0] flex justify-between">
        <button 
          onClick={() => onAction(window.id, 'REJECT')}
          className="px-3 py-1 bg-red-100 border border-red-400 text-red-800 hover:bg-red-200 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-[1px] active:shadow-none"
        >
          ⚠ 删除/举报
        </button>
        <button 
          onClick={() => onAction(window.id, 'ACCEPT')}
          className="px-3 py-1 bg-green-100 border border-green-400 text-green-800 hover:bg-green-200 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-[1px] active:shadow-none"
        >
          ✔ 确认/运行
        </button>
      </div>
    </div>
  );
};