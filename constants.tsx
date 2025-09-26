import React from 'react';
import type { Upgrade, Milestone, UpgradeTier, Achievement } from './types';

// PHOSPHOR ICONS
const CursorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <rect width="256" height="256" fill="none"/>
        <path d="M213.3,95.6,45.2,21.5A16,16,0,0,0,20.6,38.2L84.8,206.3a16,16,0,0,0,30.3,3.9l36.6-81.6,81.6-36.6a16,16,0,0,0-3.9-30.3Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
);
const RobotIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <rect width="256" height="256" fill="none"/><rect x="56" y="48" width="144" height="128" rx="16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <circle cx="96" cy="112" r="12"/><circle cx="160" cy="112" r="12"/>
        <line x1="96" y1="144" x2="160" y2="144" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="24" y1="144" x2="56" y2="144" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="200" y1="144" x2="232" y2="144" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="96" y1="176" x2="96" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="160" y1="176" x2="160" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
);
const FactoryIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <rect width="256" height="256" fill="none"/><path d="M240,208H16.8a8,8,0,0,1-7.2-12.8L40,144V48a8,8,0,0,1,8-8H160a8,8,0,0,1,8,8v56l40.3,35.8A32,32,0,0,1,240,208Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="40" y1="144" x2="168" y2="144" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="88" y1="88" x2="88" y2="104" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="120" y1="88" x2="120" y2="104" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
);
const TruckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <rect width="256" height="256" fill="none"/><path d="M216,88H168a8,8,0,0,0-8,8V200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="160" y1="200" x2="48" y2="200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <path d="M48,200H24a8,8,0,0,1-8-8V72a8,8,0,0,1,8-8H176l48,40V200a8,8,0,0,1-8-8H192" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <circle cx="72" cy="200" r="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <circle cx="192" cy="200" r="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
);
const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <ellipse cx="128" cy="128" rx="40" ry="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="32" y1="128" x2="224" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
);
const ChipIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <rect width="256" height="256" fill="none"/>
        <line x1="168" y1="56" x2="200" y2="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="168" y1="88" x2="200" y2="88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="168" y1="120" x2="200" y2="120" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="168" y1="152" x2="200" y2="152" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="168" y1="184" x2="200" y2="184" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="56" y1="88" x2="88" y2="88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="56" y1="120" x2="88" y2="120" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="56" y1="152" x2="88" y2="152" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="56" y1="184" x2="88" y2="184" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <rect x="88" y="88" width="80" height="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="56" y1="56" x2="88" y2="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
);
export const GoldenChipIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <defs>
            <filter id="gold-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -5" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
            </filter>
        </defs>
        <g filter="url(#gold-glow)">
          <line x1="168" y1="56" x2="200" y2="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="168" y1="88" x2="200" y2="88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="168" y1="120" x2="200" y2="120" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="168" y1="152" x2="200" y2="152" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="168" y1="184" x2="200" y2="184" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="56" y1="88" x2="88" y2="88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="56" y1="120" x2="88" y2="120" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="56" y1="152" x2="88" y2="152" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="56" y1="184" x2="88" y2="184" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
          <rect x="88" y="88" width="80" height="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="56" y1="56" x2="88" y2="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
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
export const LightningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 256 256">
        <path d="M227.4,116.2,98.6,245a12,12,0,0,1-22-10.2V144H32a12,12,0,0,1-9.4-19.8L157.4,11a12,12,0,0,1,22,10.2V112h44.8A12,12,0,0,1,227.4,116.2Z"/>
    </svg>
);
export const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 256 256">
        <path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96v96a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96Z"/>
    </svg>
);
const CircuitryIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <rect width="256" height="256" fill="none"/><line x1="160" y1="48" x2="160" y2="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="128" y1="80" x2="160" y2="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <circle cx="180" cy="100" r="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="200" y1="100" x2="240" y2="100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="16" y1="152" x2="64" y2="152" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <circle cx="84" cy="152" r="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="104" y1="152" x2="128" y2="152" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="128" y1="128" x2="128" y2="176" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="128" y1="80" x2="128" y2="48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="128" y1="48" x2="48" y2="48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="48" y1="48" x2="48" y2="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <rect x="28" y="92" width="40" height="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
);
const HardDrivesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="64" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <rect x="40" y="152" width="176" height="64" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="88" y1="72" x2="120" y2="72" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="88" y1="184" x2="120" y2="184" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
);
const BrainIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <rect width="256" height="256" fill="none"/><path d="M128,26.5c-44.1,0-72.9,23.3-85.4,39.2a15.9,15.9,0,0,0-2.4,14.6S54,115.6,56.5,128,40.4,166.4,40.2,166.6a16,16,0,0,0,2.4,14.6c12.6,15.9,41.4,38.3,85.4,38.3s72.8-22.4,85.4-38.3a16,16,0,0,0,2.4-14.6c-.2-.2-16.3-37.5-16.3-48.5s13.8-35.3,13.8-35.3a15.9,15.9,0,0,0-2.4-14.6C200.8,49.8,172.1,26.5,128,26.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <path d="M128,144v85.5c24-4.2,40-19.3,40-37.5,0-18.4-32-35.4-32-56.9,0-22.7,21-36.9,32-44.1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <path d="M128,144V26.5c-24,4.2-40,19.3-40,37.5,0,18.4,32,35.4,32,56.9,0,22.7-21,36.9-32,44.1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
);
const AtomIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
        <rect width="256" height="256" fill="none"/><ellipse cx="128" cy="128" rx="32" ry="88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <ellipse cx="128" cy="128" rx="88" ry="32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <ellipse cx="128" cy="128" rx="60.3" ry="60.3" transform="translate(-53 128) rotate(-45)" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <ellipse cx="128" cy="128" rx="60.3" ry="60.3" transform="translate(128 -53) rotate(45)" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <circle cx="128" cy="128" r="8"/>
    </svg>
);
const QuantumNetworkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="44" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M139.3,55.3a88,88,0,1,1-22.6,0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M55.3,116.7a88,88,0,1,1,0,22.6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><circle cx="128" cy="40" r="12"/><circle cx="40" cy="128" r="12"/><circle cx="128" cy="216" r="12"/><circle cx="216" cy="128" r="12"/></svg>
);
const NanitesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><path d="M128,24,56,64v80l72,40,72-40V64Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M104.7,196.4,56,168V112" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M151.3,196.4,200,168V112" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M200,88,151.3,60.4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M56,88l48.7-27.6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M128,124,104.7,110" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M151.3,110,128,124v32l23.3,14" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="104.7" y1="156" x2="128" y2="170" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);
const ChronoAcceleratorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><polyline points="128 72 128 128 168 128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M188,40.7a96.2,96.2,0,0,1,27.3,87.3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><polyline points="216 80 215.3 128 168 120" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);
const DataWormholeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><path d="M223.2,88.4a96,96,0,0,1-190.4,0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M32.8,167.6a96,96,0,0,1,190.4,0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="88" y1="128" x2="168" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="128" y1="164" x2="128" y2="92" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);
const DysonSwarmIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M128,72.7V32a96,96,0,0,1,0,192V183.3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M183.3,128H224A96,96,0,0,0,32,128H72.7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M172,84l34.4-34.4a95.9,95.9,0,0,1,0,136.8L172,172" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M84,84,49.6,49.6a95.9,95.9,0,0,0,0,136.8L84,172" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);
const GalacticMainframeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><path d="M216,80H40a8,8,0,0,0-8,8V168a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V88A8,8,0,0,0,216,80Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M104.3,215.3,80,240" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M151.7,215.3,176,240" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M176.3,40.7,152,64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M103.7,40.7,128,64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M40.7,64.3,16,88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M215.3,64.3,240,88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="64" y1="128" x2="88" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);
const RealityEngineIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><path d="M80,144H32V96l48,24Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M176,144h48V96l-48,24Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M160,224.7V176l-32,16-32-16v48.7Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M160,31.3V80l-32-16-32,16V31.3Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="80" y1="144" x2="96" y2="176" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="176" y1="144" x2="160" y2="176" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="80" y1="120" x2="96" y2="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="176" y1="120" x2="160" y2="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);
const OmniProcessorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}><rect width="256" height="256" fill="none"/><path d="M128,32,48.2,72,128,112l79.8-40Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M207.8,184,128,224,48.2,184" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M207.8,72,128,112V224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="48.2" y1="72" x2="128" y2="112" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);


export const UPGRADE_TIERS: UpgradeTier[] = [
  {
    name: "Core Components",
    unlockCondition: { type: 'none' },
    upgrades: [
      { id: 'cursor1', name: 'Faster Clock Speed', description: '+1 cycle per click', baseCost: 50, costGrowth: 1.25, level: 0, type: 'click', power: 1, icon: <CursorIcon /> },
      { id: 'monkey', name: 'Auto-Compiler', description: '+1 cycle per second', baseCost: 500, costGrowth: 1.28, level: 0, type: 'auto', power: 1, icon: <RobotIcon /> },
    ]
  },
  {
    name: "System Expansion",
    unlockCondition: { type: 'totalLevels', requiredLevels: 10 },
    upgrades: [
      { id: 'cursor2', name: 'Overclocked CPU', description: '+8 cycles per click', baseCost: 5000, costGrowth: 1.30, level: 0, type: 'click', power: 8, icon: <CursorIcon /> },
      { id: 'plantation', name: 'Data Farm', description: '+6 cycles per second', baseCost: 12000, costGrowth: 1.29, level: 0, type: 'auto', power: 6, icon: <ChipIcon /> },
    ]
  },
  {
    name: "Industrial Automation",
    unlockCondition: { type: 'totalLevels', requiredLevels: 25 },
    upgrades: [
      { id: 'factory', name: 'Fabrication Plant', description: '+40 cycles per second', baseCost: 150000, costGrowth: 1.30, level: 0, type: 'auto', power: 40, icon: <FactoryIcon /> },
    ]
  },
  {
    name: "High-Performance Computing",
    unlockCondition: { type: 'totalLevels', requiredLevels: 40 },
    upgrades: [
      { id: 'harvester', name: 'Quantum Clicker', description: '+100 per click', baseCost: 1e6, costGrowth: 1.35, level: 0, type: 'click', power: 100, icon: <CircuitryIcon /> },
      { id: 'hydroponics', name: 'Server Rack', description: '+150 cycles per second', baseCost: 1.2e6, costGrowth: 1.31, level: 0, type: 'auto', power: 150, icon: <HardDrivesIcon /> },
    ]
  },
  {
    name: "Global Networking",
    unlockCondition: { type: 'totalLevels', requiredLevels: 55 },
    upgrades: [
        { id: 'shipment', name: 'Global Network', description: '+200 cycles per second', baseCost: 5e6, costGrowth: 1.32, level: 0, type: 'auto', power: 200, icon: <TruckIcon /> },
    ]
  },
  {
    name: "Exotic Technology",
    unlockCondition: { type: 'totalLevels', requiredLevels: 70 },
    upgrades: [
        { id: 'portal', name: 'Wormhole Connection', description: '+1,200 cycles per second', baseCost: 6e7, costGrowth: 1.33, level: 0, type: 'auto', power: 1200, icon: <GlobeIcon /> },
    ]
  },
  {
    name: "Cosmic Computation",
    unlockCondition: { type: 'totalLevels', requiredLevels: 90 },
    upgrades: [
        { id: 'singularity', name: 'Singularity Core', description: '+1,000 per click', baseCost: 7.5e7, costGrowth: 1.38, level: 0, type: 'click', power: 1000, icon: <AtomIcon /> },
        { id: 'nebula', name: 'AI Supercluster', description: '+1,500 cycles per second', baseCost: 9e7, costGrowth: 1.34, level: 0, type: 'auto', power: 1500, icon: <BrainIcon /> },
    ]
  },
  {
    name: "Singularity Tech",
    unlockCondition: { type: 'totalLevels', requiredLevels: 120 },
    upgrades: [
      { id: 'quantum_network', name: 'Quantum Entanglement Network', description: '+12,000 CPS', baseCost: 1.5e9, costGrowth: 1.35, level: 0, type: 'auto', power: 12000, icon: <QuantumNetworkIcon /> },
      { id: 'nanites', name: 'Self-Replicating Nanites', description: '+10,000 per click', baseCost: 2e9, costGrowth: 1.39, level: 0, type: 'click', power: 10000, icon: <NanitesIcon /> },
    ]
  },
  {
    name: "Chronospatial Engineering",
    unlockCondition: { type: 'totalLevels', requiredLevels: 150 },
    upgrades: [
      { id: 'chrono', name: 'Chrono-Accelerator', description: '+80,000 CPS', baseCost: 2.5e10, costGrowth: 1.36, level: 0, type: 'auto', power: 80000, icon: <ChronoAcceleratorIcon /> },
      { id: 'data_wormhole', name: 'Data Wormhole', description: '+150,000 CPS', baseCost: 5e10, costGrowth: 1.37, level: 0, type: 'auto', power: 150000, icon: <DataWormholeIcon /> },
    ]
  },
  {
    name: "Hyperscale Infrastructure",
    unlockCondition: { type: 'totalLevels', requiredLevels: 180 },
    upgrades: [
      { id: 'dyson', name: 'Dyson Swarm', description: '+1.2 Million CPS', baseCost: 8e11, costGrowth: 1.38, level: 0, type: 'auto', power: 1.2e6, icon: <DysonSwarmIcon /> },
      { id: 'galactic_mainframe', name: 'Galactic Mainframe', description: '+2.5 Million CPS', baseCost: 1.5e12, costGrowth: 1.39, level: 0, type: 'auto', power: 2.5e6, icon: <GalacticMainframeIcon /> },
    ]
  },
  {
    name: "Universal Dominion",
    unlockCondition: { type: 'totalLevels', requiredLevels: 220 },
    upgrades: [
      { id: 'reality_engine', name: 'Reality Engine', description: '+50 Million CPS', baseCost: 3e14, costGrowth: 1.40, level: 0, type: 'auto', power: 5e7, icon: <RealityEngineIcon /> },
      { id: 'omni_processor', name: 'Omni-Processor', description: '+1 Billion per click', baseCost: 1e15, costGrowth: 1.45, level: 0, type: 'click', power: 1e9, icon: <OmniProcessorIcon /> },
    ]
  }
];

// Flatten the tiers to a single array for easier state management
export const INITIAL_UPGRADES: Upgrade[] = UPGRADE_TIERS.flatMap(tier => tier.upgrades);


export const MILESTONES: Milestone[] = [
    { name: "First Program", xpRequired: 250, reward: { type: 'click_multiplier', multiplier: 2, duration: 10 } },
    { name: "Code Wizard", xpRequired: 2000, reward: { type: 'click_multiplier', multiplier: 2, duration: 15 } },
    { name: "Data Miner", xpRequired: 15000, reward: { type: 'click_multiplier', multiplier: 3, duration: 15 } },
    { name: "Network Architect", xpRequired: 50000, reward: { type: 'bps_multiplier', multiplier: 2, duration: 30 } },
    { name: "Quantum Engineer", xpRequired: 200000, reward: { type: 'click_multiplier', multiplier: 4, duration: 20 } },
    { name: "AI Overlord", xpRequired: 750000, reward: { type: 'bps_multiplier', multiplier: 3, duration: 45 } },
    { name: "Digital Deity", xpRequired: 2e6, reward: { type: 'click_multiplier', multiplier: 5, duration: 30 } },
    { name: "Cosmic Coder", xpRequired: 1e7, reward: { type: 'bps_multiplier', multiplier: 4, duration: 60 } },
    { name: "Reality Hacker", xpRequired: 5e7, reward: { type: 'click_multiplier', multiplier: 10, duration: 45 } },
];

export const ACHIEVEMENTS: Achievement[] = [
    { id: 'click1', name: 'First Instruction', description: 'Click the chip 100 times.', icon: <CursorIcon />, condition: { type: 'totalClicks', value: 100 } },
    { id: 'click2', name: 'Click Enthusiast', description: 'Click the chip 1,000 times.', icon: <CursorIcon />, condition: { type: 'totalClicks', value: 1000 } },
    { id: 'click3', name: 'Click Master', description: 'Click the chip 10,000 times.', icon: <CursorIcon />, condition: { type: 'totalClicks', value: 10000 } },
    { id: 'earn1', name: 'First Byte', description: 'Earn a total of 1,000 cycles.', icon: <ChipIcon />, condition: { type: 'totalCycles', value: 1000 } },
    { id: 'earn2', name: 'Megabyte', description: 'Earn a total of 100,000 cycles.', icon: <ChipIcon />, condition: { type: 'totalCycles', value: 100000 } },
    { id: 'earn3', 'name': 'Gigabyte', 'description': 'Earn a total of 1,000,000 cycles.', icon: <ChipIcon />, condition: { type: 'totalCycles', value: 1e6 } },
    { id: 'earn4', 'name': 'Terabyte', 'description': 'Earn a total of 1 Trillion cycles.', icon: <ChipIcon />, condition: { type: 'totalCycles', value: 1e12 } },
    { id: 'upgrade1', name: 'First Bot', description: 'Build your first Auto-Compiler.', icon: <RobotIcon />, condition: { type: 'specificUpgradeLevel', upgradeId: 'monkey', value: 1 } },
    { id: 'upgrade2', name: 'Industrialist', description: 'Build a Fabrication Plant.', icon: <FactoryIcon />, condition: { type: 'specificUpgradeLevel', upgradeId: 'factory', value: 1 } },
    { id: 'upgrade3', name: 'Interdimensional', description: 'Open a Wormhole Connection.', icon: <GlobeIcon />, condition: { type: 'specificUpgradeLevel', upgradeId: 'portal', value: 1 } },
    { id: 'upgrade4', name: 'Stellar Engine', description: 'Construct a Dyson Swarm.', icon: <DysonSwarmIcon />, condition: { type: 'specificUpgradeLevel', upgradeId: 'dyson', value: 1 } },
    { id: 'level1', name: 'Tuned In', description: 'Level up Faster Clock Speed to level 10.', icon: <CursorIcon />, condition: { type: 'specificUpgradeLevel', upgradeId: 'cursor1', value: 10 } },
    { id: 'level2', name: 'Bot Army', description: 'Level up Auto-Compiler to level 25.', icon: <RobotIcon />, condition: { type: 'specificUpgradeLevel', upgradeId: 'monkey', value: 25 } },
    { id: 'level3', name: 'Collector', description: 'Own at least one of every upgrade.', icon: <TrophyIcon />, condition: { type: 'anyUpgradeLevel', value: 1 } },
];

// Golden Chip Config
export const GOLDEN_CHIP_LIFESPAN = 8000; // ms
export const GOLDEN_CHIP_SPAWN_INTERVAL_MIN = 30000; // ms
export const GOLDEN_CHIP_SPAWN_INTERVAL_MAX = 90000; // ms
export const GOLDEN_CHIP_BOOST_MULTIPLIER = 10;
export const GOLDEN_CHIP_BOOST_DURATION = 12; // seconds