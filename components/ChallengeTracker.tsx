import React, { useState, useEffect } from 'react';
import type { ActiveChallengeState, Upgrade } from '../types';
import { StopwatchIcon } from '../constants';

interface ChallengeTrackerProps {
  activeChallenge: ActiveChallengeState;
  cycles: number;
  upgrades: Upgrade[];
  onAbandon: () => void;
}

const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const ChallengeTracker: React.FC<ChallengeTrackerProps> = ({ activeChallenge, cycles, upgrades, onAbandon }) => {
    const { challenge, startTime, initialValue } = activeChallenge;

    const [remainingTime, setRemainingTime] = useState(challenge.duration * 1000);

    useEffect(() => {
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            setRemainingTime(challenge.duration * 1000 - elapsed);
        }, 100);
        return () => clearInterval(interval);
    }, [startTime, challenge.duration]);

    const { current, target, percent } = (() => {
        if (challenge.objective.type === 'earn_essence') {
            const current = cycles - initialValue;
            const target = challenge.objective.value;
            return { current, target, percent: Math.min(100, (current / target) * 100) };
        }
        if (challenge.objective.type === 'upgrade_level') {
            const upg = upgrades.find(u => u.id === challenge.objective.upgradeId);
            const current = upg ? upg.level : 0;
            const target = challenge.objective.value;
            return { current, target, percent: Math.min(100, (current / target) * 100) };
        }
        return { current: 0, target: 1, percent: 0 };
    })();

    return (
        <div className="w-full bg-slate-900/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border-2 border-pink-500/50 animate-pulse-subtle">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                    <div className="text-pink-400">
                        <StopwatchIcon />
                    </div>
                    <div className="text-center sm:text-left">
                        <h3 className="font-semibold text-slate-100 text-lg leading-tight">Challenge: {challenge.name}</h3>
                        <p className="text-slate-400 text-sm leading-tight">{challenge.description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <div className="text-center sm:text-right">
                        <p className="font-bold text-pink-300 text-3xl leading-tight font-mono">{formatTime(remainingTime)}</p>
                    </div>
                    <button onClick={onAbandon} className="text-xs font-bold text-slate-400 hover:text-red-400 bg-slate-700/50 hover:bg-red-900/30 px-3 py-1.5 rounded-md transition-colors">
                        Abandon
                    </button>
                </div>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden border border-slate-600/80 mt-1 relative">
                <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${percent}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs font-bold text-white text-shadow">{Math.floor(current).toLocaleString()} / {target.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default ChallengeTracker;
