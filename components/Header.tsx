import React from 'react';
import { formatNumber, GalaxyIcon, StopwatchIcon, AchievementIcon, ChartBarIcon, SettingsIcon } from '../constants';

interface HeaderProps {
    cycles: number;
    cyclesPerSecond: number;
    onOpenPrestige: () => void;
    onOpenChallenges: () => void;
    onOpenAchievements: () => void;
    onOpenStats: () => void;
    onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = (props) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-30 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/80 lg:hidden h-20">
            <div className="px-4 py-2 flex items-center justify-between h-full">
                {/* Cycles Display */}
                <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-pink-400 to-purple-400 tracking-tighter font-mono truncate">
                        {formatNumber(Math.floor(props.cycles))}
                    </h1>
                    <p className="text-slate-400 font-medium text-sm tracking-wide font-mono">
                        {formatNumber(props.cyclesPerSecond)} EPS
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                    <button onClick={props.onOpenPrestige} className="p-2 rounded-full text-slate-300 hover:bg-slate-700 active:scale-95" aria-label="Open Prestige Tree"><GalaxyIcon className="h-6 w-6" /></button>
                    <button onClick={props.onOpenChallenges} className="p-2 rounded-full text-slate-300 hover:bg-slate-700 active:scale-95" aria-label="Open Challenges"><StopwatchIcon className="h-6 w-6" /></button>
                    <button onClick={props.onOpenAchievements} className="p-2 rounded-full text-slate-300 hover:bg-slate-700 active:scale-95" aria-label="Open Achievements"><AchievementIcon /></button>
                    <button onClick={props.onOpenStats} className="p-2 rounded-full text-slate-300 hover:bg-slate-700 active:scale-95" aria-label="Open Statistics"><ChartBarIcon /></button>
                    <button onClick={props.onOpenSettings} className="p-2 rounded-full text-slate-300 hover:bg-slate-700 active:scale-95" aria-label="Open Settings"><SettingsIcon /></button>
                </div>
            </div>
        </header>
    );
};

export default Header;
