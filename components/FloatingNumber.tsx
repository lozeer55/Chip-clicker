
import React, { useEffect } from 'react';

interface FloatingNumberProps {
  value: number;
  x: number;
  y: number;
  onAnimationEnd: () => void;
  isBoosted?: boolean;
}

const FloatingNumber: React.FC<FloatingNumberProps> = ({ value, x, y, onAnimationEnd, isBoosted = false }) => {
  useEffect(() => {
    const timer = setTimeout(onAnimationEnd, 1200); // Must match animation duration
    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  const textClass = isBoosted 
    ? "text-orange-400 text-5xl font-extrabold"
    : "text-yellow-400 text-4xl font-black";

  return (
    <div
      className={`absolute animate-float-up pointer-events-none ${textClass} font-mono`}
      style={{ 
        left: `${x}px`, 
        top: `${y}px`, 
        transform: 'translateX(-50%)',
        textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)'
      }}
    >
      +{value.toLocaleString()}
    </div>
  );
};

export default FloatingNumber;