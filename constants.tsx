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
export const GalaxyIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
export const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 256 256" {...props}>
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
export const StopwatchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><polyline points="128 88 128 128 168 128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="128" y1="24" x2="128" y2="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="104" y1="24" x2="152" y2="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);
export const MagicIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><path d="M128,24V56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M128,200v32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M204.9,73.1,182.3,95.7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M73.7,160.3,51.1,182.9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M56,128H24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M232,128H200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M73.1,51.1,95.7,73.7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M160.3,182.3,182.9,204.9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);

export const AdminIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 256 256"><path d="M72.2,60.2,24,128l48.2,67.8a8.1,8.1,0,0,1-2.2,11.4,8,8,0,0,1-11.4-2.2L4.9,129.1a8,8,0,0,1,0-11.4L58.6,41.4a8,8,0,0,1,13.6,8.8A8.1,8.1,0,0,1,72.2,60.2Zm111.6,135.6a8,8,0,0,0,11.4-2.2L249.1,129.1a8,8,0,0,0,0-11.4L195.4,41.4a8,8,0,0,0-13.6,8.8,8.1,8.1,0,0,0,2.2,10L183.8,60.2Zm-31-15.7a8,8,0,0,0,10.8-5.4l40-112a8,8,0,0,0-14.8-5.4l-40,112A8,8,0,0,0,152.8,180.1Z"/></svg>
);


const UpgradeCapIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><polyline points="48 160 128 80 208 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="128" y1="80" x2="128" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="80" y1="32" x2="176" y2="32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);

const PowerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><path d="M49.4,176A95.9,95.9,0,0,1,40.2,136H215.8a95.9,95.9,0,0,1-9.2,40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M80,216a95.9,95.9,0,0,1-9.2-40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M176,216a95.9,95.9,0,0,0,9.2-40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M154.9,96l-14.2-64.4a8,8,0,0,0-15.4,0L111.1,96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M176,136h21.8a95.9,95.9,0,0,0-9.2-40h-17" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M80,136H58.2a95.9,95.9,0,0,1,9.2-40h17" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);


export const UPGRADE_TIERS: UpgradeTier[] = [
  {
    name: "Alquimia de Aprendiz",
    unlockCondition: { type: 'none' },
    upgrades: [
      { id: 'stirring_rod', name: 'Varilla Agitadora Encantada', description: '+1 esencia por agitación', baseCost: 30, costGrowth: 1.22, level: 0, type: 'click', power: 1, icon: <PotionIcon />, maxLevel: 100 },
      { id: 'self_stir_cauldron', name: 'Caldero Autorevolvedor', description: '+1 esencia por segundo', baseCost: 150, costGrowth: 1.28, level: 0, type: 'auto', power: 1, icon: <CauldronIcon />, maxLevel: 100 },
      { id: 'alchemist_wand', name: 'Varita de Alquimista', description: '+7 de esencia por agitación', baseCost: 1100, costGrowth: 1.26, level: 0, type: 'click', power: 7, icon: <PotionIcon />, maxLevel: 100 },
      { id: 'mystic_garden', name: 'Jardín de Hierbas Místicas', description: '+8 esencia por segundo', baseCost: 5000, costGrowth: 1.32, level: 0, type: 'auto', power: 8, icon: <MandrakeIcon />, maxLevel: 100 },
    ]
  },
  {
    name: "Herbolaria Avanzada",
    unlockCondition: { type: 'totalLevels', requiredLevels: 50 },
    upgrades: [
      { id: 'potion_lab', name: 'Laboratorio de Pociones', description: '+45 de esencia por segundo', baseCost: 40000, costGrowth: 1.36, level: 0, type: 'auto', power: 45, icon: <MortarAndPestleIcon />, maxLevel: 100 },
      { id: 'infused_gloves', name: 'Guantes de Toque Infuso', description: '+280 por agitación', baseCost: 250000, costGrowth: 1.30, level: 0, type: 'click', power: 280, icon: <PotionIcon />, maxLevel: 100 },
      { id: 'grimoire', name: 'Grimorio de Elaboración', description: '+1,100 de esencia por segundo', baseCost: 1.5e6, costGrowth: 1.39, level: 0, type: 'auto', power: 1100, icon: <SpellbookIcon />, maxLevel: 100 },
      { id: 'moon_tears', name: 'Lágrimas de la Luna', description: '+6,000 esencia por segundo', baseCost: 1e7, costGrowth: 1.40, level: 0, type: 'auto', power: 6000, icon: <MoonIcon />, maxLevel: 100 },
    ]
  },
  {
    name: "Transmutación Experta",
    unlockCondition: { type: 'totalLevels', requiredLevels: 150 },
    upgrades: [
        { id: 'scrying_pool', name: 'Piscina de Adivinación', description: '+35,000 de esencia por segundo', baseCost: 8e7, costGrowth: 1.42, level: 0, type: 'auto', power: 35000, icon: <CrystalBallIcon />, maxLevel: 100 },
        { id: 'sunstone_catalyst', name: 'Catalizador de Piedra Solar', description: '+200,000 esencia por segundo', baseCost: 5e8, costGrowth: 1.44, level: 0, type: 'auto', power: 200000, icon: <SunIcon />, maxLevel: 100 },
        { id: 'ethereal_portal', name: 'Portal Etéreo', description: '+1.1 Millones de esencia por segundo', baseCost: 3e9, costGrowth: 1.46, level: 0, type: 'auto', power: 1.1e6, icon: <RuneStoneIcon />, maxLevel: 100 },
        { id: 'lunar_stir', name: 'Agitación Lunar', description: '+5.5 Millones por agitación', baseCost: 2e10, costGrowth: 1.38, level: 0, type: 'click', power: 5.5e6, icon: <MoonIcon />, maxLevel: 100 },
    ]
  },
  {
    name: "Dominio Cósmico",
    unlockCondition: { type: 'totalLevels', requiredLevels: 300 },
    upgrades: [
        { id: 'philosopher_stone', name: 'Piedra Filosofal', description: '+38 Millones de esencia por segundo', baseCost: 1.8e11, costGrowth: 1.48, level: 0, type: 'auto', power: 38e6, icon: <PhilosopherStoneIcon />, maxLevel: 100 },
        { id: 'astral_foundry', name: 'Fundición Astral', description: '+200 Millones de EPS', baseCost: 1e12, costGrowth: 1.50, level: 0, type: 'auto', power: 200e6, icon: <SunIcon />, maxLevel: 100 },
        { id: 'solar_touch', name: 'Toque Solar', description: '+1.1 Billones por agitación', baseCost: 8e12, costGrowth: 1.42, level: 0, type: 'click', power: 1.1e9, icon: <SunIcon />, maxLevel: 100 },
        { id: 'world_tree', name: 'Savia del Árbol del Mundo', description: '+7 Billones de EPS', baseCost: 5e13, costGrowth: 1.52, level: 0, type: 'auto', power: 7e9, icon: <TreeIcon />, maxLevel: 100 },
    ]
  },
  {
    name: "Arquitectura de la Creación",
    unlockCondition: { type: 'totalLevels', requiredLevels: 500 },
    upgrades: [
      { id: 'ley_lines', name: 'Aprovechar Líneas Ley', description: '+48 Billones de EPS', baseCost: 4e14, costGrowth: 1.54, level: 0, type: 'auto', power: 48e9, icon: <AmuletIcon />, maxLevel: 100 },
      { id: 'elemental_forge', name: 'Forja Elemental', description: '+280 Billones de EPS', baseCost: 3e15, costGrowth: 1.56, level: 0, type: 'auto', power: 280e9, icon: <ElementalIcon />, maxLevel: 100 },
      { id: 'galaxy_bottle', name: 'Galaxia en una Botella', description: '+1.9 Trillones de EPS', baseCost: 2.5e16, costGrowth: 1.58, level: 0, type: 'auto', power: 1.9e12, icon: <GalaxyIcon />, maxLevel: 100 },
      { id: 'nexus_of_reality', name: 'Nexo de la Realidad', description: '+12 Trillones de EPS', baseCost: 1.8e17, costGrowth: 1.60, level: 0, type: 'auto', power: 12e12, icon: <InfinityIcon />, maxLevel: 100 },
      { id: 'touch_of_creation', name: 'Toque de la Creación', description: '+70 Trillones por agitación', baseCost: 1.5e18, costGrowth: 1.64, level: 0, type: 'click', power: 70e12, icon: <InfinityIcon />, maxLevel: 100 },
      { id: 'alchemical_singularity', name: 'Singularidad Alquímica', description: 'El fin y el principio. Genera cantidades incomprensibles de esencia.', baseCost: 1e24, costGrowth: 2, level: 0, type: 'auto', power: 1e18, icon: <GalaxyIcon />, maxLevel: 100, isSecret: true, isUnlocked: false },
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

const NUM_ABBREVIATIONS: { value: number, symbol: string }[] = [
    { value: 1e18, symbol: 'Quint' },
    { value: 1e15, symbol: 'Quad' },
    { value: 1e12, symbol: 'Trill' },
    { value: 1e9, symbol: 'Bill' },
    { value: 1e6, symbol: 'Mill' },
];

export const formatNumber = (num: number): string => {
    const absNum = Math.abs(num);
    if (absNum < 1_000_000) {
        return Math.floor(num).toLocaleString();
    }
    
    const tier = NUM_ABBREVIATIONS.find(abbr => absNum >= abbr.value);

    if (tier) {
        const value = num / tier.value;
        return `${value.toFixed(1)}${tier.symbol}`;
    }

    return Math.floor(num).toLocaleString();
};

// Golden Droplet Config
export const BASE_GOLDEN_DROPLET_CONFIG = {
    LIFESPAN: 8000, // ms
    SPAWN_INTERVAL_MIN: 30000, // ms
    SPAWN_INTERVAL_MAX: 90000, // ms
    BOOST_MULTIPLIER: 10,
    BOOST_DURATION: 12, // seconds
};

// Prestige Config
export const PRESTIGE_REQUIREMENT = 1e12; // 1 Trillion essence

export const calculatePrestigePoints = (totalCyclesEarned: number, bonusMultiplier: number = 1): number => {
    if (totalCyclesEarned < PRESTIGE_REQUIREMENT) {
        return 0;
    }
    // Changed formula for faster prestige point gain
    const basePoints = Math.floor(10 * Math.pow(totalCyclesEarned / PRESTIGE_REQUIREMENT, 0.5));
    return Math.floor(basePoints * bonusMultiplier);
};

export const PRESTIGE_UPGRADES: PrestigeUpgrade[] = [
    // --- Center Path ---
    {
        id: 'perm_boost_1', name: 'Fuente de Maná Permanente',
        description: (level) => `Toda la generación de esencia aumenta permanentemente en un ${level * 2}%.`,
        cost: (level) => Math.ceil(Math.pow(level + 1, 1.8)),
        level: 0, maxLevel: 50,
        bonus: { type: 'all_cycles_multiplier', value: 0.02 },
        icon: <StarIcon />, x: 50, y: 15,
    },
    {
        id: 'starting_cycles_1', name: 'Herencia Alquímica',
        description: (level) => `Comienza con ${(1000 * Math.pow(level, 2) + 1000 * level).toLocaleString()} de esencia después de prestigiar.`,
        cost: (level) => 2 * (level + 1),
        level: 0, maxLevel: 10,
        bonus: { type: 'starting_cycles', value: 1000 }, // Special handling in App.tsx
        icon: <RocketIcon />, requires: 'perm_boost_1', x: 50, y: 25,
    },
    {
        id: 'click_synergy_1', name: 'Sinergia de Agitación',
        description: (level) => `Cada agitación también otorga un ${level * 0.1}% de tu EPS.`,
        cost: (level) => 10 * (level + 1),
        level: 0, maxLevel: 20,
        bonus: { type: 'cps_to_click_synergy', value: 0.001 },
        icon: <PlusCircleIcon />, requires: 'starting_cycles_1', x: 50, y: 35,
    },

    // --- Left Path (Ascension) ---
    {
        id: 'ascension_1', name: 'Ascensión de Aprendiz',
        description: () => `Aumenta el nivel máximo de las mejoras de Alquimia de Aprendiz en +50.`,
        cost: () => 15, level: 0, maxLevel: 1,
        bonus: { type: 'increase_max_level', upgradeIds: ['stirring_rod', 'self_stir_cauldron', 'alchemist_wand', 'mystic_garden'], amount: 50 },
        icon: <UpgradeCapIcon />, requires: 'starting_cycles_1', x: 38, y: 28,
    },
    {
        id: 'ascension_2', name: 'Ascensión de Herbolaria',
        description: () => `Aumenta el nivel máximo de las mejoras de Herbolaria Avanzada en +50.`,
        cost: () => 35, level: 0, maxLevel: 1,
        requires: 'ascension_1',
        bonus: { type: 'increase_max_level', upgradeIds: ['potion_lab', 'infused_gloves', 'grimoire', 'moon_tears'], amount: 50 },
        icon: <UpgradeCapIcon />, x: 28, y: 32,
    },
    {
        id: 'ascension_3', name: 'Ascensión de Transmutación',
        description: () => `Aumenta el nivel máximo de las mejoras de Transmutación Experta en +50.`,
        cost: () => 50, level: 0, maxLevel: 1,
        requires: 'ascension_2',
        bonus: { type: 'increase_max_level', upgradeIds: ['scrying_pool', 'sunstone_catalyst', 'ethereal_portal', 'lunar_stir'], amount: 50 },
        icon: <UpgradeCapIcon />, x: 20, y: 38,
    },
    {
        id: 'ascension_4', name: 'Ascensión Cósmica',
        description: () => `Aumenta el nivel máximo de las mejoras de Dominio Cósmico en +25.`,
        cost: () => 100, level: 0, maxLevel: 1,
        requires: 'ascension_3',
        bonus: { type: 'increase_max_level', upgradeIds: ['philosopher_stone', 'astral_foundry', 'solar_touch', 'world_tree'], amount: 25 },
        icon: <UpgradeCapIcon />, x: 14, y: 46,
    },
     {
        id: 'ascension_5', name: 'Ascensión de la Creación',
        description: () => `Aumenta el nivel máximo de las mejoras de Arquitectura de la Creación en +25.`,
        cost: () => 250, level: 0, maxLevel: 1,
        requires: 'ascension_4',
        bonus: { type: 'increase_max_level', upgradeIds: ['ley_lines', 'elemental_forge', 'galaxy_bottle', 'nexus_of_reality', 'touch_of_creation'], amount: 25 },
        icon: <UpgradeCapIcon />, x: 10, y: 55,
    },

    // --- Right Path (Power) ---
    {
        id: 'power_1', name: 'Poder de Agitación',
        description: () => `La Varilla Agitadora Encantada es un 25% más potente.`,
        cost: () => 25, level: 0, maxLevel: 1,
        requires: 'starting_cycles_1',
        bonus: { type: 'increase_power_multiplier', upgradeIds: ['stirring_rod'], multiplier: 1.25 },
        icon: <PowerIcon />, x: 62, y: 28,
    },
    {
        id: 'power_2', name: 'Poder del Jardín',
        description: () => `El Jardín de Hierbas Místicas es un 50% más potente.`,
        cost: () => 40, level: 0, maxLevel: 1,
        requires: 'power_1',
        bonus: { type: 'increase_power_multiplier', upgradeIds: ['mystic_garden'], multiplier: 1.5 },
        icon: <PowerIcon />, x: 72, y: 32,
    },
    {
        id: 'click_power_perm', name: 'Agitación Poderosa',
        description: (level) => `Aumenta la potencia de todas las mejoras de agitación en un ${level * 5}%.`,
        cost: (level) => 15 + Math.pow(level, 2) * 5,
        level: 0, maxLevel: 10,
        bonus: { type: 'increase_power_multiplier', upgradeIds: INITIAL_UPGRADES.filter(u => u.type === 'click').map(u => u.id), multiplier: 1.05 },
        icon: <PotionIcon />, requires: 'power_2', x: 80, y: 38,
    },
    {
        id: 'auto_power_perm', name: 'Maestría Automatizada',
        description: (level) => `Aumenta la potencia de todas las mejoras automáticas en un ${level * 5}%.`,
        cost: (level) => 20 + Math.pow(level, 2) * 6,
        level: 0, maxLevel: 10,
        bonus: { type: 'increase_power_multiplier', upgradeIds: INITIAL_UPGRADES.filter(u => u.type === 'auto').map(u => u.id), multiplier: 1.05 },
        icon: <CauldronIcon />, requires: 'click_power_perm', x: 86, y: 46,
    },
     {
        id: 'first_in_tier_power', name: 'Catalizador de Esencia',
        description: (level) => `La primera mejora de cada tier es un ${level * 20}% más potente.`,
        cost: (level) => 150 + Math.pow(level, 2) * 25,
        level: 0, maxLevel: 5,
        bonus: { type: 'first_in_tier_bonus', multiplier: 1.20 },
        icon: <ElementalIcon />, requires: 'auto_power_perm', x: 90, y: 55,
    },

    // --- Bottom Path (Fortune & Events) ---
    {
        id: 'fortunate_beginnings', name: 'Comienzos Afortunados',
        description: (level) => `Las Gotas Doradas aparecen un ${level * 5}% más a menudo.`,
        cost: (level) => 25 + (level * 5),
        level: 0, maxLevel: 10,
        bonus: { type: 'golden_droplet_chance', multiplier: 1.05 },
        icon: <GoldenDropletIcon />, requires: 'click_synergy_1', x: 50, y: 48,
    },
    {
        id: 'lingering_gold', name: 'Oro Persistente',
        description: (level) => `Las Gotas Doradas permanecen en pantalla un ${level * 10}% más de tiempo.`,
        cost: (level) => 30 + (level * 5),
        level: 0, maxLevel: 5,
        bonus: { type: 'golden_droplet_duration', multiplier: 1.10 },
        icon: <GoldenDropletIcon />, requires: 'fortunate_beginnings', x: 50, y: 58,
    },
    {
        id: 'gilded_essence', name: 'Esencia Dorada',
        description: (level) => `Las Gotas Doradas son un ${level * 25}% más efectivas.`,
        cost: (level) => 50 * (level + 1),
        level: 0, maxLevel: 10,
        bonus: { type: 'golden_droplet_effect', multiplier: 1.25 },
        icon: <GoldenDropletIcon />, requires: 'lingering_gold', x: 50, y: 68,
    },
    {
        id: 'fateful_whispers', name: 'Susurros del Destino',
        description: (level) => `Los eventos aleatorios ocurren un ${level * 10}% más a menudo.`,
        cost: (level) => 100 + (level * 20),
        level: 0, maxLevel: 5,
        bonus: { type: 'random_event_chance', multiplier: 1.10 },
        icon: <MagicIcon />, requires: 'gilded_essence', x: 60, y: 78,
    },
    {
        id: 'amplified_reality', name: 'Realidad Amplificada',
        description: (level) => `Los efectos de los eventos aleatorios son un ${level * 10}% más fuertes.`,
        cost: (level) => 120 + (level * 25),
        level: 0, maxLevel: 5,
        bonus: { type: 'random_event_effect', multiplier: 1.10 },
        icon: <MagicIcon />, requires: 'fateful_whispers', x: 70, y: 85,
    },
     {
        id: 'star_caller', name: 'Llamador de Estrellas',
        description: () => `Una Estrella Fugaz aparece garantizada cada vez que prestigias.`,
        cost: () => 500, level: 0, maxLevel: 1,
        bonus: { type: 'unlock_upgrade', upgradeId: 'star_caller_ability' }, // Handled as a special case
        icon: <StarIcon />, requires: 'amplified_reality', x: 80, y: 92,
    },

    // --- Top Path (Esoteric Knowledge) ---
    {
        id: 'knowledge_is_power', name: 'El Conocimiento es Poder',
        description: (level) => `Cada logro desbloqueado otorga un +${level * 0.5}% a la producción global.`,
        cost: (level) => 50 + Math.pow(level, 2) * 10,
        level: 0, maxLevel: 10,
        bonus: { type: 'achievement_bonus', multiplier_per_achievement: 0.005 },
        icon: <TrophyIcon />, requires: 'perm_boost_1', x: 38, y: 12,
    },
    {
        id: 'prestige_cascade', name: 'Cascada de Prestigio',
        description: (level) => `Gana un ${level * 2}% más de Puntos de Prestigio.`,
        cost: (level) => 100 + Math.pow(level, 2.2) * 15,
        level: 0, maxLevel: 25,
        bonus: { type: 'prestige_point_bonus', multiplier: 1.02 },
        icon: <GalaxyIcon />, requires: 'knowledge_is_power', x: 28, y: 8,
    },
    {
        id: 'alchemical_singularity', name: 'Singularidad Alquímica',
        description: () => `Desbloquea la mejora final secreta.`,
        cost: () => 1000, level: 0, maxLevel: 1,
        bonus: { type: 'unlock_upgrade', upgradeId: 'alchemical_singularity' },
        icon: <InfinityIcon />, requires: 'prestige_cascade', x: 18, y: 4,
    },
    
    // --- Previous new upgrades ---
    {
        id: 'ultimate_ascension', name: 'Ascensión Definitiva',
        description: () => `Aumenta el nivel máximo de TODAS las mejoras en +10.`,
        cost: () => 500, level: 0, maxLevel: 1,
        bonus: { type: 'increase_max_level', upgradeIds: INITIAL_UPGRADES.map(u => u.id), amount: 10 },
        icon: <UpgradeCapIcon />, requires: 'ascension_5', x: 5, y: 65,
    },
    {
        id: 'eternal_gold', name: 'Oro Eterno',
        description: () => `Aumenta la duración de las Gotas Doradas en un 50% adicional.`,
        cost: () => 100, level: 0, maxLevel: 1,
        bonus: { type: 'golden_droplet_duration', multiplier: 1.50 },
        icon: <GoldenDropletIcon />, requires: 'lingering_gold', x: 40, y: 62,
    },
    {
        id: 'surge_affinity', name: 'Afinidad de Oleadas',
        description: () => `Aumenta la duración de las Oleadas de Mejoras en un 50%.`,
        cost: () => 150, level: 0, maxLevel: 1,
        bonus: { type: 'random_event_effect', multiplier: 1.50 }, // Affects duration via the effect multiplier
        icon: <MagicIcon />, requires: 'fateful_whispers', x: 40, y: 78,
    },
    {
        id: 'herbalism_power', name: 'Poder de Herbolaria',
        description: () => `Las mejoras de Herbolaria Avanzada son 4 veces más potentes.`,
        cost: () => 60, level: 0, maxLevel: 1,
        requires: 'power_2',
        bonus: { type: 'increase_power_multiplier', upgradeIds: ['potion_lab', 'infused_gloves', 'grimoire', 'moon_tears'], multiplier: 4 },
        icon: <PowerIcon />, x: 80, y: 28,
    },
    {
        id: 'focused_stirring', name: 'Agitación Enfocada',
        description: () => `La 'Varita de Alquimista' y la 'Agitación Lunar' son 3 veces más potentes.`,
        cost: () => 90, level: 0, maxLevel: 1,
        requires: 'click_power_perm',
        bonus: { type: 'increase_power_multiplier', upgradeIds: ['alchemist_wand', 'lunar_stir'], multiplier: 3 },
        icon: <PotionIcon />, x: 90, y: 32,
    },

    // --- NEW SYNERGY & MECHANICS UPGRADES ---
    // Chronomancer Branch (Top-Right)
    {
        id: 'prestige_burst_essence', name: 'Explosión de Prestigio',
        description: (level) => `Comienza cada prestigio con un ${level * 0.5}% de tus Puntos de Prestigio no gastados como esencia.`,
        cost: (level) => 25 + Math.pow(level, 2) * 5, maxLevel: 10, level: 0,
        bonus: { type: 'prestige_burst_essence', percent_of_pp: 0.005 },
        icon: <RocketIcon />, requires: 'starting_cycles_1', x: 65, y: 20,
    },
    {
        id: 'prestige_boost_click', name: 'Frenesí Temporal',
        description: () => `Obtén un multiplicador de agitación de x10 durante los primeros 60 segundos después de prestigiar.`,
        cost: () => 100, maxLevel: 1, level: 0,
        bonus: { type: 'prestige_boost', boost_type: 'click', multiplier: 10, duration: 60 },
        icon: <StopwatchIcon />, requires: 'prestige_burst_essence', x: 75, y: 15,
    },
    {
        id: 'prestige_boost_eps', name: 'Flujo Temporal',
        description: () => `Obtén un multiplicador de EPS de x5 durante los primeros 60 segundos después de prestigiar.`,
        cost: () => 120, maxLevel: 1, level: 0,
        bonus: { type: 'prestige_boost', boost_type: 'eps', multiplier: 5, duration: 60 },
        icon: <StopwatchIcon />, requires: 'prestige_boost_click', x: 85, y: 10,
    },
    {
        id: 'master_chronomancer', name: 'Maestro Crononauta',
        description: (level) => `Aumenta la duración de los impulsos de prestigio en un ${level * 25}%.`,
        cost: (level) => 200 * (level + 1), maxLevel: 4, level: 0,
        bonus: { type: 'prestige_boost_duration_multiplier', multiplier: 1.25 },
        icon: <StopwatchIcon />, requires: 'prestige_boost_eps', x: 95, y: 5,
    },

    // Meta/Knowledge Branch (Top-Center/Top-Left)
    {
        id: 'xp_multiplier', name: 'Saber Arcano',
        description: (level) => `Gana un ${level * 10}% más de XP de todas las fuentes.`,
        cost: (level) => 75 * (level + 1), maxLevel: 10, level: 0,
        bonus: { type: 'xp_multiplier', multiplier: 1.10 },
        icon: <TrophyIcon />, requires: 'knowledge_is_power', x: 50, y: 5,
    },
    {
        id: 'meta_perm_boost', name: 'Esencia Amplificada',
        description: (level) => `Aumenta la bonificación de 'Fuente de Maná Permanente' en un ${level * 10}% (multiplicativo).`,
        cost: (level) => 150 + Math.pow(level, 2) * 20, maxLevel: 5, level: 0,
        bonus: { type: 'meta_perm_boost_multiplier', multiplier: 1.10 },
        icon: <StarIcon />, requires: 'xp_multiplier', x: 62, y: 8,
    },
    {
        id: 'prestige_cost_reduction', name: 'Sabiduría Cósmica',
        description: (level) => `Reduce el coste de todas las mejoras de prestigio en un ${level * 2}%.`,
        cost: (level) => 200 + Math.pow(level, 2) * 30, maxLevel: 10, level: 0,
        bonus: { type: 'prestige_cost_reduction', multiplier: 0.98 },
        icon: <GalaxyIcon />, requires: 'prestige_cascade', x: 20, y: 0,
    },
    {
        id: 'ascension_pp_synergy', name: 'Eco de Ascensión',
        description: () => `Cada mejora de 'Ascensión' comprada aumenta la ganancia de Puntos de Prestigio en un 5%.`,
        cost: () => 300, maxLevel: 1, level: 0,
        bonus: { type: 'ascension_pp_synergy', multiplier: 1.05 },
        icon: <PlusCircleIcon />, requires: ['ascension_2', 'prestige_cascade'], x: 20, y: 20,
    },

    // Synergy Branch (Center)
    {
        id: 'click_to_auto_synergy', name: 'Sinergia Cinética',
        description: (level) => `El ${level * 0.1}% de tu poder de agitación total se añade a tu EPS total.`,
        cost: (level) => 120 + (level * 20), maxLevel: 10, level: 0,
        bonus: { type: 'click_to_auto_synergy', value: 0.001 },
        icon: <PlusCircleIcon />, requires: 'click_synergy_1', x: 40, y: 40,
    },
    {
        id: 'auto_to_click_synergy', name: 'Sinergia Potencial',
        description: (level) => `El ${level * 0.01}% de tu EPS base se añade a tu poder de agitación base.`,
        cost: (level) => 120 + (level * 20), maxLevel: 10, level: 0,
        bonus: { type: 'auto_to_click_synergy', value: 0.0001 },
        icon: <PlusCircleIcon />, requires: 'click_synergy_1', x: 60, y: 40,
    },
    {
        id: 'synergy_nexus', name: 'Nexo de Sinergia',
        description: () => `Triplica los efectos de todas las mejoras de Sinergia.`,
        cost: () => 1000, maxLevel: 1, level: 0,
        bonus: { type: 'increase_power_multiplier', upgradeIds: [], multiplier: 3 }, // Special handling in App.tsx
        icon: <ElementalIcon />, requires: ['auto_to_click_synergy', 'click_to_auto_synergy'], x: 50, y: 41,
    },

    // Deeper Fortune & Power
    {
        id: 'golden_droplet_eps_boost', name: 'Lluvia Dorada',
        description: () => `Las Gotas Doradas también otorgan un multiplicador de EPS de x2 durante 20 segundos.`,
        cost: () => 400, maxLevel: 1, level: 0,
        bonus: { type: 'golden_droplet_secondary_boost', boost_type: 'eps', multiplier: 2, duration: 20 },
        icon: <GoldenDropletIcon />, requires: 'gilded_essence', x: 38, y: 72,
    },
    {
        id: 'surge_discount_increase', name: 'Oleada Potenciada',
        description: (level) => `Aumenta el descuento de la Oleada de Mejoras en un ${level * 2}% adicional.`,
        cost: (level) => 180 + (level * 30), maxLevel: 5, level: 0,
        bonus: { type: 'random_event_effect', multiplier: 1.05 }, // Simplified to use general effect
        icon: <MagicIcon />, requires: 'amplified_reality', x: 62, y: 92,
    },
    {
        id: 'catalyst_synergy', name: 'Doble Catalizador',
        description: () => `La bonificación de 'Catalizador de Esencia' también se aplica a la segunda mejora de cada tier.`,
        cost: () => 800, maxLevel: 1, level: 0,
        bonus: { type: 'increase_power_multiplier', upgradeIds: [], multiplier: 1 }, // Special handling in App.tsx
        icon: <ElementalIcon />, requires: 'first_in_tier_power', x: 95, y: 65,
    },
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
        description: 'Gana 5 millones de esencia en menos de 5 minutos.',
        duration: 300, // 5 minutes
        objective: { type: 'earn_essence', value: 5e6 },
        reward: { type: 'prestige_points', value: 5 },
        icon: <CauldronIcon />,
        unlockCondition: { type: 'prestiges', value: 1 }
    },
    {
        id: 'cauldron_50',
        name: 'Producción en Masa',
        description: 'Lleva tu Caldero Autorevolvedor al nivel 75 en 5 minutos.',
        duration: 300,
        objective: { type: 'upgrade_level', upgradeId: 'self_stir_cauldron', value: 75 },
        reward: { type: 'prestige_points', value: 10 },
        icon: <CauldronIcon />,
        unlockCondition: { type: 'prestiges', value: 1 }
    },
    {
        id: 'earn_1b',
        name: 'Fiebre del Billón',
        description: 'Gana 10 billones de esencia en menos de 3 minutos.',
        duration: 180, // 3 minutes
        objective: { type: 'earn_essence', value: 1e10 },
        reward: { type: 'prestige_points', value: 25 },
        icon: <LightningIcon />,
        unlockCondition: { type: 'prestiges', value: 3 }
    }
];

// Random Events Config
export const BASE_RANDOM_EVENT_CONFIG = {
    TICK_INTERVAL: 15000, // Check for an event every 15 seconds
    EVENT_CHANCE: 0.30,   // 30% chance per tick
    EVENTS: [
        { 
            type: 'ESSENCE_FRENZY', 
            weight: 40,
            duration: 15, // seconds
            multiplier: 5,
        },
        { 
            type: 'UPGRADE_SURGE', 
            weight: 30,
            duration: 20, // seconds
            discount: 0.90, // 90% discount
        },
        { 
            type: 'SHOOTING_STAR', 
            weight: 30,
            duration: 5, // seconds to cross screen
            rewardMinutesCps: 2, // 2 minutes worth of CPS
        },
    ]
};