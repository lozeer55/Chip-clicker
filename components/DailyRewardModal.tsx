import React from 'react';
import { DAILY_REWARDS, CauldronIcon, PotionIcon, LightningIcon, StarIcon } from '../constants';
import type { DailyReward } from '../types';

interface DailyRewardModalProps {
    isOpen: boolean;
    onClaim: () => void;
    streak: number;
}

const RewardItem: React.FC<{ reward: DailyReward; isCurrent: boolean; }> = ({ reward, isCurrent }) => {
    
    let description = '';
    switch (reward.type) {
        case 'essence_minutes':
            description = `${reward.value} mins of EPS`;
            break;
        case 'prestige_points':
            description = `${reward.value} Prestige Points`;
            break;
        case 'click_boost':
            description = `${reward.value}x Clicks for ${reward.duration}s`;
            break;
        case 'bps_boost':
            description = `${reward.value}x EPS for ${reward.duration}s`;
            break;
    }

    return (
        <div className={`relative p-2 sm:p-3 text-center rounded-xl border-2 transition-all duration-300
            ${isCurrent ? 'bg-pink-900/40 border-pink-500 sm:scale-105 shadow-lg shadow-pink-500/20' : 'bg-slate-700/50 border-slate-600'}
        `}>
            <p className="font-bold text-sm text-slate-300">Day {reward.day}</p>
            <div className={`my-1 sm:my-2 flex justify-center text-2xl sm:text-4xl ${isCurrent ? 'text-pink-300' : 'text-slate-400'}`}>
                {React.cloneElement(reward.icon, { className: 'w-8 h-8' })}
            </div>
            <h5 className="font-semibold text-slate-100 leading-tight text-xs sm:text-sm">{reward.name}</h5>
            <p className="text-xs text-slate-400 mt-1">{description}</p>
        </div>
    )
};


const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ isOpen, onClaim, streak }) => {
    if (!isOpen) return null;

    const currentDayIndex = (streak - 1) % DAILY_REWARDS.length;
    const currentDayForClaim = ((streak - 1) % 7) + 1;


    return (
        <div
            className="fixed inset-0 bg-slate-900/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-slate-800 rounded-2xl shadow-xl p-4 sm:p-6 w-full sm:max-w-2xl text-slate-200 border border-slate-600/80 animate-fade-in-scale">
                <div className="text-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">Daily Login Reward</h2>
                    <p className="text-pink-300 font-semibold text-base sm:text-lg mt-1">
                        Your streak: <span className="font-mono">{streak} Day{streak > 1 ? 's' : ''}</span>!
                    </p>
                    <p className="text-slate-400 text-sm mt-1">Come back every day for better rewards. Missing a day will reset your streak.</p>
                </div>

                <div className="grid grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
                    {DAILY_REWARDS.map((reward, index) => (
                        <RewardItem 
                            key={reward.day}
                            reward={reward}
                            isCurrent={index === currentDayIndex}
                        />
                    ))}
                </div>
                
                <button
                    onClick={onClaim}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 text-lg rounded-lg shadow-sm hover:shadow-md transition-all duration-150 active:scale-95 button-affordable-glow"
                >
                    Claim Reward for Day {currentDayForClaim}
                </button>
            </div>
        </div>
    );
};

export default DailyRewardModal;