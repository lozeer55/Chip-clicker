import React, { useState, useEffect, useMemo } from 'react';
import type { FloatingNumberType, ActiveBoost } from '../types';
import FloatingNumber from './FloatingNumber';
import { LightningIcon, formatNumber } from '../constants';

interface GameAreaProps {
  cycles: number;
  cyclesPerClick: number;
  cyclesPerSecond: number;
  onChipClick: (e: React.MouseEvent<HTMLElement>) => void;
  floatingNumbers: FloatingNumberType[];
  onAnimationEnd: (id: number) => void;
  activeBoosts: ActiveBoost[];
}

const PotionFlaskSVG: React.FC<{ onClick: (e: React.MouseEvent<HTMLElement>) => void; isBoostActive: boolean }> = ({ onClick, isBoostActive }) => {
    const [animationClass, setAnimationClass] = useState('');

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        setAnimationClass('animate-chip-press');
        onClick(e);
    };

    return (
    <div
        className={`relative w-48 h-48 sm:w-64 sm:h-64 lg:w-full lg:h-auto lg:max-w-xs cursor-pointer animate-pulse-subtle ${isBoostActive ? 'animate-boost-glow' : ''}`}
        onClick={handleClick}
        aria-label="Click to generate essence"
    >
        <svg 
            viewBox="0 0 256 256" 
            xmlns="http://www.w3.org/2000/svg" 
            onAnimationEnd={() => setAnimationClass('')}
            className={`w-full h-full drop-shadow-[0_10px_8px_rgba(0,0,0,0.25)] hover:drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)] ${animationClass}`}
        >
            <defs>
                <radialGradient id="liquidGlow" cx="50%" cy="70%" r="50%" fx="50%" fy="70%">
                    <stop offset="0%" style={{stopColor: '#f472b6', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#a855f7', stopOpacity: 1}} />
                </radialGradient>
                 <linearGradient id="glassReflection" x1="0.2" y1="0.2" x2="0.8" y2="0.8">
                    <stop offset="0%" stopColor="white" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="white" stopOpacity="0.1"/>
                </linearGradient>
            </defs>
            
            <g>
                {/* Liquid */}
                <path d="M192,112.9V208a8,8,0,0,1-8,8H72a8,8,0,0,1-8-8V112.9a64,64,0,1,1,128,0Z" fill="url(#liquidGlow)" />
                {/* Liquid surface */}
                <path d="M 68 115 C 90 100, 166 100, 188 115" stroke="#f472b6" strokeWidth="4" fill="transparent" />
                
                {/* Glass */}
                <path d="M192,112.9V216a8,8,0,0,1-8,8H72a8,8,0,0,1-8-8V112.9a64,64,0,1,1,128,0Z" fill="white" fillOpacity="0.2" stroke="white" strokeOpacity="0.7" strokeWidth="8"/>
                
                {/* Neck */}
                <line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="8" strokeLinecap="round"/>
                
                {/* Stopper */}
                <rect x="96" y="24" width="64" height="24" rx="4" fill="#a16207" stroke="#78350f" strokeWidth="4" />
                
                {/* Highlight */}
                <path d="M160 120 A 50 80 0 0 1 140 200" fill="none" stroke="url(#glassReflection)" strokeWidth="12" strokeLinecap="round" />
            </g>
        </svg>
    </div>
)};


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
        if (boost.source === 'Golden Droplet!') return 'Overclock!';
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
                            {boost.multiplier}x {boost.type === 'click_multiplier' ? 'Stirs' : 'EPS'}
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
  const isClickBoostActive = useMemo(() => activeBoosts.some(b => b.type === 'click_multiplier'), [activeBoosts]);
  const isCpsBoostActive = useMemo(() => activeBoosts.some(b => b.type === 'bps_multiplier'), [activeBoosts]);

  return (
    <div className="bg-slate-900/50 rounded-2xl shadow-inner border border-slate-700/50 p-4 sm:p-6 flex flex-col items-center justify-between gap-4 h-full">
        {/* Top Section */}
        <div className="text-center w-full flex-shrink-0">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight hidden lg:block">
                Elixir Clicker
            </h1>
            <div className="mt-2">
                <h2 className="text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-pink-400 to-purple-400 tracking-tighter font-mono" style={{textShadow: '0 0 15px rgba(219, 39, 119, 0.4)'}}>
                    {formatNumber(Math.floor(cycles))}
                </h2>
                <p className="text-slate-400 font-medium text-lg tracking-wide">esencia</p>
            </div>
        </div>

        {/* Middle Section with Boost and Clicker */}
        <div className="relative flex-grow flex flex-col items-center justify-center w-full">
            {activeBoosts.length > 0 && (
                <div className="w-full max-w-sm mb-2 space-y-1">
                    {activeBoosts.map(boost => <ActiveBoostItem key={boost.id} boost={boost} />)}
                </div>
            )}
            <div className="relative">
                <PotionFlaskSVG onClick={onChipClick} isBoostActive={isClickBoostActive} />
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
                <p className="text-sm font-medium text-slate-400">por Agitación</p>
                <strong className={`text-2xl font-bold text-slate-100 tracking-tight font-mono transition-all ${isClickBoostActive ? 'animate-cps-boost-glow' : ''}`}>
                    {formatNumber(cyclesPerClick)}
                </strong>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-center">
                <p className="text-sm font-medium text-slate-400">por Segundo</p>
                <strong className={`text-2xl font-bold text-slate-100 tracking-tight font-mono transition-all ${isCpsBoostActive ? 'animate-cps-boost-glow' : ''}`}>
                    {formatNumber(cyclesPerSecond)}
                </strong>
            </div>
        </div>
    </div>
  );
};

export default GameArea;