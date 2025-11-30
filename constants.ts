import { AppType, GameEvent } from './types';

export const INITIAL_STATS = {
  sanity: 100,
  money: 5000,
  time: 180, // Increased time for more events
  score: 0,
};

// Retro Windows Color Palette helpers
export const RETRO_COLORS = {
  bg: 'bg-[#008080]', // Classic Teal
  winBg: 'bg-[#c0c0c0]', // Windows Grey
  winBorderLight: 'border-t-white border-l-white',
  winBorderDark: 'border-b-black border-r-black',
  blueHeader: 'bg-gradient-to-r from-[#000080] to-[#1084d0]',
};

// --- Game Scenarios ---

export const EVENTS: GameEvent[] = [
  // --- EXISTING EVENTS ---
  {
    id: 'scam_email_salary',
    type: AppType.EMAIL,
    title: '收件箱 - 1 新邮件',
    spawnChance: 0.2,
    contentData: {
      from: 'hr@conpany.com',
      subject: 'URGENT: 工资条确认',
      body: '亲爱的员工，请立即确认本月工资明细，否则将暂停发放。',
      attachment: 'salary_details.exe',
      isScam: true,
      scamReason: '发件人域名拼写错误 (conpany.com)',
      penalty: { money: -2000, sanity: -10 },
      reward: { money: 0, sanity: 5, score: 100 }
    }
  },
  {
    id: 'work_email_meeting',
    type: AppType.EMAIL,
    title: '收件箱 - 1 新邮件',
    spawnChance: 0.2,
    contentData: {
      from: 'boss@company.com',
      subject: '明天的会议日程',
      body: '请确认是否参加明天上午9点的产品同步会。',
      attachment: 'agenda.doc',
      isScam: false,
      penalty: { money: -200, sanity: -5 },
      reward: { money: 100, sanity: 0, score: 50 }
    }
  },
  {
    id: 'scam_browser_bank',
    type: AppType.BROWSER,
    title: 'Internet Explorer',
    spawnChance: 0.15,
    contentData: {
      url: 'www.icbc-security-login-vip.xyz',
      content: '您的账户存在风险！请输入密码解冻。',
      isScam: true,
      scamReason: '可疑的 URL 后缀 (.xyz) 和过长的域名',
      penalty: { money: -5000, sanity: -20 },
      reward: { money: 0, sanity: 5, score: 150 }
    }
  },
  {
    id: 'ad_popup_winner',
    type: AppType.POPUP,
    title: '恭喜！',
    spawnChance: 0.2,
    contentData: {
      message: '你是第 999,999 位访客！点击领取 iPhone 15！',
      buttonText: '立即领取',
      isScam: true,
      penalty: { money: -500, sanity: -15 },
      reward: { money: 0, sanity: 2, score: 20 }
    }
  },

  // --- NEW: HIGH RISK EVENTS ---
  
  // Event D: Double Extension
  {
    id: 'scam_email_double_ext',
    type: AppType.EMAIL,
    title: '人事部 - 全员薪资调整',
    spawnChance: 0.15,
    contentData: {
      from: 'hr@company.com', // Correct email to trick user
      subject: '全员薪资调整通知',
      body: '附件为2024年最新薪资调整方案，请查阅。',
      attachment: '2024_Salary_List.pdf.exe', // The trap
      isScam: true,
      scamReason: '双重后缀名 (.pdf.exe) 病毒文件',
      penalty: { money: -5000, sanity: -30 }, // Heavy penalty
      reward: { money: 0, sanity: 10, score: 200 }
    }
  },
  // Event E: Fake IT Password Reset
  {
    id: 'scam_popup_it_pwd',
    type: AppType.POPUP,
    title: 'Windows 安全中心',
    spawnChance: 0.15,
    contentData: {
      message: '您的域账户密码已过期，请点击立即修改。',
      buttonText: '立即修改',
      isScam: true,
      isSystemStyle: true, // Styling hint
      scamReason: '伪造的系统弹窗',
      penalty: { money: -1000, sanity: -10 },
      reward: { money: 0, sanity: 5, score: 100 }
    }
  },
  // Event F: Fake Boss Chat
  {
    id: 'scam_chat_boss',
    type: AppType.CHAT,
    title: 'Boss (私聊)',
    spawnChance: 0.15,
    contentData: {
      avatar: '👨🏻‍💼',
      username: 'Boss', // Look similar
      userId: 'wxid_8923ad7s (未认证)',
      messages: [
        { sender: 'them', text: '小王，我在开会不方便。' },
        { sender: 'them', text: '这有个合同款急需付一下，你先帮我垫付，回去给你报销。' }
      ],
      isScam: true,
      actions: ['VERIFY_ID', 'BLOCK', 'PAY'],
      scamReason: '未认证账号/典型垫付骗局',
      penalty: { money: -8000, sanity: -20 },
      reward: { money: 0, sanity: 10, score: 250 }
    }
  },
  // Event G: Phishing Wifi
  {
    id: 'scam_wifi_login',
    type: AppType.WIFI,
    title: '网络连接认证',
    spawnChance: 0.1,
    contentData: {
      ssid: 'Company_Guest_WiFi',
      isScam: true,
      scamReason: '钓鱼 WiFi 门户',
      penalty: { money: -2000, sanity: -10 },
      reward: { money: 0, sanity: 5, score: 100 }
    }
  },

  // --- NEW: DISTRACTION EVENTS ---

  // Event H: Spam Cluster (The logic in App.tsx might create multiples, but here is the base event)
  {
    id: 'distraction_spam_game',
    type: AppType.POPUP,
    title: '贪玩蓝月',
    spawnChance: 0.1,
    contentData: {
      message: '一刀999！系兄弟就来砍我！',
      buttonText: '下载游戏',
      isScam: true,
      trickClose: true, // Special flag for tiny/moving close button
      penalty: { money: -100, sanity: -5 },
      reward: { money: 0, sanity: 2, score: 30 }
    }
  },
  // Event I: Fake System Update
  {
    id: 'distraction_sys_update',
    type: AppType.UPDATE,
    title: 'Windows Update',
    spawnChance: 0.05,
    contentData: {
      message: '正在配置 Windows 更新，请勿关闭电脑...',
      progress: 15,
      duration: 3000, // 3 seconds wait
      isScam: false, // It's a "real" fake update distraction
      penalty: { money: 0, sanity: -20 }, // Penalty for clicking (interfering)
      reward: { money: 0, sanity: 5, score: 50 }
    }
  },

  // --- NEW: NORMAL BUSINESS ---

  // Event J: Real Invoice
  {
    id: 'work_email_invoice',
    type: AppType.EMAIL,
    title: '收件箱 - 1 新邮件',
    spawnChance: 0.2,
    contentData: {
      from: 'finance@partner-inc.com',
      subject: 'Re: 关于上周的项目款项',
      body: '附件为最终确认的发票，请归档。',
      attachment: 'invoice_2024.pdf',
      isScam: false,
      penalty: { money: -500, sanity: -10 }, // Penalty for deleting real work
      reward: { money: 200, sanity: 0, score: 80 }
    }
  },
  // Event K: Colleague Chat
  {
    id: 'work_chat_colleague',
    type: AppType.CHAT,
    title: 'Jennifer (设计部)',
    spawnChance: 0.2,
    contentData: {
      avatar: '👩🏻‍🎨',
      username: 'Jennifer',
      userId: 'Corp_ID_9921',
      messages: [
        { sender: 'them', text: '宝子，那个PPT模板发我一份，急用！' }
      ],
      isScam: false,
      actions: ['SEND_FILE', 'BLOCK'],
      penalty: { money: 0, sanity: -5 }, // Ignore colleague
      reward: { money: 0, sanity: 5, score: 60 }
    }
  },
  // Event L: 2FA (Mobile view)
  {
    id: 'work_2fa_sms',
    type: AppType.POPUP,
    title: '手机短信',
    spawnChance: 0.1,
    contentData: {
      message: '【公司VPN】验证码 89757。您正在尝试登录内网。',
      buttonText: '输入验证码',
      isScam: false, // Context dependent, but base event is "real"
      isMobile: true,
      penalty: { money: 0, sanity: -5 },
      reward: { money: 0, sanity: 0, score: 40 }
    }
  }
];