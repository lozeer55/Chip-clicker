import React, { useState, useMemo } from 'react';
import type { PrestigeUpgrade } from '../types';
import { LockIcon, formatNumber } from '../constants';

interface PrestigeNodeProps {
    upgrade: PrestigeUpgrade;
    prestigePoints: number;
    onPurchase: (id: string) => void;
    upgradesMap: Map<string, PrestigeUpgrade>;
}

const PrestigeNode: React.FC<PrestigeNodeProps> = ({ upgrade, prestigePoints, onPurchase, upgradesMap }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const isRequirementMet = useMemo(() => {
        if (!upgrade.requires) return true;
        const requiredUpgrade = upgradesMap.get(upgrade.requires);
        return requiredUpgrade ? requiredUpgrade.level > 0 : false;
    }, [upgrade.requires, upgradesMap]);
    
    const cost = upgrade.cost(upgrade.level);
    const isMaxed = upgrade.maxLevel !== undefined && upgrade.level >= upgrade.maxLevel;
    const canAfford = prestigePoints >= cost;
    const isUnlocked = isRequirementMet;
    const isAffordable = isUnlocked && !isMaxed && canAfford;
    const isPurchased = upgrade.level > 0;

    const getNodeClasses = () => {
        const base = "absolute w-14 h-14 rounded-full border-4 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200";
        if (!isUnlocked) return `${base} bg-slate-700 border-slate-600 cursor-not-allowed`;
        if (isMaxed) return `${base} bg-yellow-500/20 border-yellow-400`;
        if (isAffordable) return `${base} bg-purple-800/50 border-purple-400 upgrade-affordable-glow cursor-pointer`;
        if (isPurchased) return `${base} bg-purple-900/40 border-purple-600 cursor-pointer`;
        return `${base} bg-slate-800/80 border-slate-600 cursor-pointer`;
    };

    const getIconClasses = () => {
        const base = "h-8 w-8 transition-colors duration-200";
        if (!isUnlocked) return `${base} text-slate-500`;
        if (isMaxed) return `${base} text-yellow-300`;
        return `${base} text-slate-200`;
    };
    
    const handleNodeClick = (e: React.MouseEvent) => {
        // Stop propagation to prevent the tree view's pan behavior from firing
        e.stopPropagation();
        if (isAffordable) {
            onPurchase(upgrade.id);
        }
    };
    
    // Prevent mouse down from starting a pan
    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
    };


    return (
        <>
            <div
                className={getNodeClasses()}
                style={{ left: `${upgrade.x}%`, top: `${upgrade.y}%` }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleNodeClick}
                onMouseDown={handleMouseDown}
                aria-label={`Upgrade: ${upgrade.name}`}
            >
                {React.cloneElement(upgrade.icon, { className: getIconClasses() })}
                {isPurchased && (
                    <div className="absolute -bottom-2 -right-2 bg-slate-900 text-slate-100 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-600">
                        {upgrade.level}
                    </div>
                )}
            </div>

            {isHovered && (
                <div
                    className="absolute bg-slate-900 border-2 border-slate-600 rounded-lg shadow-2xl p-4 w-64 pointer-events-none transition-opacity duration-100"
                    style={{
                        left: `${upgrade.x}%`,
                        top: `${upgrade.y}%`,
                        transform: 'translate(3rem, -50%)', // Position tooltip to the right of the node
                        zIndex: 10
                    }}
                >
                    <h4 className="font-bold text-lg text-slate-100">{upgrade.name}</h4>
                    <p className="text-sm text-slate-400 mt-1">{upgrade.description(upgrade.level)}</p>
                    
                    <div className="mt-3 pt-3 border-t border-slate-700">
                        <div className="flex justify-between items-baseline">
                            <span className="text-slate-400 text-sm">Level:</span>
                            <span className="font-mono font-bold">{upgrade.level}{upgrade.maxLevel ? ` / ${upgrade.maxLevel}` : ''}</span>
                        </div>
                         <div className="flex justify-between items-baseline">
                            <span className="text-slate-400 text-sm">Cost:</span>
                             <span className={`font-mono font-bold ${canAfford ? 'text-purple-300' : 'text-red-400'}`}>
                                {isMaxed ? "MAX" : `${formatNumber(cost)} PP`}
                            </span>
                        </div>
                    </div>
                    
                    {!isUnlocked && (
                         <div className="mt-3 text-sm text-amber-400 flex items-center gap-2">
                             <LockIcon className="h-4 w-4 flex-shrink-0" />
                            <span>Requires previous upgrade.</span>
                         </div>
                    )}

                </div>
            )}
        </>
    );
};

export default React.memo(PrestigeNode);
