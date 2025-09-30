import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { PrestigeUpgrade } from '../types';
import PrestigeNode from './PrestigeNode';

interface PrestigeTreeViewProps {
    prestigeUpgrades: PrestigeUpgrade[];
    prestigePoints: number;
    onPurchase: (id: string) => void;
}

const PrestigeTreeView: React.FC<PrestigeTreeViewProps> = ({ prestigeUpgrades, prestigePoints, onPurchase }) => {
    const [view, setView] = useState({ x: 0, y: 0, zoom: 1 });
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    
    const upgradesMap = useMemo(() => new Map(prestigeUpgrades.map(u => [u.id, u])), [prestigeUpgrades]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        isDragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
        if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging.current) return;
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        setView(v => ({ ...v, x: v.x + dx, y: v.y + dy }));
        lastPos.current = { x: e.clientX, y: e.clientY };
    }, []);

    const handleMouseUp = useCallback(() => {
        isDragging.current = false;
        if (containerRef.current) containerRef.current.style.cursor = 'grab';
    }, []);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const zoomFactor = 1.1;
        const newZoom = e.deltaY > 0 ? view.zoom / zoomFactor : view.zoom * zoomFactor;
        const clampedZoom = Math.max(0.5, Math.min(2, newZoom));
        
        const rect = containerRef.current!.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const newX = mouseX - (mouseX - view.x) * (clampedZoom / view.zoom);
        const newY = mouseY - (mouseY - view.y) * (clampedZoom / view.zoom);

        setView({ x: newX, y: newY, zoom: clampedZoom });
    }, [view]);

    // Set initial view to center the tree
    useEffect(() => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setView(v => ({...v, x: width / 2 - (50 * 10), y: height / 2 - (50 * 10)}));
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-full bg-slate-900 overflow-hidden relative cursor-grab"
            style={{
                background: `radial-gradient(ellipse at center, #1e293b 0%, #0f172a 100%)`,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
        >
            <div
                className="absolute top-0 left-0"
                style={{
                    transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
                    transformOrigin: '0 0',
                    width: '1000px',
                    height: '1000px',
                }}
            >
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" >
                    {prestigeUpgrades.map(upgrade => {
                        if (!upgrade.requires) return null;
                        const parent = upgradesMap.get(upgrade.requires);
                        if (!parent) return null;
                        
                        const isUnlocked = parent.level > 0;

                        return (
                            <line
                                key={`${parent.id}-${upgrade.id}`}
                                x1={`${parent.x}%`}
                                y1={`${parent.y}%`}
                                x2={`${upgrade.x}%`}
                                y2={`${upgrade.y}%`}
                                stroke={isUnlocked ? 'rgba(192, 132, 252, 0.5)' : 'rgba(71, 85, 105, 0.5)'}
                                strokeWidth={4 / view.zoom}
                                strokeDasharray={isUnlocked ? 'none' : `${8 / view.zoom}`}
                                className="transition-all duration-300"
                            />
                        );
                    })}
                </svg>
                {prestigeUpgrades.map(upgrade => (
                    <PrestigeNode
                        key={upgrade.id}
                        upgrade={upgrade}
                        prestigePoints={prestigePoints}
                        onPurchase={onPurchase}
                        upgradesMap={upgradesMap}
                    />
                ))}
            </div>
        </div>
    );
};

export default PrestigeTreeView;
