import React from 'react';
import type { PlayerStats, Upgrade } from '../types';
import { PotionIcon, CauldronIcon, StarIcon, TrophyIcon, ACHIEVEMENTS, StopwatchIcon, CHALLENGES, formatNumber } from '../constants';

// Props interface
interface StatsModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: PlayerStats;
    cycles: number;
    cyclesPerClick: number;
    cyclesPerSecond: number;
    prestigePoints: number;
    prestigePointsToGain: number;
    upgrades: Upgrade[];
    unlockedAchievementsCount: number;
    completedChallengesCount: number;
}

// A generic component for a single statistic item
const StatItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between items-baseline py-2 border-b border-slate-600/50">
        <span className="text-slate-400">{label}</span>
        <span className="font-bold text-slate-100 font-mono text-lg">{typeof value === 'number' ? formatNumber(value) : value}</span>
    </div>
);

// A section header
const SectionHeader: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <h3 className="font-bold text-lg mb-2 text-pink-400 flex items-center gap-2">
        {children}
        {title}
    </h3>
);

const StatsModal: React.FC<StatsModalProps> = ({
    isOpen,
    onClose,
    stats,
    cycles,
    cyclesPerClick,
    cyclesPerSecond,
    prestigePoints,
    prestigePointsToGain,
    upgrades,
    unlockedAchievementsCount,
    completedChallengesCount
}) => {
    if (!isOpen) return null;

    const totalUpgradeLevels = upgrades.reduce((sum, u) => sum + u.level, 0);
    const buildingsOwned = upgrades.filter(u => u.type === 'auto' && u.level > 0).length;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && window.innerWidth >= 640) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-slate-900/70 flex items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm"
            onClick={handleBackdropClick}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-slate-800 w-full h-full sm:w-auto sm:h-auto sm:rounded-2xl shadow-xl sm:max-w-lg sm:max-h-[85vh] flex flex-col text-slate-200 border-slate-600/80 sm:border"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-700 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-slate-100">Estadísticas</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-red-500 transition-colors rounded-full w-8 h-8 flex items-center justify-center"
                        aria-label="Cerrar estadísticas"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6">
                    {/* General Section */}
                    <section>
                        <SectionHeader title="General"><CauldronIcon className="h-5 w-5" /></SectionHeader>
                        <div className="space-y-1">
                            <StatItem label="Esencia Actual" value={formatNumber(Math.floor(cycles))} />
                            <StatItem label="Esencia por Segundo" value={formatNumber(cyclesPerSecond)} />
                            <StatItem label="Esencia por Agitación" value={formatNumber(cyclesPerClick)} />
                            <StatItem label="Total de Esencia Ganada" value={formatNumber(Math.floor(stats.totalCyclesEarned))} />
                        </div>
                    </section>
                    
                    {/* Clicks Section */}
                    <section>
                        <SectionHeader title="Agitación y Clics"><PotionIcon className="h-5 w-5" /></SectionHeader>
                        <div className="space-y-1">
                            <StatItem label="Agitaciones Totales" value={formatNumber(stats.totalClicks)} />
                            <StatItem label="Gotas Doradas Atrapadas" value={formatNumber(stats.goldenDropletsClicked || 0)} />
                        </div>
                    </section>
                    
                    {/* Progress Section */}
                    <section>
                         <SectionHeader title="Progreso"><TrophyIcon className="h-5 w-5" /></SectionHeader>
                         <div className="space-y-1">
                            <StatItem label="Logros Desbloqueados" value={`${unlockedAchievementsCount} / ${ACHIEVEMENTS.length}`} />
                            <StatItem label="Desafíos Completados" value={`${completedChallengesCount} / ${CHALLENGES.length}`} />
                            <StatItem label="Niveles de Mejora Totales" value={formatNumber(totalUpgradeLevels)} />
                            <StatItem label="Edificios de Laboratorio" value={formatNumber(buildingsOwned)} />
                        </div>
                    </section>
                    
                    {/* Prestige Section */}
                    <section>
                        <SectionHeader title="Prestigio"><StarIcon className="h-5 w-5" /></SectionHeader>
                        <div className="space-y-1">
                             <StatItem label="Puntos de Prestigio Actuales" value={formatNumber(prestigePoints)} />
                             <StatItem label="PP al reiniciar" value={formatNumber(prestigePointsToGain)} />
                             <StatItem label="Total de PP Ganados" value={formatNumber(stats.totalPrestigePointsEver)} />
                             <StatItem label="Veces prestigiadas" value={formatNumber(stats.totalPrestiges || 0)} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default StatsModal;