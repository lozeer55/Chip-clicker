import React from 'react';
import type { Achievement, PlayerStats, Upgrade } from '../types';
import { INITIAL_UPGRADES } from '../constants';

// Helper function to calculate achievement progress
const getProgress = (
  achievement: Achievement,
  playerStats: PlayerStats,
  upgrades: Upgrade[],
): { current: number; target: number; percent: number } => {
  const { condition } = achievement;
  let current = 0;
  let target = 1;

  switch (condition.type) {
    case 'totalClicks':
      current = playerStats.totalClicks;
      target = condition.value;
      break;
    case 'totalCycles':
      current = playerStats.totalCyclesEarned;
      target = condition.value;
      break;
    case 'specificUpgradeLevel':
      const upgrade = upgrades.find(u => u.id === condition.upgradeId);
      current = upgrade?.level || 0;
      target = condition.value;
      break;
    case 'anyUpgradeLevel':
      const ownedUpgrades = INITIAL_UPGRADES.filter(initialUpgrade => {
        const currentUpgrade = upgrades.find(u => u.id === initialUpgrade.id);
        return currentUpgrade && currentUpgrade.level >= condition.value;
      }).length;
      current = ownedUpgrades;
      target = INITIAL_UPGRADES.length;
      break;
  }
  
  target = Math.max(target, 1);
  const percent = Math.min(100, (current / target) * 100);
  return { current, target, percent };
};


interface AchievementItemProps {
  achievement: Achievement;
  isUnlocked: boolean;
  progress: { current: number; target: number; percent: number };
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement, isUnlocked, progress }) => {
  const showProgressBar = !isUnlocked && progress.percent > 0;
  
  return (
    <li className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${isUnlocked ? 'bg-green-900/30 border-green-700/50 shadow-sm' : 'bg-slate-700/50 border-slate-600/80'}`}>
      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${isUnlocked ? 'bg-green-800/50 text-green-300' : 'bg-slate-600/80 text-slate-400'}`}>
        {/* FIX: Removed type assertion. The `achievement.icon` type has been corrected in `types.ts` to be `React.ReactElement`, which resolves the `React.cloneElement` overload error. */}
        {React.cloneElement(achievement.icon, { className: 'h-8 w-8' })}
      </div>
      <div className="flex-grow">
        <h4 className={`font-bold ${isUnlocked ? 'text-green-200' : 'text-slate-200'}`}>{achievement.name}</h4>
        <p className={`text-sm ${isUnlocked ? 'text-green-300/90' : 'text-slate-400'}`}>{achievement.description}</p>
        {showProgressBar && (
           <div className="mt-2">
               <div className="w-full bg-slate-600 rounded-full h-2.5">
                   <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress.percent}%` }}></div>
               </div>
               <p className="text-xs text-slate-400 text-right mt-1 font-mono">{progress.current.toLocaleString()} / {progress.target.toLocaleString()}</p>
           </div>
        )}
      </div>
    </li>
  );
};

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  unlockedAchievements: Set<string>;
  playerStats: PlayerStats;
  upgrades: Upgrade[];
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose, achievements, unlockedAchievements, playerStats, upgrades }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-2xl h-[80vh] flex flex-col text-slate-200 border border-slate-600/80"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-100">Achievements</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition-colors rounded-full w-8 h-8 flex items-center justify-center"
            aria-label="Close achievements"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto -mr-3 pr-3">
          <ul className="space-y-3">
            {achievements.map(ach => {
              const isUnlocked = unlockedAchievements.has(ach.id);
              const progress = getProgress(ach, playerStats, upgrades);
              return (
                <AchievementItem
                  key={ach.id}
                  achievement={ach}
                  isUnlocked={isUnlocked}
                  progress={progress}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;