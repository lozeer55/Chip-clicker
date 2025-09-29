import React from 'react';
import type { Upgrade, Milestone, UpgradeTier, Achievement, PrestigeUpgrade, DailyReward, Challenge } from './types';

// ALCHEMY & MAGIC ICONS
// FIX: Exported PotionIcon to be used in other components like StatsModal.
export const PotionIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <rect width="256" height="256" fill="none"/><line x1="96" y1="32" x2="160" y2="32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <path d="M192,112.9V216a8,8,0,0,1-8,8H72a8,8,0,0,1-8-8V112.9a64,64,0,1,1,128,0Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
);
// FIX: Exported CauldronIcon to be used in other components like StatsModal.
export const CauldronIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <rect width="256" height="256" fill="none"/><path d="M40,128c-11.2,0-11.2,16,0,16H216c11.2,0,11.2-16,0-16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <path d="M216,144v48a32,32,0,0,1-32,32H72a32,32,0,0,1-32-32V144" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <path d="M176,80h16a24,24,0,0,0,0-48H64a24,24,0,0,0,0,48H80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
);
const MortarAndPestleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <rect width="256" height="256" fill="none"/><path d="M216,128v40a48,48,0,0,1-48,48H88a48,48,0,0,1-48-48V128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="40" y1="128" x2="216" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <path d="M168,48a24,24,0,0,1-48,0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="144" y1="48" x2="144" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
);
const MandrakeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <rect width="256" height="256" fill="none"/><line x1="128" y1="128" x2="128" y2="88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <path d="M208,88H160a32,32,0,0,0-32,32v88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <path d="M48,88h48a32,32,0,0,1,32,32v88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <path d="M160,88V72a32,32,0,0,0-32-32h0a32,32,0,0,0-32,32V88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
);
const SpellbookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <rect width="256" height="256" fill="none"/><path d="M48,208a24,24,0,0,1-24-24V72A24,24,0,0,1,48,48H200a8,8,0,0,1,8,8V192a8,8,0,0,1-8,8Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <polyline points="48 208 48 48 200 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <circle cx="80" cy="84" r="12"/>
    </svg>
);
const CrystalBallIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <rect width="256" height="256" fill="none"/><circle cx="128" cy="112" r="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <path d="M91.8,185.3a8,8,0,0,0,6.2,6.7l21.8,5.5a23.9,23.9,0,0,0,16.4,0l21.8-5.5a8,8,0,0,0,6.2-6.7L176,144H80Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
);
const PhilosopherStoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <rect width="256" height="256" fill="none"/><path d="M164.5,48.3l-56,32a3.9,3.9,0,0,0-2,3.4V172.3a3.9,3.9,0,0,0,2,3.4l56,32a3.9,3.9,0,0,0,4-3.4V51.7A3.9,3.9,0,0,0,164.5,48.3Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <path d="M87.5,207.7l56-32a3.9,3.9,0,0,0,2-3.4V84.3a3.9,3.9,0,0,0-2-3.4l-56-32a3.9,3.9,0,0,0-4,3.4v148A3.9,3.9,0,0,0,87.5,207.7Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
);
const RuneStoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <rect width="256" height="256" fill="none"/><path d="M128,32,48.2,72,128,112,79.8-40Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <path d="M207.8,184,128,224,48.2,184" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="128" y1="112" x2="128" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
);
const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><path d="M216.7,152.6A95.6,95.6,0,0,1,103.4,39.3h0A96,96,0,1,0,216.7,152.6Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);
const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="60" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="128" y1="36" x2="128" y2="16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="128" y1="240" x2="128" y2="220" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="62.1" y1="62.1" x2="48" y2="48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="208" y1="208" x2="193.9" y2="193.9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="36" y1="128" x2="16" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="240" y1="128" x2="220" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="62.1" y1="193.9" x2="48" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="208" y1="48" x2="193.9" y2="62.1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);
const GalaxyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><path d="M37.7,184A95.8,95.8,0,0,1,32,128C32,75,75,32,128,32s96,43,96,96-43,96-96,96a95.4,95.4,0,0,1-56-17.7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><circle cx="128" cy="128" r="32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M128,32a95.9,95.9,0,0,1,32,64c0,35.2-19.2,64-48,64s-48-28.8-48-64a47.9,47.9,0,0,1,16-36" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);
const TreeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><path d="M216,208H40a16,16,0,0,1-16-16.8l32.2-112.6a16,16,0,0,1,15.5-11.8h88.6a16,16,0,0,1,15.5,11.8L208,191.2A16,16,0,0,1,216,208Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M128,67.3V32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="128" y1="208" x2="128" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="16" y1="208" x2="240" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);
const AmuletIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><path d="M164.5,147.3,128,176,91.5,147.3a40,40,0,1,1,73,0Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M192.9,72A96.3,96.3,0,0,0,128,40a95.4,95.4,0,0,0-72,36.9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);
const ElementalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><path d="M80,144H32V96l48,24Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M176,144h48V96l-48,24Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M160,224.7V176l-32,16-32-16v48.7Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M160,31.3V80l-32-16-32,16V31.3Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="80" y1="144" x2="96" y2="176" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="176" y1="144" x2="160" y2="176" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="80" y1="120" x2="96" y2="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="176" y1="120" x2="160" y2="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);
const InfinityIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><path d="M103,160a52,52,0,1,0,0-64H200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M153,96a52,52,0,1,0,0,64H56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);

export const GoldenDropletIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <defs>
            <filter id="gold-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -5" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
            </filter>
        </defs>
        <g filter="url(#gold-glow)">
          <line x1="96" y1="32" x2="160" y2="32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
          <line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
          <path d="M192,112.9V216a8,8,0,0,1-8,8H72a8,8,0,0,1-8-8V112.9a64,64,0,1,1,128,0Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        </g>
    </svg>
);

export const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 256 256">
        <path d="M243.8,152.3a24.2,24.2,0,0,1-23,15.8,23.6,23.6,0,0,1-13.1-4.1l-24.3,24.3a23.9,23.9,0,0,1-33.9,0l-12-12a8,8,0,0,1,0-11.3l28.1-28.1a40.2,40.2,0,0,1-12.2-28.7,40,40,0,0,1,40-40,40.2,40.2,0,0,1,28.7,12.2l28.1-28.1a8,8,0,0,1,11.3,0l12,12a23.9,23.9,0,0,1,0,33.9l-24.3,24.3A23.6,23.6,0,0,1,220.8,176,24.2,24.2,0,0,1,243.8,152.3ZM188,96a24,24,0,1,0-24,24A24,24,0,0,0,188,96Zm-76.4,75.6L88,195.3,44.7,152,72.4,124.3a7.9,7.9,0,0,1,11.3,0l27.9,27.9A8,8,0,0,1,111.6,171.6ZM99.3,28.7,75.6,4.9A15.9,15.9,0,0,0,53.3,4.9L4.9,53.3A15.9,15.9,0,0,0,4.9,75.6L28.7,99.3l42.6-42.6Z"/>
    </svg>
);
export const TrophyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <rect width="256" height="256" fill="none"/><path d="M32,80H224a0,0,0,0,1,0,0V176a32,32,0,0,1-32,32H64a32,32,0,0,1-32-32V80A0,0,0,0,1,32,80Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="128" y1="208" x2="128" y2="240" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="96" y1="240" x2="160" y2="240" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <path d="M192,80V48a32,32,0,0,0-32-32H96A32,32,0,0,0,64,48V80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="32" y1="120" x2="224" y2="120" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
);
export const AchievementIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 256 256">
        <path d="M229.7,85.7a12,12,0,0,0-17,0l-99.4,99.5-43.1-43.1a12,12,0,0,0-17,17l51.6,51.6a12,12,0,0,0,17,0l107.9-107.9A12,12,0,0,0,229.7,85.7Z"/>
    </svg>
);
export const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 256 256"><path d="M240,208H32a8,8,0,0,1-8-8V40a8,8,0,0,1,16,0V192H240a8,8,0,0,1,0,16ZM192,168a8,8,0,0,0,8-8V104a8,8,0,0,0-16,0v56A8,8,0,0,0,192,168Zm-48,0a8,8,0,0,0,8-8V72a8,8,0,0,0-16,0v88A8,8,0,0,0,144,168Zm-48,0a8,8,0,0,0,8-8V128a8,8,0,0,0-16,0v32A8,8,0,0,0,96,168Z"/></svg>
);
export const LightningIcon = (props?: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 256 256" {...props}>
        <path d="M227.4,116.2,98.6,245a12,12,0,0,1-22-10.2V144H32a12,12,0,0,1-9.4-19.8L157.4,11a12,12,0,0,1,22,10.2V112h44.8A12,12,0,0,1,227.4,116.2Z"/>
    </svg>
);
export const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 256 256">
        <path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96v96a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96Z"/>
    </svg>
);

export const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><path d="M224,96l-67.6,12.3L128,32,99.6,108.3,32,120.6,79.2,171,64.8,240,128,202.2,191.2,240l-14.4-69Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);
export const RocketIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><path d="M168,128l-40,40L88,128,48,88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M152.3,45.8a48,48,0,0,0-66.6,0L40,91.5,91.5,40l45.8-45.7a48,48,0,0,0,0,66.6Z" transform="translate(144.5 111.5) rotate(45)" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M184.6,152.6a23.9,23.9,0,1,0,33.9,0l-17-17-17,17Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);
export const PlusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="88" y1="128" x2="168" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="128" y1="88" x2="128" y2="168" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);
export const StopwatchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 256 256">
        <path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64.2-148.2a8,8,0,0,1,0,11.3l-5.7,5.7a8,8,0,0,1-11.3,0,32.1,32.1,0,0,0-45.2,0,8,8,0,0,1-11.3,0l-5.7-5.7a8,8,0,0,1,0-11.3,48,48,0,0,1,68.2,0ZM128,88a8,8,0,0,1,8,8v48a8,8,0,0,1-16,0V96A8,8,0,0,1,128,88Z"/>
    </svg>
);


export const UPGRADE_TIERS: UpgradeTier[] = [
  {
    name: "Alquimia Básica",
    unlockCondition: { type: 'none' },
    upgrades: [
      { id: 'stirring_rod', name: 'Varilla Agitadora Encantada', description: '+1 esencia por agitación', baseCost: 50, costGrowth: 1.25, level: 0, type: 'click', power: 1, icon: <PotionIcon /> },
      { id: 'self_stir_cauldron', name: 'Caldero Autorevolvedor', description: '+1 esencia por segundo', baseCost: 500, costGrowth: 1.28, level: 0, type: 'auto', power: 1, icon: <CauldronIcon /> },
    ]
  },
  {
    name: "Estudios de Herbolaria",
    unlockCondition: { type: 'totalLevels', requiredLevels: 10 },
    upgrades: [
      { id: 'alchemist_wand', name: 'Varita de Alquimista', description: '+8 de esencia por agitación', baseCost: 5000, costGrowth: 1.30, level: 0, type: 'click', power: 8, icon: <PotionIcon /> },
      { id: 'mystic_garden', name: 'Jardín de Hierbas Místicas', description: '+6 esencia por segundo', baseCost: 12000, costGrowth: 1.29, level: 0, type: 'auto', power: 6, icon: <MandrakeIcon /> },
    ]
  },
  {
    name: "Alquimia Celestial",
    unlockCondition: { type: 'totalLevels', requiredLevels: 10 },
    upgrades: [
      { id: 'moon_tears', name: 'Tears of the Moon', description: '+500 esencia por segundo', baseCost: 3e6, costGrowth: 1.32, level: 0, type: 'auto', power: 500, icon: <MoonIcon /> },
      { id: 'sunstone_catalyst', name: 'Sunstone Catalyst', description: '+750 esencia por segundo', baseCost: 4e6, costGrowth: 1.33, level: 0, type: 'auto', power: 750, icon: <SunIcon /> }
    ]
  },
  {
    name: "Preparación Avanzada",
    unlockCondition: { type: 'totalLevels', requiredLevels: 25 },
    upgrades: [
      { id: 'potion_lab', name: 'Laboratorio de Pociones', description: '+40 de esencia por segundo', baseCost: 150000, costGrowth: 1.30, level: 0, type: 'auto', power: 40, icon: <MortarAndPestleIcon /> },
    ]
  },
  {
    name: "Transmutación",
    unlockCondition: { type: 'totalLevels', requiredLevels: 40 },
    upgrades: [
      { id: 'infused_gloves', name: 'Guantes de Toque Infuso', description: '+100 por agitación', baseCost: 1e6, costGrowth: 1.35, level: 0, type: 'click', power: 100, icon: <PotionIcon /> },
      { id: 'grimoire', name: 'Grimorio de Elaboración', description: '+150 de esencia por segundo', baseCost: 1.2e6, costGrowth: 1.31, level: 0, type: 'auto', power: 150, icon: <SpellbookIcon /> },
    ]
  },
  {
    name: "Adivinación",
    unlockCondition: { type: 'totalLevels', requiredLevels: 55 },
    upgrades: [
        { id: 'scrying_pool', name: 'Piscina de Adivinación', description: '+200 de esencia por segundo', baseCost: 5e6, costGrowth: 1.32, level: 0, type: 'auto', power: 200, icon: <CrystalBallIcon /> },
    ]
  },
  {
    name: "Alquimia Etérea",
    unlockCondition: { type: 'totalLevels', requiredLevels: 70 },
    upgrades: [
        { id: 'ethereal_portal', name: 'Portal Etéreo', description: '+1,200 esencia por segundo', baseCost: 6e7, costGrowth: 1.33, level: 0, type: 'auto', power: 1200, icon: <RuneStoneIcon /> },
    ]
  },
  {
    name: "Alquimia Cósmica",
    unlockCondition: { type: 'totalLevels', requiredLevels: 90 },
    upgrades: [
        { id: 'lunar_stir', name: 'Agitación Lunar', description: '+1,000 por agitación', baseCost: 7.5e7, costGrowth: 1.38, level: 0, type: 'click', power: 1000, icon: <MoonIcon /> },
        { id: 'philosopher_stone', name: 'Piedra Filosofal', description: '+1,500 de esencia por segundo', baseCost: 9e7, costGrowth: 1.34, level: 0, type: 'auto', power: 1500, icon: <PhilosopherStoneIcon /> },
    ]
  },
  {
    name: "Tecnología Arcana",
    unlockCondition: { type: 'totalLevels', requiredLevels: 120 },
    upgrades: [
      { id: 'astral_foundry', name: 'Fundición Astral', description: '+12,000 EPS', baseCost: 1.5e9, costGrowth: 1.35, level: 0, type: 'auto', power: 12000, icon: <SunIcon /> },
      { id: 'solar_touch', name: 'Toque Solar', description: '+10,000 por agitación', baseCost: 2e9, costGrowth: 1.39, level: 0, type: 'click', power: 10000, icon: <SunIcon /> },
    ]
  },
  {
    name: "Dominio de la Creación",
    unlockCondition: { type: 'totalLevels', requiredLevels: 150 },
    upgrades: [
      { id: 'world_tree', name: 'Savia del Árbol del Mundo', description: '+80,000 EPS', baseCost: 2.5e10, costGrowth: 1.36, level: 0, type: 'auto', power: 80000, icon: <TreeIcon /> },
      { id: 'ley_lines', name: 'Aprovechar Líneas Ley', description: '+150,000 EPS', baseCost: 5e10, costGrowth: 1.37, level: 0, type: 'auto', power: 150000, icon: <AmuletIcon /> },
    ]
  },
  {
    name: "Maestría Elemental",
    unlockCondition: { type: 'totalLevels', requiredLevels: 180 },
    upgrades: [
      { id: 'elemental_forge', name: 'Forja Elemental', description: '+1.2 Millones de EPS', baseCost: 8e11, costGrowth: 1.38, level: 0, type: 'auto', power: 1.2e6, icon: <ElementalIcon /> },
      { id: 'galaxy_bottle', name: 'Galaxia en una Botella', description: '+2.5 Millones de EPS', baseCost: 1.5e12, costGrowth: 1.39, level: 0, type: 'auto', power: 2.5e6, icon: <GalaxyIcon /> },
    ]
  },
  {
    name: "Poder Absoluto",
    unlockCondition: { type: 'totalLevels', requiredLevels: 220 },
    upgrades: [
      { id: 'nexus_of_reality', name: 'Nexo de la Realidad', description: '+50 Millones de EPS', baseCost: 3e14, costGrowth: 1.40, level: 0, type: 'auto', power: 5e7, icon: <InfinityIcon /> },
      { id: 'touch_of_creation', name: 'Toque de la Creación', description: '+1 Billón por agitación', baseCost: 1e15, costGrowth: 1.45, level: 0, type: 'click', power: 1e9, icon: <InfinityIcon /> },
    ]
  }
];

// Flatten the tiers to a single array for easier state management
export const INITIAL_UPGRADES: Upgrade[] = UPGRADE_TIERS.flatMap(tier => tier.upgrades);


export const MILESTONES: Milestone[] = [
    { name: "Primera Pócima", xpRequired: 250, reward: { type: 'click_multiplier', multiplier: 2, duration: 10 } },
    { name: "Aprendiz de Pociones", xpRequired: 2000, reward: { type: 'click_multiplier', multiplier: 2, duration: 15 } },
    { name: "Zahorí de Cristal", xpRequired: 15000, reward: { type: 'click_multiplier', multiplier: 3, duration: 15 } },
    { name: "Tejedor de Líneas Ley", xpRequired: 50000, reward: { type: 'bps_multiplier', multiplier: 2, duration: 30 } },
    { name: "Ingeniero Cuántico", xpRequired: 200000, reward: { type: 'click_multiplier', multiplier: 4, duration: 20 } },
    { name: "Maestro Transmutador", xpRequired: 750000, reward: { type: 'bps_multiplier', multiplier: 3, duration: 45 } },
    { name: "Deidad Mística", xpRequired: 2e6, reward: { type: 'click_multiplier', multiplier: 5, duration: 30 } },
    { name: "Alquimista Cósmico", xpRequired: 1e7, reward: { type: 'bps_multiplier', multiplier: 4, duration: 60 } },
    { name: "Manipulador de la Realidad", xpRequired: 5e7, reward: { type: 'click_multiplier', multiplier: 10, duration: 45 } },
];

export const ACHIEVEMENTS: Achievement[] = [
    { id: 'click1', name: 'Primer Toque', description: 'Agita el caldero 100 veces.', icon: <PotionIcon />, condition: { type: 'totalClicks', value: 100 } },
    { id: 'click2', name: 'Agitador Entusiasta', description: 'Agita el caldero 1,000 veces.', icon: <PotionIcon />, condition: { type: 'totalClicks', value: 1000 } },
    { id: 'click3', name: 'Maestro Agitador', description: 'Agita el caldero 10,000 veces.', icon: <PotionIcon />, condition: { type: 'totalClicks', value: 10000 } },
    { id: 'earn1', name: 'Primera Gota', description: 'Gana un total de 1,000 de esencia.', icon: <CauldronIcon />, condition: { type: 'totalCycles', value: 1000 } },
    { id: 'earn2', name: 'Frasco Lleno', description: 'Gana un total de 100,000 de esencia.', icon: <CauldronIcon />, condition: { type: 'totalCycles', value: 100000 } },
    { id: 'earn3', 'name': 'Barril Rebosante', 'description': 'Gana un total de 1,000,000 de esencia.', icon: <CauldronIcon />, condition: { type: 'totalCycles', value: 1e6 } },
    { id: 'earn4', 'name': 'Océano de Esencia', 'description': 'Gana un total de 1 Billón de esencia.', icon: <CauldronIcon />, condition: { type: 'totalCycles', value: 1e12 } },
    { id: 'upgrade1', name: 'Primer Caldero', description: 'Construye tu primer Caldero Autorevolvedor.', icon: <CauldronIcon />, condition: { type: 'specificUpgradeLevel', upgradeId: 'self_stir_cauldron', value: 1 } },
    { id: 'upgrade2', name: 'Industrialista', description: 'Construye un Laboratorio de Pociones.', icon: <MortarAndPestleIcon />, condition: { type: 'specificUpgradeLevel', upgradeId: 'potion_lab', value: 1 } },
    { id: 'upgrade3', name: 'Interdimensional', description: 'Abre un Portal Etéreo.', icon: <RuneStoneIcon />, condition: { type: 'specificUpgradeLevel', upgradeId: 'ethereal_portal', value: 1 } },
    { id: 'upgrade4', name: 'Motor Estelar', description: 'Construye una Fundición Astral.', icon: <SunIcon />, condition: { type: 'specificUpgradeLevel', upgradeId: 'astral_foundry', value: 1 } },
    { id: 'level1', name: 'Bien Afinado', description: 'Sube de nivel la Varilla Agitadora Encantada al nivel 10.', icon: <PotionIcon />, condition: { type: 'specificUpgradeLevel', upgradeId: 'stirring_rod', value: 10 } },
    { id: 'level2', name: 'Ejército de Calderos', description: 'Sube de nivel el Caldero Autorevolvedor al nivel 25.', icon: <CauldronIcon />, condition: { type: 'specificUpgradeLevel', upgradeId: 'self_stir_cauldron', value: 25 } },
    { id: 'level3', name: 'Coleccionista', description: 'Posee al menos una de cada mejora.', icon: <TrophyIcon />, condition: { type: 'anyUpgradeLevel', value: 1 } },
];

// Golden Droplet Config
export const GOLDEN_DROPLET_LIFESPAN = 8000; // ms
export const GOLDEN_DROPLET_SPAWN_INTERVAL_MIN = 30000; // ms
export const GOLDEN_DROPLET_SPAWN_INTERVAL_MAX = 90000; // ms
export const GOLDEN_DROPLET_BOOST_MULTIPLIER = 10;
export const GOLDEN_DROPLET_BOOST_DURATION = 12; // seconds

// Prestige Config
export const PRESTIGE_REQUIREMENT = 1e12; // 1 Trillion essence

export const calculatePrestigePoints = (totalCyclesEarned: number): number => {
    if (totalCyclesEarned < PRESTIGE_REQUIREMENT) {
        return 0;
    }
    return Math.floor(Math.pow(totalCyclesEarned / 1e12, 0.4));
};

export const INITIAL_PRESTIGE_UPGRADES: PrestigeUpgrade[] = [
    {
        id: 'perm_boost_1',
        name: 'Fuente de Maná Permanente',
        description: (level) => `Toda la generación de esencia aumenta permanentemente en un ${level}%.`,
        cost: (level) => Math.ceil(Math.pow(level + 1, 1.5)),
        level: 0,
        bonus: { type: 'all_cycles_multiplier', value: 0.01 },
        icon: <StarIcon />
    },
    {
        id: 'starting_cycles_1',
        name: 'Herencia Alquímica',
        description: (level) => `Comienza con ${(1000 * level).toLocaleString()} de esencia después de prestigiar.`,
        cost: (level) => 1 + level,
        level: 0,
        maxLevel: 10,
        bonus: { type: 'starting_cycles', value: 1000 },
        icon: <RocketIcon />
    },
    {
        id: 'click_synergy_1',
        name: 'Sinergia de Agitación',
        description: (level) => `Cada agitación también otorga un ${level * 0.1}% de tu EPS.`,
        cost: (level) => 5 * (level + 1),
        level: 0,
        maxLevel: 20,
        bonus: { type: 'cps_to_click_synergy', value: 0.001 },
        icon: <PlusCircleIcon />
    }
];

// Daily Rewards Config
export const DAILY_REWARDS: DailyReward[] = [
    { day: 1, type: 'essence_minutes', value: 5, name: 'Cache de Esencia Pequeño', icon: <CauldronIcon /> },
    { day: 2, type: 'click_boost', value: 2, duration: 60, name: 'Frenesí de Clics', icon: <PotionIcon /> },
    { day: 3, type: 'essence_minutes', value: 15, name: 'Cache de Esencia Mediano', icon: <CauldronIcon /> },
    { day: 4, type: 'bps_boost', value: 2, duration: 90, name: 'Aumento de Esencia', icon: <LightningIcon /> },
    { day: 5, type: 'prestige_points', value: 2, name: 'Fragmento de Prestigio', icon: <StarIcon /> },
    { day: 6, type: 'essence_minutes', value: 60, name: 'Cache de Esencia Grande', icon: <CauldronIcon /> },
    { day: 7, type: 'prestige_points', value: 5, name: 'Cristal de Prestigio', icon: <StarIcon /> },
];

// Challenges Config
export const CHALLENGES: Challenge[] = [
    {
        id: 'earn_1m',
        name: 'Sprint de Esencia',
        description: 'Gana 1 millón de esencia en menos de 5 minutos.',
        duration: 300, // 5 minutes
        objective: { type: 'earn_essence', value: 1e6 },
        reward: { type: 'prestige_points', value: 5 },
        icon: <CauldronIcon />,
        unlockCondition: { type: 'prestiges', value: 1 }
    },
    {
        id: 'cauldron_50',
        name: 'Producción en Masa',
        description: 'Lleva tu Caldero Autorevolvedor al nivel 50 en 5 minutos.',
        duration: 300,
        objective: { type: 'upgrade_level', upgradeId: 'self_stir_cauldron', value: 50 },
        reward: { type: 'prestige_points', value: 10 },
        icon: <CauldronIcon />,
        unlockCondition: { type: 'prestiges', value: 1 }
    },
    {
        id: 'earn_1b',
        name: 'Fiebre del Billón',
        description: 'Gana 1 billón de esencia en menos de 3 minutos.',
        duration: 180, // 3 minutes
        objective: { type: 'earn_essence', value: 1e9 },
        reward: { type: 'prestige_points', value: 25 },
        icon: <LightningIcon />,
        unlockCondition: { type: 'prestiges', value: 3 }
    }
];