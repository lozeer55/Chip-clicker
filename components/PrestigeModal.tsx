import React from 'react';
import type { PrestigeUpgrade } from '../types';
import PrestigeTreeView from './PrestigeTreeView';
import { StarIcon } from '../constants';

interface PrestigeModalProps {
    isOpen: boolean;
    onClose: () => void;
    prestigePoints: number;
    prestigeUpgrades: PrestigeUpgrade[];
    onPurchase: (id: string) => void;
}

const PrestigeModal: React.FC<PrestigeModalProps> = ({ isOpen, onClose, prestigePoints, prestigeUpgrades, onPurchase }) => {
    if (!isOpen) return null;
    
    // The modal takes over the screen, so we can use a fragment here.
    return (
        <div 
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex flex-col p-4"
            aria-modal="true"
            role="dialog"
        >
            <div className="relative flex-shrink-0 flex items-center justify-between mb-4">
                 <div className="flex items-center gap-4 bg-slate-900/70 border border-slate-700 rounded-full p-2 pr-4 shadow-lg">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-500/20 text-purple-300">
                        <StarIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-2xl font-bold font-mono text-slate-100">{prestigePoints.toLocaleString()}</span>
                        <p className="text-xs text-slate-400 -mt-1">Prestige Points</p>
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-3xl font-bold text-slate-100" style={{textShadow: '0 0 10px rgba(192, 132, 252, 0.5)'}}>Celestial Tree</h2>
                </div>
                
                <button
                    onClick={onClose}
                    className="text-slate-400 bg-slate-900/70 border border-slate-700 hover:text-red-500 transition-colors rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
                    aria-label="Close Prestige Tree"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="flex-grow bg-slate-800/50 rounded-2xl shadow-inner border border-slate-700/50 overflow-hidden relative">
                <PrestigeTreeView
                    prestigeUpgrades={prestigeUpgrades}
                    prestigePoints={prestigePoints}
                    onPurchase={onPurchase}
                />
            </div>
        </div>
    );
};

export default PrestigeModal;
