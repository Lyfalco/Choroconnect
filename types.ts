import { LucideIcon } from 'lucide-react';

export type Rotation = number;

export type LanguageCode = 'en' | 'tr' | 'es' | 'fr' | 'ar' | 'ja' | 'ko' | 'zh';

export interface TimePieceData {
  id: string;
  labelKey: string;
  descriptionKey: string;
  icon: LucideIcon;
  correctIndex: number;
  entryPoint: string;
  exitPoint: string;
}

export interface GamePieceInstance extends TimePieceData {
  instanceId: string;
  currentRotation: Rotation;
}

export interface LevelData {
  id: number;
  nameKey: string;
  pieces: TimePieceData[];
  starThresholds: number[]; // [Time for 3 stars, Time for 2 stars]
}

export interface LevelProgress {
  levelId: number;
  stars: number;
  bestTime: number | null;
  unlocked: boolean;
}

// New Interface for Scalable Save Data
export interface SaveDataSchema {
  version: number;
  lastPlayedLevelId: number;
  levels: Record<number, LevelProgress>; // Map by ID instead of Array index
}

export type GameState = 'MENU' | 'PLAYING' | 'VICTORY' | 'LEVEL_SELECT';