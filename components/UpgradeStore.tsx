import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { Upgrade, UpgradeTier } from '../types';
import { UPGRADE_TIERS, LockIcon } from '../constants';

interface UpgradeItemProps {
  upgrade: Upgrade;
  onPurchase: (id: string, levels: number) => void;
  cycles: number;
  buyAmount: number | 'max';
  isLocked: boolean;
  unlockMessage: string;
}

const UpgradeItem: React.FC<UpgradeItemProps> = ({ upgrade, onPurchase, cycles, buyAmount, isLocked, unlockMessage }) => {
  const calculateCost = useCallback((startLevel: number, numLevels: number) => {
    let totalCost = 0;
    const { baseCost, costGrowth } = upgrade;
    for (let i = 0; i < numLevels; i++) {
        totalCost += Math.floor(baseCost * Math.pow(costGrowth, startLevel + i));
    }
    return totalCost;
  }, [upgrade]);
  
  const maxLevelsToBuy = useMemo(() => {
    if (isLocked) return 0;
    let levels = 0;
    let remainingCycles = cycles;
    const { baseCost, costGrowth, level } = upgrade;

    while (true) {
        const nextLevelCost = Math.floor(baseCost * Math.pow(costGrowth, level + levels));
        if (remainingCycles >= nextLevelCost) {
            remainingCycles -= nextLevelCost;
            levels++;
        } else {
            break;
        }
    }
    return levels;
  }, [cycles, upgrade, isLocked]);

  const { levelsToBuy, totalCost, canAfford } = useMemo(() => {
    if (isLocked) return { levelsToBuy: 0, totalCost: 0, canAfford: false };

    if (buyAmount === 'max') {
        const levels = maxLevelsToBuy;
        const cost = calculateCost(upgrade.level, levels);
        return {
            levelsToBuy: levels,
            totalCost: cost,
            canAfford: levels > 0,
        };
    } else {
        const levels = buyAmount;
        const cost = calculateCost(upgrade.level, levels);
        return {
            levelsToBuy: levels,
            totalCost: cost,
            canAfford: cycles >= cost,
        };
    }
  }, [buyAmount, cycles, upgrade.level, calculateCost, maxLevelsToBuy, isLocked]);
  
  const singleLevelCost = useMemo(() => calculateCost(upgrade.level, 1), [upgrade.level, calculateCost]);
  
  const [animationClass, setAnimationClass] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [iconEffectKey, setIconEffectKey] = useState<number | null>(null);
  const [isCostHovered, setIsCostHovered] = useState(false);
  const prevCanAfford = useRef(!isLocked && cycles >= singleLevelCost);
  const prevLevel = useRef(upgrade.level);

  useEffect(() => {
    let animationName = '';
    let animationDuration = 0;

    if (upgrade.level > prevLevel.current) {
      animationName = 'animate-purchase-feedback';
      animationDuration = 600;
      setIconEffectKey(Date.now());
    } 
    else if (!isLocked && cycles >= singleLevelCost && !prevCanAfford.current) {
      animationName = 'animate-shine-pop';
      animationDuration = 600;
    }
    
    if (animationName) {
      setAnimationClass(animationName);
      const timer = setTimeout(() => {
        setAnimationClass('');
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [upgrade.level, cycles, singleLevelCost, isLocked]);

  useEffect(() => {
    prevLevel.current = upgrade.level;
    prevCanAfford.current = !isLocked && cycles >= singleLevelCost;
  });

  const handlePurchase = () => {
    if (canAfford && levelsToBuy > 0) {
      onPurchase(upgrade.id, levelsToBuy);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  if (isLocked) {
      const MysteryLockIcon = () => (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 256 256"><path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96v96a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96Z"/></svg>
      );
      return (
        <li className="rounded-xl p-3 bg-slate-800/40 border border-slate-700/50 opacity-60">
          <div className="w-full flex items-center gap-4 text-left h-[76px]">
            <div className="bg-slate-700/50 text-slate-500 p-3 rounded-lg flex-shrink-0 flex items-center justify-center w-[64px] h-[64px]">
              <MysteryLockIcon />
            </div>
            <div className="flex-grow min-w-0">
              <h4 className="font-semibold text-lg text-slate-400">??????????</h4>
              <p className="text-sm text-slate-500">Unlock to reveal</p>
            </div>
            <div className="text-right flex items-center gap-2 text-slate-500 flex-shrink-0 min-w-[120px] justify-end">
                <LockIcon />
                <span className="font-semibold text-sm text-right font-mono">{unlockMessage}</span>
            </div>
          </div>
        </li>
      );
  }

  return (
    <li className={`rounded-xl p-3 transition-all duration-200 bg-slate-800/60 hover:bg-slate-800/90 shadow-md hover:shadow-lg border border-slate-700/80 ${animationClass} ${isShaking ? 'animate-shake' : ''}`}>
      <div className="w-full flex items-center gap-4 text-left">
        <div className="relative bg-pink-500/10 text-pink-400 p-3 rounded-lg flex-shrink-0">
            {React.cloneElement(upgrade.icon, { className: 'h-10 w-10' })}
            {iconEffectKey && (
              <div
                key={iconEffectKey}
                className="absolute inset-0 flex items-center justify-center text-pink-400 animate-icon-purchase-effect pointer-events-none"
              >
                 {React.cloneElement(upgrade.icon, { className: 'h-10 w-10' })}
              </div>
            )}
        </div>
        <div className="flex-grow min-w-0">
          <h4 className="font-semibold text-lg text-slate-100 truncate">{upgrade.name}</h4>
          <p className="text-sm text-slate-400">{upgrade.description}</p>
          <div 
            className="relative mt-1 cursor-help w-fit"
            onMouseEnter={() => setIsCostHovered(true)}
            onMouseLeave={() => setIsCostHovered(false)}
          >
            <div className={`text-base font-semibold text-pink-400 transition-all font-mono tracking-tight ${canAfford ? 'animate-cost-glow' : ''}`}>
                Cost: {totalCost.toLocaleString()}
            </div>
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1 p-2 text-xs bg-slate-900 border border-slate-600 rounded-md text-slate-300 whitespace-nowrap transition-all duration-200 pointer-events-none ${isCostHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
                {buyAmount === 'max' ?
                    <span>Buys <strong className="font-mono">{levelsToBuy.toLocaleString()}</strong> level{levelsToBuy !== 1 ? 's' : ''}</span> :
                    <span>'Max' buys <strong className="font-mono">{maxLevelsToBuy.toLocaleString()}</strong> level{maxLevelsToBuy !== 1 ? 's' : ''}</span>
                }
            </div>
          </div>
        </div>
        <div className="text-right flex items-center gap-4 flex-shrink-0">
             <div className="flex items-baseline gap-1">
              <span className="text-sm text-slate-400 font-medium">LVL</span>
              <span className="text-3xl font-bold text-slate-200 font-mono">
                  {upgrade.level}
              </span>
            </div>
             <div className="w-[120px]">
                <button 
                    onClick={handlePurchase}
                    aria-label={`Purchase ${levelsToBuy} levels of ${upgrade.name}`}
                    className={`w-full text-base font-bold py-3 px-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 active:scale-95 text-center
                        ${canAfford 
                            ? 'bg-pink-600 hover:bg-pink-700 text-white button-affordable-glow' 
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                    disabled={!canAfford || levelsToBuy <= 0}
                >
                    Build <span className="font-mono">{buyAmount === 'max' ? levelsToBuy : buyAmount}x</span>
                </button>
             </div>
        </div>
      </div>
    </li>
  );
};


interface UpgradeStoreProps {
  upgrades: Upgrade[];
  onPurchase: (id: string, levels: number) => void;
  cycles: number;
}

const UpgradeStore: React.FC<UpgradeStoreProps> = ({ upgrades, onPurchase, cycles }) => {
  const totalLevels = useMemo(() => upgrades.reduce((sum, u) => sum + u.level, 0), [upgrades]);
  const [unlockedTiers, setUnlockedTiers] = useState<Set<string>>(() => {
    const initialTotalLevels = upgrades.reduce((sum, u) => sum + u.level, 0);
    const initialUnlocked = new Set<string>();
    UPGRADE_TIERS.forEach(tier => {
        const condition = tier.unlockCondition;
        let isUnlocked = false;
        if (condition.type === 'none') {
            isUnlocked = true;
        } else if (condition.type === 'totalLevels' && initialTotalLevels >= condition.requiredLevels) {
            isUnlocked = true;
        }
        if (isUnlocked) {
            initialUnlocked.add(tier.name);
        }
    });
    return initialUnlocked;
  });
  const [buyAmount, setBuyAmount] = useState<number | 'max'>(1);
  const newlyUnlockedRef = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    const unlocked = new Set<string>();
    UPGRADE_TIERS.forEach((tier) => {
        if (unlockedTiers.has(tier.name)) return;

        const condition = tier.unlockCondition;
        if (condition.type === 'totalLevels' && totalLevels >= condition.requiredLevels) {
            unlocked.add(tier.name);
        }
    });

    if (unlocked.size > 0) {
        setUnlockedTiers(current => new Set([...current, ...unlocked]));
        unlocked.forEach(name => newlyUnlockedRef.current.add(name));
    }
  }, [totalLevels, unlockedTiers]);

  const getUnlockMessage = (tier: UpgradeTier): string => {
      const condition = tier.unlockCondition;
      if (condition.type === 'totalLevels') {
          const needed = condition.requiredLevels - totalLevels;
          if (needed > 0) {
            return `Needs ${needed} more level${needed > 1 ? 's' : ''}`;
          }
          return `Needs ${condition.requiredLevels} total levels`;
      }
      return "Locked";
  }

  const TierHeader: React.FC<{ tier: UpgradeTier, isNewlyUnlocked: boolean }> = ({ tier, isNewlyUnlocked }) => {
    const [animationClass, setAnimationClass] = useState(isNewlyUnlocked ? 'animate-tier-unlock' : '');

    useEffect(() => {
      if (isNewlyUnlocked) {
        const timer = setTimeout(() => {
          setAnimationClass('');
          newlyUnlockedRef.current.delete(tier.name);
        }, 800); // Animation duration
        return () => clearTimeout(timer);
      }
    }, [isNewlyUnlocked, tier.name]);

    return (
      <div className={`mt-4 mb-2 p-2 rounded-lg bg-slate-700/50 border-b-2 border-slate-600/80 ${animationClass}`}>
        <h4 className="text-lg font-bold text-pink-400">{tier.name}</h4>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/50 rounded-2xl shadow-inner border border-slate-700/50 p-4 h-full flex flex-col">
      <h3 className="text-4xl font-extrabold text-center mb-4 text-slate-100 flex-shrink-0">
        Store
      </h3>
       <div className="flex-shrink-0 mb-3 flex items-center justify-center gap-2">
        <span className="text-sm font-semibold text-slate-400">Build:</span>
        <div className="flex flex-1 gap-1 p-1 bg-slate-800/80 rounded-lg max-w-sm">
            {(['1', '10', '100', 'max'] as const).map((amount) => (
                <button
                    key={amount}
                    onClick={() => setBuyAmount(amount === 'max' ? 'max' : Number(amount))}
                    className={`px-3 py-1 text-sm font-bold rounded-md transition-colors flex-1 ${
                        String(buyAmount) === amount
                            ? 'bg-pink-500 text-slate-900 shadow-sm'
                            : 'bg-transparent hover:bg-slate-700/60 text-slate-300'
                    }`}
                >
                    {amount === 'max' ? 'Max' : <span className="font-mono">{amount}x</span>}
                </button>
            ))}
        </div>
      </div>
      <ul className="space-y-3 flex-grow overflow-y-auto pr-2 -mr-2">
        {UPGRADE_TIERS.map((tier) => {
            const isTierUnlocked = unlockedTiers.has(tier.name);
            const unlockMessage = getUnlockMessage(tier);
            const isNewlyUnlocked = newlyUnlockedRef.current.has(tier.name);

            return (
              <React.Fragment key={tier.name}>
                {isTierUnlocked && <TierHeader tier={tier} isNewlyUnlocked={isNewlyUnlocked} />}
                {tier.upgrades.map(upgradeStub => {
                    const upgrade = isTierUnlocked 
                        ? upgrades.find(u => u.id === upgradeStub.id) 
                        : upgradeStub;
                    
                    if (!upgrade) return null; // Should not happen with correct data

                    return (
                        <UpgradeItem
                            key={upgrade.id}
                            upgrade={upgrade}
                            onPurchase={onPurchase}
                            cycles={cycles}
                            buyAmount={buyAmount}
                            isLocked={!isTierUnlocked}
                            unlockMessage={unlockMessage}
                        />
                    );
                })}
              </React.Fragment>
            );
        })}
      </ul>
    </div>
  );
};

export default UpgradeStore;