import React from 'react';
import type { PlayerStats } from '../types';
import { StarIcon, PRESTIGE_REQUIREMENT, calculatePrestigePoints, formatNumber } from '../constants';

interface PrestigeTrackerProps {
  playerStats: PlayerStats;
  onPrestige: () => void;
  prestigePointBonus: number;
}

const PrestigeTracker: React.FC<PrestigeTrackerProps> = ({ playerStats, onPrestige, prestigePointBonus }) => {
  const progress = Math.min(100, (playerStats.totalCyclesEarned / PRESTIGE_REQUIREMENT) * 100);
  const pointsToGain = calculatePrestigePoints(playerStats.totalCyclesEarned, prestigePointBonus);
  const canPrestige = progress >= 100;

  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border-2 border-purple-500/50">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-3">
          <div className="text-purple-300">
            <StarIcon className="h-6 w-6" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-slate-100 text-lg leading-tight">Progreso de Prestigio</h3>
            <p className="text-slate-400 text-sm leading-tight">Reinicia para ganar bonificaciones poderosas.</p>
          </div>
        </div>
        <div className="text-center sm:text-right">
            <p className="text-sm text-slate-400">Ganancia:</p>
            <p className="font-bold text-purple-300 text-2xl leading-tight font-mono">
                +{formatNumber(pointsToGain)} PP
            </p>
        </div>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden border border-slate-600/80 mt-1 relative">
        <div
          className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
         <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs font-bold text-white" style={{textShadow: '0 1px 2px rgba(0,0,0,0.5)'}}>
                {formatNumber(Math.floor(playerStats.totalCyclesEarned))} / {formatNumber(PRESTIGE_REQUIREMENT)}
            </p>
        </div>
      </div>
      <button
        onClick={onPrestige}
        disabled={!canPrestige}
        className={`w-full mt-3 text-base font-bold py-3 px-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 active:scale-95 text-center text-white
            ${canPrestige
                ? 'bg-purple-600 hover:bg-purple-700 button-affordable-glow' 
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
      >
        Prestigiar Ahora
      </button>
    </div>
  );
};

export default PrestigeTracker;