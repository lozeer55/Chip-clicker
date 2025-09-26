
import React, { useEffect } from 'react';
import { GoldenChipIcon } from '../constants';
import type { GoldenChipType } from '../types';

interface GoldenChipProps {
  goldenChip: GoldenChipType;
  onClick: (id: number) => void;
  onDisappeared: (id: number) => void;
}

const GoldenChip: React.FC<GoldenChipProps> = ({ goldenChip, onClick, onDisappeared }) => {
    
    useEffect(() => {
        let timeout: number | undefined;
        if (goldenChip.status === 'clicked') {
            timeout = setTimeout(() => onDisappeared(goldenChip.id), 400); // collect animation
        } else if (goldenChip.status === 'missed') {
            timeout = setTimeout(() => onDisappeared(goldenChip.id), 500); // fade out animation
        }
        return () => clearTimeout(timeout);
    }, [goldenChip.status, goldenChip.id, onDisappeared]);

    const getAnimationClass = () => {
        switch(goldenChip.status) {
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
                left: `${goldenChip.x}%`,
                top: `${goldenChip.y}%`,
                transform: 'translate(-50%, -50%)',
            }}
            onClick={goldenChip.status === 'visible' ? () => onClick(goldenChip.id) : undefined}
        >
            <div className={`w-16 h-16 text-pink-400 ${goldenChip.status === 'visible' ? 'animate-golden-bob cursor-pointer' : ''}`}>
                 <GoldenChipIcon />
            </div>
        </div>
    );
};

export default GoldenChip;