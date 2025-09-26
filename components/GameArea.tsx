import React, { useState, useEffect } from 'react';
import type { FloatingNumberType, ActiveBoost } from '../types';
import FloatingNumber from './FloatingNumber';
import { LightningIcon } from '../constants';

interface GameAreaProps {
  cycles: number;
  cyclesPerClick: number;
  cyclesPerSecond: number;
  onChipClick: (e: React.MouseEvent<HTMLElement>) => void;
  floatingNumbers: FloatingNumberType[];
  onAnimationEnd: (id: number) => void;
  activeBoosts: ActiveBoost[];
}

const ChipSVG: React.FC<{ onClick: (e: React.MouseEvent<HTMLElement>) => void; isBoostActive: boolean }> = ({ onClick, isBoostActive }) => (
    <div
        className={`relative w-48 h-48 sm:w-64 sm:h-64 lg:w-full lg:h-auto lg:max-w-xs cursor-pointer group animate-pulse-subtle ${isBoostActive ? 'animate-boost-glow' : ''}`}
        onClick={onClick}
        aria-label="Click to generate cycles"
    >
        <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-100 group-active:scale-95 drop-shadow-[0_10px_8px_rgba(0,0,0,0.25)] group-hover:drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)]">
            <defs>
                <radialGradient id="chipGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style={{stopColor: '#f472b6', stopOpacity: 0.6}} />
                    <stop offset="100%" style={{stopColor: '#d946ef', stopOpacity: 0}} />
                </radialGradient>
            </defs>
            <rect width="256" height="256" fill="none"/>
            <rect x="40" y="40" width="176" height="176" rx="8" stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="#1e293b"/>
            <rect x="88" y="88" width="80" height="80" stroke="#a855f7" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="#334155"/>
            <rect x="88" y="88" width="80" height="80" fill="url(#chipGlow)" />
            <line x1="168" y1="56" x2="200" y2="56" fill="none" stroke="#94a3b8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/>
            <line x1="168" y1="88" x2="200" y2="88" fill="none" stroke="#94a3b8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/>
            <line x1="168" y1="120" x2="200" y2="120" fill="none" stroke="#94a3b8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/>
            <line x1="168" y1="152" x2="200" y2="152" fill="none" stroke="#94a3b8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/>
            <line x1="168" y1="184" x2="200" y2="184" fill="none" stroke="#94a3b8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/>
            <line x1="56" y1="88" x2="88" y2="88" fill="none" stroke="#94a3b8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/>
            <line x1="56" y1="120" x2="88" y2="120" fill="none" stroke="#94a3b8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/>
            <line x1="56" y1="152" x2="88" y2="152" fill="none" stroke="#94a3b8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/>
            <line x1="56" y1="184" x2="88" y2="184" fill="none" stroke="#94a3b8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/>
            <line x1="56" y1="56" x2="88" y2="56" fill="none" stroke="#94a3b8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/>
        </svg>
    </div>
);

const ActiveBoostItem: React.FC<{ boost: ActiveBoost }> = ({ boost }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const updateTimer = () => {
            const remaining = Math.max(0, Math.ceil((boost.endTime - Date.now()) / 1000));
            setTimeLeft(remaining);
        };
        updateTimer();
        const interval = setInterval(updateTimer, 500);
        return () => clearInterval(interval);
    }, [boost.endTime]);

    const getBoostTitle = () => {
        if (boost.source === 'Golden Chip!') return 'Overclock!';
        if (boost.source.startsWith('Milestone')) return boost.type === 'click_multiplier' ? 'Click Frenzy!' : 'Processing Rush!';
        return 'Boost Active!';
    };

    if (timeLeft <= 0) return null;

    return (
        <div className="w-full p-2 bg-pink-500/10 border border-pink-400/20 rounded-lg shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="text-pink-400 flex-shrink-0"><LightningIcon /></div>
                    <div>
                        <h4 className="font-bold text-pink-300 text-sm leading-tight">{getBoostTitle()}</h4>
                        <p className="text-xs text-pink-400 leading-tight">
                            {boost.multiplier}x {boost.type === 'click_multiplier' ? 'Clicks' : 'CPS'}
                        </p>
                    </div>
                </div>
                <div className="text-xl font-bold text-pink-200 font-mono">{timeLeft}s</div>
            </div>
        </div>
    );
};


const GameArea: React.FC<GameAreaProps> = ({
  cycles,
  cyclesPerClick,
  cyclesPerSecond,
  onChipClick,
  floatingNumbers,
  onAnimationEnd,
  activeBoosts,
}) => {
  const isBoostActive = activeBoosts.length > 0;

  return (
    <div className="bg-slate-900/50 rounded-2xl shadow-inner border border-slate-700/50 p-4 sm:p-6 flex flex-col items-center justify-between gap-4 h-full">
        {/* Top Section */}
        <div className="text-center w-full flex-shrink-0">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight hidden lg:block">
                Chip Clicker
            </h1>
            <div className="mt-2">
                <h2 className="text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-pink-400 to-purple-400 tracking-tighter font-mono" style={{textShadow: '0 0 15px rgba(219, 39, 119, 0.4)'}}>
                    {Math.floor(cycles).toLocaleString()}
                </h2>
                <p className="text-slate-400 font-medium text-lg tracking-wide">cycles</p>
            </div>
        </div>

        {/* Middle Section with Boost and Clicker */}
        <div className="relative flex-grow flex flex-col items-center justify-center w-full">
            {isBoostActive && (
                <div className="w-full max-w-sm mb-2 space-y-1">
                    {activeBoosts.map(boost => <ActiveBoostItem key={boost.id} boost={boost} />)}
                </div>
            )}
            <div className="relative">
                <ChipSVG onClick={onChipClick} isBoostActive={isBoostActive} />
                {floatingNumbers.map((num) => (
                <FloatingNumber
                    key={num.id}
                    value={num.value}
                    x={num.x}
                    y={num.y}
                    onAnimationEnd={() => onAnimationEnd(num.id)}
                    isBoosted={num.isBoosted}
                />
                ))}
            </div>
        </div>

        {/* Bottom Section with Stats */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto flex-shrink-0">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-center">
                <p className="text-sm font-medium text-slate-400">per Click</p>
                <strong className="text-2xl font-bold text-slate-100 tracking-tight font-mono">{cyclesPerClick.toLocaleString()}</strong>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-center">
                <p className="text-sm font-medium text-slate-400">per Second</p>
                <strong className="text-2xl font-bold text-slate-100 tracking-tight font-mono">{cyclesPerSecond.toLocaleString()}</strong>
            </div>
        </div>
    </div>
  );
};

export default GameArea;