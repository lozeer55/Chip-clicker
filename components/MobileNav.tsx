import React, { useState, useEffect, useRef } from 'react';
import type { MobileView } from '../types';
import { TrophyIcon } from '../constants';

interface MobileNavProps {
    activeView: MobileView;
    setView: (view: MobileView) => void;
}

const MainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 256 256" fill="currentColor">
        <path d="M192,112.9V216a8,8,0,0,1-8,8H72a8,8,0,0,1-8-8V112.9a64,64,0,1,1,128,0Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
);


const BuildingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 256 256" fill="currentColor"><path d="M216,128v40a48,48,0,0,1-48,48H88a48,48,0,0,1-48-48V128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="40" y1="128" x2="216" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M168,48a24,24,0,0,1-48,0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="144" y1="48" x2="144" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);

const StoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 256 256" fill="currentColor"><path d="M213.2,58.4,188,30.6a8,8,0,0,0-5.8-2.6H73.8a8,8,0,0,0-5.8,2.6L42.8,58.4A8,8,0,0,0,40,64v40a8,8,0,0,0,8,8h56v8H80a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16h-24v-8h56a8,8,0,0,0,8-8V64A8,8,0,0,0,213.2,58.4Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="16" y1="184" x2="240" y2="184" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
);

const NavButton = React.forwardRef<HTMLButtonElement, {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}>(({ icon, label, isActive, onClick }, ref) => {
    const [pressed, setPressed] = useState(false);

    const handleClick = () => {
        setPressed(true);
        onClick();
        setTimeout(() => setPressed(false), 150);
    };

    return (
        <button
            ref={ref}
            onClick={handleClick}
            className={`relative flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200 z-10 ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            } ${pressed ? 'animate-chip-press' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            style={{ WebkitTapHighlightColor: 'transparent' }}
        >
            {icon}
            <span className="text-xs font-bold">{label}</span>
        </button>
    );
});

const MobileNav: React.FC<MobileNavProps> = ({ activeView, setView }) => {
    const [pillStyle, setPillStyle] = useState({});
    const mainRef = useRef<HTMLButtonElement>(null);
    const progressRef = useRef<HTMLButtonElement>(null);
    const buildingsRef = useRef<HTMLButtonElement>(null);
    const upgradesRef = useRef<HTMLButtonElement>(null);

    const viewRefs = {
        main: mainRef,
        progress: progressRef,
        buildings: buildingsRef,
        upgrades: upgradesRef,
    };

    useEffect(() => {
        const activeRef = viewRefs[activeView];
        if (activeRef.current) {
            const { offsetLeft, offsetWidth } = activeRef.current;
            setPillStyle({
                left: `${offsetLeft}px`,
                width: `${offsetWidth}px`,
            });
        }
    }, [activeView]);

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/80 flex items-center justify-around z-40 lg:hidden px-2">
            <div
                className="absolute top-1/2 -translate-y-1/2 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full shadow-lg transition-all duration-300 ease-in-out"
                style={pillStyle}
            />
            <NavButton
                ref={mainRef}
                icon={<MainIcon />}
                label="Poción"
                isActive={activeView === 'main'}
                onClick={() => setView('main')}
            />
            <NavButton
                ref={progressRef}
                icon={<TrophyIcon className="h-6 w-6" />}
                label="Progreso"
                isActive={activeView === 'progress'}
                onClick={() => setView('progress')}
            />
            <NavButton
                ref={buildingsRef}
                icon={<BuildingsIcon />}
                label="Laboratorio"
                isActive={activeView === 'buildings'}
                onClick={() => setView('buildings')}
            />
            <NavButton
                ref={upgradesRef}
                icon={<StoreIcon />}
                label="Tienda"
                isActive={activeView === 'upgrades'}
                onClick={() => setView('upgrades')}
            />
        </nav>
    );
};

export default MobileNav;