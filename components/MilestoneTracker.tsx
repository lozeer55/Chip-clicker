import React from 'react';
import type { Milestone, PlayerStats } from '../types';
import { TrophyIcon } from '../constants';

interface MilestoneTrackerProps {
  currentMilestone: Milestone | null;
  playerStats: PlayerStats;
}

const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ currentMilestone, playerStats }) => {
  if (!currentMilestone) {
    return (
       <div className="w-full bg-slate-900/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-700/80 flex items-center justify-center gap-4">
            <div className="text-pink-300">
                <TrophyIcon />
            </div>
            <div className="text-center">
                <h3 className="font-bold text-slate-100 text-lg">All Milestones Achieved!</h3>
                <p className="text-slate-400 text-sm">You are the ultimate Grand Alchemist!</p>
            </div>
        </div>
    );
  }

  const progress = Math.min(100, (playerStats.xp / currentMilestone.xpRequired) * 100);

  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-700/80">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="text-pink-400">
            <TrophyIcon />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-slate-100 text-lg leading-tight">Next: {currentMilestone.name}</h3>
            <p className="text-slate-400 text-sm leading-tight">Reward: <span className="font-semibold">{currentMilestone.reward.multiplier}x {currentMilestone.reward.type === 'click_multiplier' ? 'stirs' : 'EPS'} for {currentMilestone.reward.duration}s</span></p>
          </div>
        </div>
        <div className="text-center sm:text-right">
            <p className="font-bold text-slate-200 text-lg leading-tight font-mono">{Math.floor(playerStats.xp).toLocaleString()} / {currentMilestone.xpRequired.toLocaleString()} XP</p>
        </div>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden border border-slate-600/80 mt-1">
        <div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MilestoneTracker;