import React, { useState, useEffect } from 'react';
import { WindowState } from '../../types';

interface Props {
  window: WindowState;
  onAction: (windowId: string, actionType: 'ACCEPT' | 'REJECT') => void;
}

export const WifiApp: React.FC<Props> = ({ window, onAction }) => {
  const { ssid } = window.contentData;
  const [loading, setLoading] = useState(false);

  // Auto-recovery simulation
  useEffect(() => {
    const timer = setTimeout(() => {
        onAction(window.id, 'REJECT'); // Auto-close/recover after 5s implies success (user waited)
    }, 5000);
    return () => clearTimeout(timer);
  }, [onAction, window.id]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-white p-4 font-sans border-t-4 border-orange-500">
      <div className="text-4xl mb-2">📶</div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">连接认证中断</h2>
      <p className="text-xs text-gray-500 mb-4 text-center">
        您与 <span className="font-bold text-black">{ssid}</span> 的连接需要重新认证。
      </p>

      <div className="w-full max-w-[200px] flex flex-col gap-2">
        <input 
            type="text" 
            placeholder="员工工号" 
            className="border p-1 text-sm bg-gray-50" 
            disabled 
        />
        <input 
            type="password" 
            placeholder="密码" 
            className="border p-1 text-sm bg-gray-50" 
            disabled 
        />
        
        <button 
            onClick={() => {
                setLoading(true);
                setTimeout(() => onAction(window.id, 'ACCEPT'), 800); // Trigger Trap
            }}
            className="bg-orange-500 text-white font-bold py-1 mt-2 hover:bg-orange-600 shadow-md"
        >
            {loading ? '提交中...' : '立即登录'}
        </button>

        <div className="text-[10px] text-center text-gray-400 mt-2">
           请勿关闭窗口，网络正在尝试自动恢复... (5s)
        </div>
      </div>
    </div>
  );
};