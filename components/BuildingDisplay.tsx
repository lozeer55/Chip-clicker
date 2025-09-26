import React from 'react';
import type { Upgrade } from '../types';

interface BuildingDisplayProps {
  upgrades: Upgrade[];
}

const getAnimationClassForUpgrade = (upgradeId: string): string => {
  switch (upgradeId) {
    case 'monkey': return 'animate-robot-walk';
    case 'plantation': return 'animate-chip-pulse';
    case 'factory': return 'animate-factory-shake';
    case 'hydroponics': return 'animate-led-blink';
    case 'shipment': return 'animate-truck-rumble';
    case 'portal': return 'animate-globe-spin';
    case 'nebula': return 'animate-brain-glow';
    default: return '';
  }
};

const BuildingDisplay: React.FC<BuildingDisplayProps> = ({ upgrades }) => {
  const ownedUpgrades = upgrades.filter(u => u.level > 0 && u.type === 'auto');

  if (ownedUpgrades.length === 0) {
    return (
      <div className="bg-slate-900/50 rounded-2xl shadow-inner border border-slate-700/50 p-6 h-full flex flex-col items-center justify-center text-center">
        <h3 className="text-2xl font-bold text-slate-300">Your Production Hub</h3>
        <p className="text-slate-400 mt-2">Purchase automated upgrades from the store to see your production line grow here!</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 rounded-2xl shadow-inner border border-slate-700/50 p-4 h-full flex flex-col">
       <h3 className="text-2xl font-bold text-center mb-4 text-slate-100 flex-shrink-0">Production Hub</h3>
       <div className="flex-grow overflow-y-auto pr-2 -mr-2">
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-3">
            {ownedUpgrades.map((upgrade, index) => (
              <div key={upgrade.id} className="bg-slate-800/70 p-3 rounded-lg border border-slate-700/80 flex flex-col items-center justify-center text-center aspect-square transition-all duration-200 hover:scale-105 hover:bg-slate-700/80" title={`${upgrade.name} - Level ${upgrade.level}`}>
                <div className={`relative text-pink-400 ${getAnimationClassForUpgrade(upgrade.id)}`} style={{ animationDelay: `${(index % 8) * 150}ms` }}>
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-500 animate-activity-pulse" style={{ animationDelay: `${(index % 8) * 200}ms` }}></div>
                    {React.cloneElement(upgrade.icon, { className: 'h-10 w-10 mb-1' })}
                </div>
                <span className="font-bold text-slate-200 text-lg leading-tight font-mono">{upgrade.level}</span>
                <p className="text-xs text-pink-300 font-semibold mt-1 animate-cps-pulse font-mono" style={{ animationDelay: `${(index % 8) * 120}ms` }}>
                    { (upgrade.power * upgrade.level).toLocaleString() } CPS
                </p>
              </div>
            ))}
         </div>
       </div>
    </div>
  );
};

export default BuildingDisplay;