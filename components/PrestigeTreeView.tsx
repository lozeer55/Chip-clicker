import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { PrestigeUpgrade } from '../types';
import PrestigeNode from './PrestigeNode';

interface PrestigeTreeViewProps {
    prestigeUpgrades: PrestigeUpgrade[];
    prestigePoints: number;
    onRequestPurchase: (id: string) => void;
}

const PrestigeTreeView: React.FC<PrestigeTreeViewProps> = ({ prestigeUpgrades, prestigePoints, onRequestPurchase }) => {
    const [view, setView] = useState({ x: 0, y: 0, zoom: 1 });
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const pinchState = useRef({ initialDist: 0, isPinching: false });
    
    const upgradesMap = useMemo(() => new Map(prestigeUpgrades.map(u => [u.id, u])), [prestigeUpgrades]);

    const visibleUpgradesSet = useMemo(() => {
        const visible = new Set<string>();
        const purchasedIds = new Set<string>();

        prestigeUpgrades.forEach(u => {
            if (u.level > 0) {
                purchasedIds.add(u.id);
            }
        });

        // Determine which upgrades should be visible
        prestigeUpgrades.forEach(upgrade => {
            // Rule 1: Root nodes are always visible
            if (!upgrade.requires) {
                visible.add(upgrade.id);
                return;
            }
            
            const requirements = Array.isArray(upgrade.requires) ? upgrade.requires : [upgrade.requires];
            
            // Rule 2: A node is visible if all its requirements have been purchased
            if (requirements.every(reqId => purchasedIds.has(reqId))) {
                visible.add(upgrade.id);
            }
        });

        // Rule 3: Ensure the entire path to any purchased node is also visible
        const queue = [...purchasedIds];
        const visited = new Set<string>();

        while (queue.length > 0) {
            const currentId = queue.shift()!;
            if (visited.has(currentId)) continue;
            
            visited.add(currentId);
            visible.add(currentId); // Ensure node is in the visible set
            
            const node = upgradesMap.get(currentId);
            if (node?.requires) {
                const requirements = Array.isArray(node.requires) ? node.requires : [node.requires];
                requirements.forEach(reqId => {
                    if (!visited.has(reqId)) {
                        queue.push(reqId);
                    }
                });
            }
        }

        return visible;
    }, [prestigeUpgrades, upgradesMap]);

    const upgradesToRender = useMemo(() => {
        return prestigeUpgrades.filter(u => visibleUpgradesSet.has(u.id));
    }, [prestigeUpgrades, visibleUpgradesSet]);

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

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        if (e.touches.length === 2) {
            pinchState.current.isPinching = true;
            isDragging.current = false;
            pinchState.current.initialDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        } else if (e.touches.length === 1) {
            isDragging.current = true;
            lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        if (pinchState.current.isPinching && e.touches.length === 2) {
            const newDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const newZoom = view.zoom * (newDist / pinchState.current.initialDist);
            const clampedZoom = Math.max(0.5, Math.min(2, newZoom));
            
            const rect = containerRef.current!.getBoundingClientRect();
            const midpointX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
            const midpointY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;

            const newX = midpointX - (midpointX - view.x) * (clampedZoom / view.zoom);
            const newY = midpointY - (midpointY - view.y) * (clampedZoom / view.zoom);
            
            setView({ x: newX, y: newY, zoom: clampedZoom });
            pinchState.current.initialDist = newDist;

        } else if (isDragging.current && e.touches.length === 1) {
            const dx = e.touches[0].clientX - lastPos.current.x;
            const dy = e.touches[0].clientY - lastPos.current.y;
            setView(v => ({ ...v, x: v.x + dx, y: v.y + dy }));
            lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    }, [view]);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (e.touches.length < 2) {
            pinchState.current.isPinching = false;
        }
        if (e.touches.length < 1) {
            isDragging.current = false;
        }
    }, []);

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
            className="w-full h-full bg-slate-900 overflow-hidden relative cursor-grab touch-none"
            style={{
                background: `radial-gradient(ellipse at center, #1e293b 0%, #0f172a 100%)`,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
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
                    {upgradesToRender.map(upgrade => {
                        const requirements = Array.isArray(upgrade.requires) ? upgrade.requires : (upgrade.requires ? [upgrade.requires] : []);
                        
                        return requirements.map(reqId => {
                            const parent = upgradesMap.get(reqId);
                             // Draw line only if BOTH parent and child are visible.
                            if (!parent || !visibleUpgradesSet.has(parent.id)) {
                                return null;
                            }
                            
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
                        });
                    })}
                </svg>
                {upgradesToRender.map(upgrade => (
                    <PrestigeNode
                        key={upgrade.id}
                        upgrade={upgrade}
                        prestigePoints={prestigePoints}
                        onRequestPurchase={onRequestPurchase}
                        upgradesMap={upgradesMap}
                    />
                ))}
            </div>
        </div>
    );
};

export default PrestigeTreeView;