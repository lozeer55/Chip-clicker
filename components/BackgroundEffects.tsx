import React, { useMemo } from 'react';

// A simple, stylized circuit board icon
const CircuitIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-green-500">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <path d="M9 9h6v6H9z"></path>
      <path d="M9 1v2"></path><path d="M15 1v2"></path>
      <path d="M9 21v2"></path><path d="M15 21v2"></path>
      <path d="M1 9h2"></path><path d="M1 15h2"></path>
      <path d="M21 9h2"></path><path d="M21 15h2"></path>
    </svg>
);


const BackgroundEffects: React.FC = () => {
    const particles = useMemo(() => {
        const particleCount = 25;
        return Array.from({ length: particleCount }).map((_, i) => {
            const size = 15 + Math.random() * 30; // 15px to 45px
            const animationDuration = 20 + Math.random() * 60; // 20s to 80s
            const animationDelay = -Math.random() * 40; // Start at various points
            const opacity = 0.05 + Math.random() * 0.1; // 0.05 to 0.15
            const top = `${Math.random() * 100}%`;

            return {
                id: i,
                top,
                size,
                opacity,
                animationDuration: `${animationDuration}s`,
                animationDelay: `${animationDelay}s`,
            };
        });
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
            {particles.map(particle => (
                <div 
                    key={particle.id} 
                    className="absolute animate-float-across"
                    style={{
                        top: particle.top,
                        left: '-100px', // Start off-screen
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        animationDuration: particle.animationDuration,
                        animationDelay: particle.animationDelay,
                        opacity: particle.opacity,
                    }}
                >
                    <CircuitIcon />
                </div>
            ))}
        </div>
    );
};

export default BackgroundEffects;