import React from 'react';
import { WindowState } from '../../types';

interface Props {
  window: WindowState;
  onAction: (windowId: string, actionType: 'ACCEPT' | 'REJECT' | 'VERIFY_ID' | 'SEND_FILE') => void;
}

export const ChatApp: React.FC<Props> = ({ window, onAction }) => {
  const { avatar, username, userId, messages, actions } = window.contentData;

  return (
    <div className="h-full flex flex-col bg-[#f0f0f0] font-sans">
      {/* Chat Header */}
      <div className="p-2 border-b border-gray-300 bg-white flex items-center gap-2 shadow-sm">
        <div className="w-8 h-8 rounded bg-gray-300 flex items-center justify-center text-lg border border-gray-400 select-none">
          {avatar}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-bold text-sm truncate">{username}</span>
          <span className="text-[10px] text-gray-500 truncate">{userId}</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-2 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg: any, idx: number) => (
          <div key={idx} className={`max-w-[80%] p-2 text-xs rounded shadow-sm ${
            msg.sender === 'me' 
              ? 'bg-green-200 self-end rounded-tr-none' 
              : 'bg-white self-start border border-gray-300 rounded-tl-none'
          }`}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="p-2 bg-[#e0e0e0] border-t border-gray-400 grid grid-cols-2 gap-2">
        {actions.includes('VERIFY_ID') && (
          <button 
            onClick={() => onAction(window.id, 'VERIFY_ID')}
            className="bg-yellow-100 border border-yellow-600 text-yellow-900 text-xs py-1 px-2 hover:bg-yellow-200"
          >
            🔍 核实身份
          </button>
        )}
        {actions.includes('SEND_FILE') && (
          <button 
            onClick={() => onAction(window.id, 'SEND_FILE')}
            className="bg-blue-100 border border-blue-600 text-blue-900 text-xs py-1 px-2 hover:bg-blue-200"
          >
            📁 发送文件
          </button>
        )}
        {actions.includes('PAY') && (
          <button 
            onClick={() => onAction(window.id, 'ACCEPT')} // Accept = Pay (Trap)
            className="bg-green-100 border border-green-600 text-green-900 text-xs py-1 px-2 hover:bg-green-200"
          >
            💳 立即转账
          </button>
        )}
         {actions.includes('BLOCK') && (
          <button 
            onClick={() => onAction(window.id, 'REJECT')} // Reject = Block/Report
            className="bg-red-100 border border-red-600 text-red-900 text-xs py-1 px-2 hover:bg-red-200 col-span-2"
          >
            🚫 拉黑/举报
          </button>
        )}
      </div>
    </div>
  );
};