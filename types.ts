// FIX: Imported React to resolve "Cannot find namespace 'React'" error.
import React from 'react';

export type UpgradeType = 'click' | 'auto';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costGrowth: number;
  level: number;
  type: UpgradeType;
  power: number;
  // FIX: Changed icon type to be a ReactElement that accepts a className prop to allow props to be passed via React.cloneElement without type errors.
  icon: React.ReactElement<{ className?: string }>;
}

export interface UpgradeTier {
  name: string;
  upgrades: Upgrade[];
  unlockCondition: {
    type: 'totalLevels';
    requiredLevels: number;
  } | {
    type: 'none';
  };
}

export interface FloatingNumberType {
  id: number;
  value: number;
  x: number;
  y: number;
  isBoosted?: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  volume: number;
  showFloatingNumbers: boolean;
  showParticles: boolean;
  showBackgroundEffects: boolean;
}

export interface Milestone {
  name:string;
  xpRequired: number;
  reward: {
    type: 'click_multiplier' | 'bps_multiplier';
    multiplier: number;
    duration: number; // in seconds
  };
}

export interface ActiveBoost {
  id: number;
  type: 'click_multiplier' | 'bps_multiplier';
  multiplier: number;
  endTime: number; // timestamp
  source: string;
}

export interface MilestoneToastInfo {
  id: number;
  name: string;
  rewardDescription: string;
}

// New types for Achievements
export interface PlayerStats {
  totalClicks: number;
  totalCyclesEarned: number;
  xp: number;
}

export type AchievementCondition = 
  | { type: 'totalClicks'; value: number }
  | { type: 'totalCycles'; value: number }
  | { type: 'specificUpgradeLevel'; upgradeId: string; value: number }
  | { type: 'anyUpgradeLevel'; value: number };


export interface Achievement {
  id: string;
  name: string;
  description: string;
  // FIX: Changed icon type to be a ReactElement that accepts a className prop to allow props to be passed via React.cloneElement without type errors.
  icon: React.ReactElement<{ className?: string }>;
  condition: AchievementCondition;
}

export interface AchievementToastInfo {
  id: number;
  name: string;
  // FIX: Changed icon type to be a ReactElement that accepts a className prop to match the Achievement type and support React.cloneElement.
  icon: React.ReactElement<{ className?: string }>;
}

export interface GoldenChipType {
  id: number;
  x: number; // percentage
  y: number; // percentage
  status: 'visible' | 'clicked' | 'missed';
}

export type SaveState = {
    cycles: number;
    upgrades: { id: string, level: number }[];
    milestoneIndex: number;
    stats: PlayerStats;
    unlockedAchievements: string[];
};

export type MobileView = 'main' | 'upgrades' | 'buildings';