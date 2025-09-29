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
  maxLevel: number;
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
  sfxEnabled: boolean;
  sfxVolume: number;
  musicEnabled: boolean;
  musicVolume: number;
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
  totalPrestigePointsEver: number;
  totalPrestiges: number;
  goldenDropletsClicked: number;
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

export interface GoldenDropletType {
  id: number;
  x: number; // percentage
  y: number; // percentage
  status: 'visible' | 'clicked' | 'missed';
}

export type PrestigeBonus = 
    | { type: 'all_cycles_multiplier'; value: number }
    | { type: 'starting_cycles'; value: number }
    | { type: 'cps_to_click_synergy'; value: number }
    | { type: 'increase_max_level'; upgradeIds: string[]; amount: number }
    | { type: 'increase_power_multiplier'; upgradeIds: string[]; multiplier: number };

export interface PrestigeUpgrade {
  id: string;
  name: string;
  description: (level: number) => string;
  cost: (level: number) => number;
  level: number;
  maxLevel?: number;
  bonus: PrestigeBonus;
  icon: React.ReactElement<{ className?: string }>;
  requires?: string;
}

export type SaveState = {
    cycles: number;
    upgrades: { id: string, level: number }[];
    milestoneIndex: number;
    stats: PlayerStats;
    unlockedAchievements: string[];
    prestigePoints: number;
    prestigeUpgrades: { id: string, level: number }[];
    lastLoginDate?: string;
    loginStreak?: number;
    completedChallenges: string[];
};

export type MobileView = 'main' | 'upgrades' | 'buildings' | 'progress';

export type DailyReward = {
    day: number;
    type: 'essence_minutes' | 'prestige_points' | 'click_boost' | 'bps_boost';
    value: number;
    duration?: number;
    icon: React.ReactElement<{ className?: string }>;
    name: string;
};

// New types for Challenges
export interface ChallengeObjective {
  type: 'earn_essence' | 'upgrade_level';
  value: number;
  upgradeId?: string;
}

export interface ChallengeReward {
  type: 'prestige_points';
  value: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  duration: number; // in seconds
  objective: ChallengeObjective;
  reward: ChallengeReward;
  icon: React.ReactElement<{ className?: string }>;
  unlockCondition: {
    type: 'prestiges';
    value: number;
  };
}

export interface ActiveChallengeState {
    challenge: Challenge;
    startTime: number;
    initialValue: number; // e.g., essence at start, or level at start
}

export interface ChallengeToastInfo {
  id: number;
  name: string;
  status: 'success' | 'failure';
  rewardDescription?: string;
}