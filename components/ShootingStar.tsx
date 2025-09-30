import React, { useEffect } from 'react';
import { StarIcon } from '../constants';
import type { ShootingStarType } from '../types';

interface ShootingStarProps {
  star: ShootingStarType;
  onClick: (id: number) => void;
  onDisappeared: (id: number) => void;
}

const ShootingStar: React.FC<ShootingStarProps> = ({ star, onClick, onDisappeared }) => {
    
    useEffect(() => {
        let timeout: number | undefined;
        if (star.status === 'clicked') {
            timeout = setTimeout(() => onDisappeared(star.id), 400); // collect animation
        } else if (star.status === 'missed') {
            timeout = setTimeout(() => onDisappeared(star.id), 500); // fade out animation
        } else {
            // If not clicked, it becomes 'missed' after its duration
            timeout = setTimeout(() => onDisappeared(star.id), star.duration * 1000);
        }
        return () => clearTimeout(timeout);
    }, [star.status, star.id, star.duration, onDisappeared]);

    const getAnimationClass = () => {
        switch(star.status) {
            case 'visible': return 'animate-shooting-star';
            case 'clicked': return 'animate-collect-effect';
            case 'missed': return 'animate-fade-out';
            default: return '';
        }
    };
    
    return (
        <div
            className={`absolute z-40 drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] ${getAnimationClass()}`}
            style={{
                '--start-x': `${star.startX}px`,
                '--start-y': `${star.startY}px`,
                '--end-x': `${star.endX}px`,
                '--end-y': `${star.endY}px`,
                animationDuration: `${star.duration}s`,
                top: 0,
                left: 0,
            } as React.CSSProperties}
            onClick={star.status === 'visible' ? () => onClick(star.id) : undefined}
        >
            <div className={`relative w-12 h-12 text-yellow-300 shooting-star-trail ${star.status === 'visible' ? 'cursor-pointer' : ''}`}>
                 <StarIcon />
            </div>
        </div>
    );
};

export default ShootingStar;