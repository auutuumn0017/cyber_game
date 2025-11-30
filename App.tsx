import React, { useState, useEffect, useRef } from 'react';
import { useWindowManager } from './hooks/useWindowManager';
import { DraggableWindow } from './components/os/DraggableWindow';
import { Taskbar } from './components/os/Taskbar';
import { EmailApp } from './components/apps/EmailApp';
import { BrowserApp } from './components/apps/BrowserApp';
import { PopupApp } from './components/apps/PopupApp';
import { ChatApp } from './components/apps/ChatApp';
import { WifiApp } from './components/apps/WifiApp';
import { UpdateApp } from './components/apps/UpdateApp';
import { INITIAL_STATS, EVENTS, RETRO_COLORS } from './constants';
import { AppType, GameStatus, PlayerStats, GameEvent } from './types';

// Simple sound effects helper
const playSound = (type: 'error' | 'success' | 'click' | 'alert') => {
    // Placeholder.
};

const App: React.FC = () => {
  const { 
    windows, activeWindowId, openWindow, closeWindow, focusWindow, moveWindow, minimizeWindow 
  } = useWindowManager();

  const [status, setStatus] = useState<GameStatus>('MENU');
  const [stats, setStats] = useState<PlayerStats>({ ...INITIAL_STATS });
  const [feedback, setFeedback] = useState<{msg: string, type: 'good'|'bad'} | null>(null);
  
  const timerRef = useRef<number | null>(null);
  const eventLoopRef = useRef<number | null>(null);
  
  // "Deck" of events to ensure we cycle through all of them
  const eventDeckRef = useRef<GameEvent[]>([]);

  // Fisher-Yates Shuffle
  const shuffle = (array: GameEvent[]) => {
      let currentIndex = array.length, randomIndex;
      while (currentIndex !== 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }
      return array;
  };

  // --- Game Loop ---
  const startGame = () => {
    setStatus('PLAYING');
    setStats({ ...INITIAL_STATS });
    eventDeckRef.current = shuffle([...EVENTS]);
    
    // Spawn initial email immediately
    setTimeout(() => {
        const initialEvent = EVENTS.find(e => e.id === 'work_email_meeting');
        if(initialEvent) openWindow(initialEvent.type, initialEvent.contentData, initialEvent.title);
    }, 500);
  };

  useEffect(() => {
    if (status !== 'PLAYING') {
      if (timerRef.current) clearInterval(timerRef.current);
      if (eventLoopRef.current) clearInterval(eventLoopRef.current);
      return;
    }

    // 1. Time Countdown
    timerRef.current = window.setInterval(() => {
      setStats(prev => {
        if (prev.time <= 1) {
          setStatus('VICTORY');
          return { ...prev, time: 0 };
        }
        return { ...prev, time: prev.time - 1 };
      });
    }, 1000);

    // 2. Event Spawner
    // Check more frequently (every 3.5s) with a high chance (70%)
    eventLoopRef.current = window.setInterval(() => {
      if (Math.random() < 0.7) {
        
        // Refill deck if empty to keep cycling
        if (eventDeckRef.current.length === 0) {
            eventDeckRef.current = shuffle([...EVENTS]);
        }

        const nextEvent = eventDeckRef.current.pop();

        if (nextEvent) {
             // Handle "Spam Cluster" Logic (Event H)
            if (nextEvent.id === 'distraction_spam_game') {
                // Spawn 3 at once with slight offsets
                for(let i=0; i<3; i++) {
                    setTimeout(() => {
                        openWindow(nextEvent.type, { ...nextEvent.contentData, eventId: nextEvent.id }, `${nextEvent.title} (${i+1})`);
                    }, i * 200);
                }
                playSound('alert');
            } else {
                openWindow(nextEvent.type, { ...nextEvent.contentData, eventId: nextEvent.id }, `${nextEvent.title}`);
                playSound('click');
            }
        }
      }
    }, 3500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (eventLoopRef.current) clearInterval(eventLoopRef.current);
    };
  }, [status, openWindow]);

  // Check Game Over conditions
  useEffect(() => {
    if (status === 'PLAYING') {
      if (stats.money <= 0) setStatus('GAME_OVER_BANKRUPT');
      if (stats.sanity <= 0) setStatus('GAME_OVER_INSANE');
    }
  }, [stats, status]);

  // --- Interaction Logic ---
  const handleAppAction = (windowId: string, actionType: 'ACCEPT' | 'REJECT' | 'VERIFY_ID' | 'SEND_FILE' | 'WAIT' | 'INTERRUPT') => {
    const win = windows.find(w => w.id === windowId);
    if (!win) return;

    const data = win.contentData;
    const eventDef = EVENTS.find(e => e.id === data.eventId);

    // Default reward/penalty if not found
    const penalty = eventDef?.contentData.penalty || { money: -100, sanity: -10 };
    const reward = eventDef?.contentData.reward || { money: 0, sanity: 0, score: 50 };
    const isScam = data.isScam;

    let moneyChange = 0;
    let sanityChange = 0;
    let scoreChange = 0;
    let message = '';
    let feedbackType: 'good' | 'bad' = 'good';
    let shouldClose = true;

    // --- LOGIC MATRIX ---

    // 1. UPDATE LOGIC
    if (win.type === AppType.UPDATE) {
        if (actionType === 'INTERRUPT') {
            message = "警告: 强制中断更新! 数据丢失!";
            sanityChange = penalty.sanity;
            feedbackType = 'bad';
            shouldClose = false; // Don't close, user suffers
            playSound('error');
        } else if (actionType === 'WAIT') {
            message = "系统更新完成";
            scoreChange = reward.score;
            shouldClose = true;
        }
    } 
    // 2. CHAT LOGIC
    else if (win.type === AppType.CHAT) {
        if (actionType === 'VERIFY_ID') {
            // Check if scam
            if (isScam) {
                message = "系统: 该用户不在企业通讯录中!";
                shouldClose = false; // Keep open so user can Block
            } else {
                message = "系统: 身份验证通过: 设计部/Jennifer";
                shouldClose = false;
            }
            scoreChange = 10; 
        } else if (actionType === 'SEND_FILE') {
            if (isScam) {
                // Sent file to scammer
                message = "错误: 你把机密文件发给了骗子!";
                moneyChange = penalty.money;
                feedbackType = 'bad';
            } else {
                message = "文件已发送";
                scoreChange = reward.score;
                sanityChange = reward.sanity;
            }
        } else if (actionType === 'REJECT') { // Block
            if (isScam) {
                message = "成功拦截诈骗账号!";
                scoreChange = reward.score;
                playSound('success');
            } else {
                message = "你拉黑了正常同事!";
                sanityChange = penalty.sanity;
                feedbackType = 'bad';
            }
        } else if (actionType === 'ACCEPT') { // Pay
            message = "警告: 转账诈骗!";
            moneyChange = penalty.money;
            feedbackType = 'bad';
            playSound('error');
        }
    }
    // 3. STANDARD LOGIC (Email, Popup, Browser, Wifi)
    else {
        if (actionType === 'REJECT') { // Close / Delete / Report / Ignore
            if (isScam) {
                message = `成功识破!`;
                if(data.scamReason) message += ` (${data.scamReason})`;
                scoreChange = reward.score;
                sanityChange = reward.sanity;
                playSound('success');
            } else {
                // Context Check: WiFi
                if (win.type === AppType.WIFI) {
                     message = "网络恢复正常"; // Waiting/Ignoring wifi portal is correct
                     scoreChange = reward.score;
                     sanityChange = reward.sanity;
                } else {
                     message = "你拒绝了正常业务!";
                     moneyChange = penalty.money;
                     sanityChange = penalty.sanity;
                     feedbackType = 'bad';
                     playSound('error');
                }
            }
        } else { // Accept / Click Link / Run File
            if (isScam) {
                if(data.attachment && data.attachment.includes('.exe')) {
                     message = "致命错误: 勒索病毒爆发!";
                } else {
                     message = "警告: 遭遇诈骗! 资产损失!";
                }
                moneyChange = penalty.money;
                sanityChange = penalty.sanity;
                feedbackType = 'bad';
                playSound('error');
            } else {
                message = "操作完成";
                moneyChange = reward.money;
                scoreChange = reward.score;
                playSound('success');
            }
        }
    }

    // Update Stats
    setStats(prev => ({
        ...prev,
        money: prev.money + moneyChange,
        sanity: prev.sanity + sanityChange,
        score: prev.score + scoreChange
    }));

    // Show Feedback Bubble
    if(message) {
        setFeedback({ msg: message, type: feedbackType });
        setTimeout(() => setFeedback(null), 2000);
    }

    if (shouldClose) closeWindow(windowId);
  };

  // --- Render Helpers ---
  const renderAppContent = (window: any) => {
    switch (window.type) {
      case AppType.EMAIL:
        return <EmailApp window={window} onAction={handleAppAction} />;
      case AppType.BROWSER:
        return <BrowserApp window={window} onAction={handleAppAction} />;
      case AppType.POPUP:
      case AppType.ERROR:
        return <PopupApp window={window} onAction={handleAppAction} />;
      case AppType.CHAT:
        return <ChatApp window={window} onAction={handleAppAction} />;
      case AppType.WIFI:
        return <WifiApp window={window} onAction={handleAppAction} />;
      case AppType.UPDATE:
        return <UpdateApp window={window} onAction={handleAppAction} />;
      default:
        return <div className="p-4">Unknown App</div>;
    }
  };

  return (
    <div className={`w-screen h-screen overflow-hidden ${RETRO_COLORS.bg} relative font-sans select-none`}>
      <div className="scanlines"></div>
      
      {/* Desktop Icons (Static for decoration) */}
      <div className="absolute top-4 left-4 flex flex-col gap-6 z-0">
         <div className="flex flex-col items-center gap-1 group cursor-pointer w-20">
            <div className="w-10 h-10 bg-blue-200 border-2 border-blue-800 flex items-center justify-center text-xl">💻</div>
            <span className="text-white text-shadow bg-blue-900 px-1 text-xs group-hover:bg-blue-700">我的电脑</span>
         </div>
         <div className="flex flex-col items-center gap-1 group cursor-pointer w-20">
            <div className="w-10 h-10 bg-yellow-200 border-2 border-yellow-800 flex items-center justify-center text-xl">📁</div>
            <span className="text-white text-shadow bg-blue-900 px-1 text-xs group-hover:bg-blue-700">重要文档</span>
         </div>
         <div className="flex flex-col items-center gap-1 group cursor-pointer w-20">
            <div className="w-10 h-10 bg-gray-200 border-2 border-gray-800 flex items-center justify-center text-xl">🗑️</div>
            <span className="text-white text-shadow bg-blue-900 px-1 text-xs group-hover:bg-blue-700">回收站</span>
         </div>
      </div>

      {/* Stats HUD (Always visible) */}
      <div className="absolute top-4 right-4 bg-[#c0c0c0] border-2 border-white p-2 shadow-lg z-[50] w-64">
        <div className="border-2 border-gray-500 p-2 space-y-2">
            <h2 className="font-bold text-center border-b border-gray-500 mb-2">系统状态</h2>
            <div className="flex justify-between items-center">
                <span>💰 资产:</span>
                <span className={`font-mono font-bold ${stats.money < 1000 ? 'text-red-600' : 'text-green-800'}`}>${stats.money}</span>
            </div>
            <div className="flex justify-between items-center">
                <span>🧠 理智:</span>
                <div className="w-24 h-4 bg-gray-700 border border-white relative">
                    <div 
                        className={`h-full ${stats.sanity < 30 ? 'bg-red-500' : 'bg-green-500'}`} 
                        style={{ width: `${Math.max(0, Math.min(100, stats.sanity))}%` }}
                    ></div>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <span>🏆 得分:</span>
                <span className="font-mono">{stats.score}</span>
            </div>
        </div>
      </div>

      {/* Feedback Overlay */}
      {feedback && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000] pointer-events-none">
            <div className={`px-6 py-3 border-4 ${feedback.type === 'good' ? 'bg-green-100 border-green-500 text-green-900' : 'bg-red-100 border-red-500 text-red-900'} font-bold text-xl shadow-xl animate-bounce`}>
                {feedback.msg}
            </div>
        </div>
      )}

      {/* Windows Layer */}
      {windows.map(win => (
        <DraggableWindow
          key={win.id}
          window={win}
          isActive={activeWindowId === win.id}
          onFocus={focusWindow}
          onClose={(id) => handleAppAction(id, 'REJECT')}
          onMove={moveWindow}
          onMinimize={minimizeWindow}
        >
          {renderAppContent(win)}
        </DraggableWindow>
      ))}

      {/* Taskbar */}
      <Taskbar 
        windows={windows} 
        activeWindowId={activeWindowId} 
        onWindowClick={(id) => {
            const win = windows.find(w => w.id === id);
            if(win?.isMinimized) focusWindow(id);
            else if(activeWindowId === id) minimizeWindow(id);
            else focusWindow(id);
        }}
        onStartClick={() => {}}
        time={stats.time}
      />

      {/* Game Over / Menu Overlays */}
      {status !== 'PLAYING' && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[10000] backdrop-blur-sm">
            <div className="bg-[#c0c0c0] border-t-4 border-l-4 border-white border-b-4 border-r-4 border-black p-1 shadow-2xl max-w-md w-full">
                <div className={`bg-blue-900 text-white px-2 py-1 font-bold flex justify-between`}>
                    <span>System Message</span>
                    <span>X</span>
                </div>
                <div className="p-6 flex flex-col items-center text-center gap-4">
                    {status === 'MENU' && (
                        <>
                            <h1 className="text-4xl font-bold font-['VT323'] tracking-widest text-blue-900">Cyber OS</h1>
                            <p className="text-gray-700">今天是发薪日。处理邮件，远离诈骗，保持理智。</p>
                            <button onClick={startGame} className="px-6 py-2 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black font-bold text-xl hover:bg-gray-300">
                                启动系统 (START)
                            </button>
                        </>
                    )}
                    {status === 'GAME_OVER_BANKRUPT' && (
                        <>
                            <div className="text-5xl">💸</div>
                            <h2 className="text-2xl font-bold text-red-600">破产! (BANKRUPT)</h2>
                            <p>你被网络诈骗骗光了所有积蓄。</p>
                            <div className="font-mono bg-white p-2 border border-gray-500 w-full">最终得分: {stats.score}</div>
                            <button onClick={startGame} className="mt-4 px-4 py-1 border-2 border-black">重试</button>
                        </>
                    )}
                    {status === 'GAME_OVER_INSANE' && (
                        <>
                            <div className="text-5xl">🤯</div>
                            <h2 className="text-2xl font-bold text-purple-800">精神崩溃 (INSANITY)</h2>
                            <p>弹窗太多了，你砸烂了电脑。</p>
                            <div className="font-mono bg-white p-2 border border-gray-500 w-full">最终得分: {stats.score}</div>
                            <button onClick={startGame} className="mt-4 px-4 py-1 border-2 border-black">重试</button>
                        </>
                    )}
                     {status === 'VICTORY' && (
                        <>
                            <div className="text-5xl">💾</div>
                            <h2 className="text-2xl font-bold text-green-700">下班了! (VICTORY)</h2>
                            <p>你成功存活了一整天。</p>
                            <div className="font-mono bg-white p-2 border border-gray-500 w-full">最终得分: {stats.score}</div>
                            <button onClick={startGame} className="mt-4 px-4 py-1 border-2 border-black">再次挑战</button>
                        </>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;