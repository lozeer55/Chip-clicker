import React, { useEffect } from 'react';
import { GoldenDropletIcon } from '../constants';
import type { GoldenDropletType } from '../types';

interface GoldenDropletProps {
  goldenDroplet: GoldenDropletType;
  onClick: (id: number) => void;
  onDisappeared: (id: number) => void;
}

const GoldenDroplet: React.FC<GoldenDropletProps> = ({ goldenDroplet, onClick, onDisappeared }) => {
    
    useEffect(() => {
        let timeout: number | undefined;
        if (goldenDroplet.status === 'clicked') {
            timeout = setTimeout(() => onDisappeared(goldenDroplet.id), 400); // collect animation
        } else if (goldenDroplet.status === 'missed') {
            timeout = setTimeout(() => onDisappeared(goldenDroplet.id), 500); // fade out animation
        }
        return () => clearTimeout(timeout);
    }, [goldenDroplet.status, goldenDroplet.id, onDisappeared]);

    const getAnimationClass = () => {
        switch(goldenDroplet.status) {
            case 'visible': return 'animate-fade-in-scale';
            case 'clicked': return 'animate-collect-effect';
            case 'missed': return 'animate-fade-out';
            default: return '';
        }
    };
    
    return (
        <div
            className={`absolute z-40 drop-shadow-[0_0_15px_rgba(236,72,153,0.7)] ${getAnimationClass()}`}
            style={{
                left: `${goldenDroplet.x}%`,
                top: `${goldenDroplet.y}%`,
                transform: 'translate(-50%, -50%)',
            }}
            onClick={goldenDroplet.status === 'visible' ? () => onClick(goldenDroplet.id) : undefined}
        >
            <div className={`w-16 h-16 text-pink-400 ${goldenDroplet.status === 'visible' ? 'animate-golden-bob cursor-pointer' : ''}`}>
                 <GoldenDropletIcon />
            </div>
        </div>
    );
};

export default GoldenDroplet;