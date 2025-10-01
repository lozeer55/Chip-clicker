import React, { useState } from 'react';
import type { PrestigeUpgrade } from '../types';
import PrestigeTreeView from './PrestigeTreeView';
import { StarIcon, formatNumber } from '../constants';

interface PrestigeModalProps {
    isOpen: boolean;
    onClose: () => void;
    prestigePoints: number;
    prestigeUpgrades: PrestigeUpgrade[];
    onPurchase: (id: string) => void;
}

const PrestigeModal: React.FC<PrestigeModalProps> = ({ isOpen, onClose, prestigePoints, prestigeUpgrades, onPurchase }) => {
    if (!isOpen) return null;

    const [confirmingUpgrade, setConfirmingUpgrade] = useState<PrestigeUpgrade | null>(null);

    const handleRequestPurchase = (upgradeId: string) => {
        const upgrade = prestigeUpgrades.find(u => u.id === upgradeId);
        if (upgrade) {
            setConfirmingUpgrade(upgrade);
        }
    };

    const handleConfirmPurchase = () => {
        if (confirmingUpgrade) {
            onPurchase(confirmingUpgrade.id);
            setConfirmingUpgrade(null);
        }
    };
    
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
                    onRequestPurchase={handleRequestPurchase}
                />
                
                {confirmingUpgrade && (
                    <div 
                        className="absolute inset-0 bg-slate-900/60 z-10 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setConfirmingUpgrade(null)}
                    >
                        <div 
                            className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-600 w-full max-w-md animate-fade-in-scale"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-bold text-slate-100 text-center mb-4">Confirmar Compra</h3>
                            
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-purple-800/50 text-slate-200 border-2 border-purple-600">
                                    {React.cloneElement(confirmingUpgrade.icon, { className: 'h-8 w-8' })}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h4 className="font-bold text-slate-200 truncate">{confirmingUpgrade.name}</h4>
                                    <p className="text-sm text-slate-400">{confirmingUpgrade.description(confirmingUpgrade.level)}</p>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-slate-700/50 rounded-lg text-center">
                                <p className="text-slate-400 text-sm">Costo:</p>
                                <p className="text-xl font-bold font-mono text-purple-300">
                                    {formatNumber(confirmingUpgrade.cost(confirmingUpgrade.level))} Puntos de Prestigio
                                </p>
                            </div>
                            
                            <div className="flex gap-4 mt-6">
                                <button 
                                    onClick={() => setConfirmingUpgrade(null)}
                                    className="w-full text-base font-bold py-3 px-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 active:scale-95 bg-slate-600 hover:bg-slate-500 text-white"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleConfirmPurchase}
                                    className="w-full text-base font-bold py-3 px-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 active:scale-95 bg-purple-600 hover:bg-purple-700 text-white button-affordable-glow"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrestigeModal;