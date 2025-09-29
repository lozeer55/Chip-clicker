import React from 'react';
import type { MobileView } from '../types';

interface MobileNavProps {
    activeView: MobileView;
    setView: (view: MobileView) => void;
}

const MainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 256 256" fill="currentColor">
        <rect width="256" height="256" fill="none"/>
        <line x1="96" y1="32" x2="160" y2="32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <path d="M192,112.9V216a8,8,0,0,1-8,8H72a8,8,0,0,1-8-8V112.9a64,64,0,1,1,128,0Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
);


const BuildingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 256 256" fill="currentColor"><rect width="256" height="256" fill="none"/><path d="M216,128v40a48,48,0,0,1-48,48H88a48,48,0,0,1-48-48V128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="40" y1="128" x2="216" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M168,48a24,24,0,0,1-48,0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="144" y1="48" x2="144" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);

const StoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 256 256" fill="currentColor"><rect width="256" height="256" fill="none"/><path d="M213.2,58.4,188,30.6a8,8,0,0,0-5.8-2.6H73.8a8,8,0,0,0-5.8,2.6L42.8,58.4A8,8,0,0,0,40,64v40a8,8,0,0,0,8,8h56v8H80a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16h-24v-8h56a8,8,0,0,0,8-8V64A8,8,0,0,0,213.2,58.4Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="16" y1="184" x2="240" y2="184" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="168" y1="120" x2="168" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="88" y1="120" x2="88" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);

const NavButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1 w-full pt-2 pb-1 transition-colors duration-200 ${
            isActive ? 'text-pink-400' : 'text-slate-400 hover:text-pink-300'
        }`}
        aria-current={isActive ? 'page' : undefined}
    >
        {icon}
        <span className="text-xs font-bold">{label}</span>
        <div className={`h-1 w-8 rounded-full mt-1 ${isActive ? 'bg-pink-400' : 'bg-transparent'}`}></div>
    </button>
);

const MobileNav: React.FC<MobileNavProps> = ({ activeView, setView }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/80 flex items-center justify-around z-40 lg:hidden">
            <NavButton
                icon={<MainIcon />}
                label="Poción"
                isActive={activeView === 'main'}
                onClick={() => setView('main')}
            />
            <NavButton
                icon={<BuildingsIcon />}
                label="Laboratorio"
                isActive={activeView === 'buildings'}
                onClick={() => setView('buildings')}
            />
            <NavButton
                icon={<StoreIcon />}
                label="Tienda"
                isActive={activeView === 'upgrades'}
                onClick={() => setView('upgrades')}
            />
        </nav>
    );
};

export default MobileNav;