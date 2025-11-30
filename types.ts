export enum AppType {
  EMAIL = 'EMAIL',
  BROWSER = 'BROWSER',
  POPUP = 'POPUP',
  ERROR = 'ERROR',
  CHAT = 'CHAT',
  WIFI = 'WIFI',
  UPDATE = 'UPDATE'
}

export interface WindowState {
  id: string;
  type: AppType;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  contentData: any; // Flexible payload for specific app content
}

export interface GameEvent {
  id: string;
  type: AppType;
  title: string;
  description?: string;
  contentData: any;
  spawnChance: number; // 0-1
}

export interface PlayerStats {
  sanity: number; // Max 100
  money: number; // Start 1000
  time: number; // Seconds remaining
  score: number;
}

export type GameStatus = 'MENU' | 'PLAYING' | 'GAME_OVER_BANKRUPT' | 'GAME_OVER_INSANE' | 'VICTORY';