import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import GameArea from './components/GameArea';
import UpgradeStore from './components/UpgradeStore';
import ParticleCanvas, { ParticleCanvasHandle } from './components/ParticleCanvas';
import SettingsModal from './components/SettingsModal';
import AchievementsModal from './components/AchievementsModal';
import BackgroundEffects from './components/BackgroundEffects';
import MilestoneTracker from './components/MilestoneTracker';
import MilestoneToast from './components/MilestoneToast';
import AchievementToast from './components/AchievementToast';
import BuildingDisplay from './components/BuildingDisplay';
import GoldenChip from './components/GoldenBanana';
import MobileNav from './components/MobileNav'; // Import the new component
import type { Upgrade, FloatingNumberType, GameSettings, PlayerStats, Achievement, ActiveBoost, MilestoneToastInfo, AchievementToastInfo, GoldenChipType, SaveState, MobileView } from './types';
import { INITIAL_UPGRADES, SettingsIcon, MILESTONES, ACHIEVEMENTS, AchievementIcon, GOLDEN_CHIP_LIFESPAN, GOLDEN_CHIP_SPAWN_INTERVAL_MIN, GOLDEN_CHIP_SPAWN_INTERVAL_MAX, GOLDEN_CHIP_BOOST_MULTIPLIER, GOLDEN_CHIP_BOOST_DURATION } from './constants';
import { backgroundMusic, clickSound, milestoneSound, purchaseSound, achievementSound, goldenChipSpawnSound, goldenChipClickSound } from './sounds';

const SAVE_KEY = 'chipClickerSave';
const SETTINGS_KEY = 'chipClickerSettings';

// Load game state from localStorage
const loadGame = (): { 
    initialCycles: number; 
    initialUpgrades: Upgrade[]; 
    initialMilestoneIndex: number;
    initialStats: PlayerStats;
    initialUnlockedAchievements: Set<string>;
} => {
  try {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      const { cycles, upgrades: savedUpgrades, milestoneIndex, stats, unlockedAchievements } = JSON.parse(savedData);
      
      const mergedUpgrades = INITIAL_UPGRADES.map(initialUpgrade => {
        const savedUpgrade = savedUpgrades.find((u: { id: string, level: number }) => u.id === initialUpgrade.id);
        return savedUpgrade ? { ...initialUpgrade, level: savedUpgrade.level } : initialUpgrade;
      });

      const defaultStats = { totalClicks: 0, totalCyclesEarned: 0, xp: 0 };
      const loadedStats = {
          totalClicks: stats?.totalClicks || 0,
          totalCyclesEarned: stats?.totalCyclesEarned || 0,
          xp: stats?.xp || 0,
      };

      return { 
        initialCycles: cycles || 0, 
        initialUpgrades: mergedUpgrades, 
        initialMilestoneIndex: milestoneIndex || 0,
        initialStats: { ...defaultStats, ...loadedStats },
        initialUnlockedAchievements: new Set(unlockedAchievements || []),
      };
    }
  } catch (error) {
    console.error("Failed to load saved game:", error);
  }
  return { 
      initialCycles: 0, 
      initialUpgrades: INITIAL_UPGRADES, 
      initialMilestoneIndex: 0,
      initialStats: { totalClicks: 0, totalCyclesEarned: 0, xp: 0 },
      initialUnlockedAchievements: new Set(),
  };
};

// Load settings from localStorage
const loadSettings = (): GameSettings => {
    try {
        const savedData = localStorage.getItem(SETTINGS_KEY);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            return {
                sfxEnabled: typeof parsed.sfxEnabled === 'boolean' ? parsed.sfxEnabled : true,
                sfxVolume: typeof parsed.sfxVolume === 'number' ? parsed.sfxVolume : 0.5,
                musicEnabled: typeof parsed.musicEnabled === 'boolean' ? parsed.musicEnabled : true,
                musicVolume: typeof parsed.musicVolume === 'number' ? parsed.musicVolume : 0.3,
                showFloatingNumbers: typeof parsed.showFloatingNumbers === 'boolean' ? parsed.showFloatingNumbers : true,
                showParticles: typeof parsed.showParticles === 'boolean' ? parsed.showParticles : true,
                showBackgroundEffects: typeof parsed.showBackgroundEffects === 'boolean' ? parsed.showBackgroundEffects : true,
            };
        }
    } catch (error) {
        console.error("Failed to load settings:", error);
    }
    return { 
        sfxEnabled: true, 
        sfxVolume: 0.5,
        musicEnabled: true,
        musicVolume: 0.3,
        showFloatingNumbers: true,
        showParticles: true,
        showBackgroundEffects: true,
    };
};


const App: React.FC = () => {
  const { initialCycles, initialUpgrades, initialMilestoneIndex, initialStats, initialUnlockedAchievements } = useMemo(() => loadGame(), []);
  
  const [cycles, setCycles] = useState<number>(initialCycles);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(initialUpgrades);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumberType[]>([]);
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState<number>(initialMilestoneIndex);
  const [activeBoosts, setActiveBoosts] = useState<ActiveBoost[]>([]);
  const [milestoneToast, setMilestoneToast] = useState<MilestoneToastInfo | null>(null);
  const [achievementToast, setAchievementToast] = useState<AchievementToastInfo | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats>(initialStats);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(initialUnlockedAchievements);
  const [goldenChips, setGoldenChips] = useState<GoldenChipType[]>([]);
  const [activeMobileView, setActiveMobileView] = useState<MobileView>('main');
  const [hasInteracted, setHasInteracted] = useState(false);

  const particleCanvasRef = useRef<ParticleCanvasHandle>(null);
  const goldenChipTimerRef = useRef<number | null>(null);
  const cyclesRef = useRef(cycles);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  cyclesRef.current = cycles;
  
  const gameState = useMemo((): SaveState => ({
    cycles,
    upgrades: upgrades.map(({ id, level }) => ({ id, level })),
    milestoneIndex: currentMilestoneIndex,
    stats: playerStats,
    unlockedAchievements: Array.from(unlockedAchievements),
  }), [cycles, upgrades, currentMilestoneIndex, playerStats, unlockedAchievements]);
  
  useEffect(() => {
    if (!musicRef.current) {
        musicRef.current = new Audio(backgroundMusic);
        musicRef.current.loop = true;
    }
  }, []);

  useEffect(() => {
    const music = musicRef.current;
    if (music) {
        music.volume = settings.musicVolume;
        if (settings.musicEnabled && hasInteracted) {
            music.play().catch(e => console.warn("Music playback failed, likely due to autoplay policy. Will retry on next interaction.", e));
        } else {
            music.pause();
        }
    }
  }, [settings.musicEnabled, settings.musicVolume, hasInteracted]);


  const playSound = useCallback((src: string) => {
    if (!settings.sfxEnabled) return;
    
    const sound = new Audio(src);
    sound.volume = settings.sfxVolume;
    sound.play().catch(error => {
        console.warn("Sound playback failed:", error);
    });
  }, [settings.sfxEnabled, settings.sfxVolume]);
  
  const totalBoostMultiplier = useCallback((type: 'click_multiplier' | 'bps_multiplier') => {
      const now = Date.now();
      return activeBoosts
          .filter(b => b.type === type && now < b.endTime)
          .reduce((acc, b) => acc * b.multiplier, 1);
  }, [activeBoosts]);

  const cyclesPerClick = useMemo(() => {
    const baseCPC = upgrades
      .filter(u => u.type === 'click' && u.level > 0)
      .reduce((total, u) => total + u.power * u.level, 1);
      
    return baseCPC * totalBoostMultiplier('click_multiplier');
  }, [upgrades, totalBoostMultiplier]);

  const cyclesPerSecond = useMemo(() => {
    const baseCPS = upgrades
      .filter(u => u.type === 'auto')
      .reduce((total, u) => total + u.power * u.level, 0);

    return baseCPS * totalBoostMultiplier('bps_multiplier');
  }, [upgrades, totalBoostMultiplier]);

  useEffect(() => {
    const previousCycles = cyclesRef.current;
    if (cycles > previousCycles) {
      const earned = cycles - previousCycles;
      setPlayerStats(prev => ({
        ...prev,
        totalCyclesEarned: prev.totalCyclesEarned + earned
      }));
    }
  }, [cycles]);

  useEffect(() => {
    if (cyclesPerSecond === 0) return;
    const ticksPerSecond = 20;
    const interval = setInterval(() => {
      setCycles(prev => prev + cyclesPerSecond / ticksPerSecond);
    }, 1000 / ticksPerSecond);
    return () => clearInterval(interval);
  }, [cyclesPerSecond]);

  useEffect(() => {
    document.title = `${Math.floor(cycles).toLocaleString()} Cycles | Chip Clicker`;
  }, [cycles]);
  
  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    } catch (error) {
      console.error("Failed to save game:", error);
    }
  }, [gameState]);

  useEffect(() => {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error("Failed to save settings:", error);
    }
  }, [settings]);

  const currentMilestone = useMemo(() => {
    return MILESTONES[currentMilestoneIndex] || null;
  }, [currentMilestoneIndex]);

  useEffect(() => {
    if (!currentMilestone) return; 

    if (playerStats.xp >= currentMilestone.xpRequired) {
      playSound(milestoneSound);
      
      const reward = currentMilestone.reward;
      const newBoost: ActiveBoost = {
        id: Date.now(),
        type: reward.type,
        multiplier: reward.multiplier,
        endTime: Date.now() + reward.duration * 1000,
        source: `Milestone: ${currentMilestone.name}`
      };
      setActiveBoosts(prev => [...prev, newBoost]);

      const rewardDescription = reward.type === 'click_multiplier' 
        ? `${reward.multiplier}x click power for ${reward.duration} seconds!`
        : `${reward.multiplier}x cycles per second for ${reward.duration} seconds!`;

      setMilestoneToast({
          id: Date.now(),
          name: currentMilestone.name,
          rewardDescription: rewardDescription
      });
      setCurrentMilestoneIndex(prev => prev + 1);
    }
  }, [playerStats.xp, currentMilestone, playSound]);
  
  useEffect(() => {
    const interval = setInterval(() => {
        const now = Date.now();
        setActiveBoosts(prev => prev.filter(b => now < b.endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Achievement Checking Logic
  useEffect(() => {
    const newlyUnlocked: Achievement[] = [];
    ACHIEVEMENTS.forEach(ach => {
        if (unlockedAchievements.has(ach.id)) return;

        let isUnlocked = false;
        const { condition } = ach;
        switch (condition.type) {
            case 'totalClicks':
                if (playerStats.totalClicks >= condition.value) isUnlocked = true;
                break;
            case 'totalCycles':
                if (playerStats.totalCyclesEarned >= condition.value) isUnlocked = true;
                break;
            case 'specificUpgradeLevel':
                const upgrade = upgrades.find(u => u.id === condition.upgradeId);
                if (upgrade && upgrade.level >= condition.value) isUnlocked = true;
                break;
            case 'anyUpgradeLevel':
                const allUpgradesOwned = INITIAL_UPGRADES.every(initialUpgrade => {
                    const currentUpgrade = upgrades.find(u => u.id === initialUpgrade.id);
                    return currentUpgrade && currentUpgrade.level >= condition.value;
                });
                if (allUpgradesOwned) isUnlocked = true;
                break;
        }

        if (isUnlocked) {
            newlyUnlocked.push(ach);
        }
    });

    if (newlyUnlocked.length > 0) {
        setUnlockedAchievements(prev => new Set([...prev, ...newlyUnlocked.map(a => a.id)]));
        const firstNew = newlyUnlocked[0];
        setAchievementToast({ id: Date.now(), name: firstNew.name, icon: firstNew.icon });
        playSound(achievementSound);
    }
  }, [playerStats, upgrades, unlockedAchievements, playSound]);

  // Golden Chip Spawner
    useEffect(() => {
        const scheduleNextSpawn = () => {
            if (goldenChipTimerRef.current) {
                clearTimeout(goldenChipTimerRef.current);
            }
            const delay = Math.random() * (GOLDEN_CHIP_SPAWN_INTERVAL_MAX - GOLDEN_CHIP_SPAWN_INTERVAL_MIN) + GOLDEN_CHIP_SPAWN_INTERVAL_MIN;
            
            goldenChipTimerRef.current = setTimeout(() => {
                setGoldenChips(prev => {
                    if (prev.length === 0) {
                        playSound(goldenChipSpawnSound);
                        return [{
                            id: Date.now(),
                            x: 10 + Math.random() * 80,
                            y: 15 + Math.random() * 70,
                            status: 'visible',
                        }];
                    }
                    return prev;
                });
                scheduleNextSpawn();
            }, delay);
        };
        
        scheduleNextSpawn();

        return () => {
            if (goldenChipTimerRef.current) {
                clearTimeout(goldenChipTimerRef.current);
            }
        };
    }, [playSound]);

    // Golden Chip Timeout
    useEffect(() => {
        const visibleChip = goldenChips.find(gc => gc.status === 'visible');
        if (visibleChip) {
            const timeoutId = setTimeout(() => {
                setGoldenChips(prev => prev.map(gc => 
                    gc.id === visibleChip.id ? { ...gc, status: 'missed' } : gc
                ));
            }, GOLDEN_CHIP_LIFESPAN);

            return () => clearTimeout(timeoutId);
        }
    }, [goldenChips]);


  const handleChipClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if(!hasInteracted) setHasInteracted(true);
    playSound(clickSound);
    
    const isBoosted = totalBoostMultiplier('click_multiplier') > 1;
    const amount = cyclesPerClick;

    setCycles(prev => prev + amount);
    setPlayerStats(prev => ({...prev, totalClicks: prev.totalClicks + 1, xp: prev.xp + 1 }));

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (settings.showFloatingNumbers) {
      const newFloatingNumber: FloatingNumberType = {
        id: Date.now() + Math.random(),
        value: amount,
        x: x,
        y: y,
        isBoosted: isBoosted,
      };
      setFloatingNumbers(current => [...current, newFloatingNumber]);
    }
    
    if (settings.showParticles) {
      particleCanvasRef.current?.createBurst(e.clientX, e.clientY, !!isBoosted, amount);
    }

  }, [cyclesPerClick, playSound, totalBoostMultiplier, settings.showFloatingNumbers, settings.showParticles, hasInteracted]);

  const handlePurchaseUpgrade = useCallback((upgradeId: string, levelsToBuy: number) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade || levelsToBuy <= 0) return;

    let totalCost = 0;
    const { baseCost, costGrowth, level: currentLevel } = upgrade;

    // Calculate the total cost by summing the cost of each individual level
    for (let i = 0; i < levelsToBuy; i++) {
        totalCost += Math.floor(baseCost * Math.pow(costGrowth, currentLevel + i));
    }

    if (cycles >= totalCost) {
      playSound(purchaseSound);
      setCycles(prev => prev - totalCost);
      setUpgrades(prevUpgrades =>
        prevUpgrades.map(u =>
          u.id === upgradeId ? { ...u, level: u.level + levelsToBuy } : u
        )
      );
      setPlayerStats(prev => ({...prev, xp: prev.xp + levelsToBuy * 5 }));
    }
  }, [cycles, upgrades, playSound]);

  const handleAnimationEnd = useCallback((id: number) => {
    setFloatingNumbers(current => current.filter(n => n.id !== id));
  }, []);

  const handleSettingsChange = (newSettings: Partial<GameSettings>) => {
    setSettings(current => ({ ...current, ...newSettings }));
  };

  const handleResetGame = () => {
    if (window.confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
        try {
            localStorage.removeItem(SAVE_KEY);
            // We don't remove settings, just game progress.
            window.location.reload();
        } catch (error) {
            console.error("Failed to clear saved data:", error);
            alert("There was an error trying to reset your progress.");
        }
    }
  };

  const handleGoldenChipClick = useCallback((id: number) => {
      playSound(goldenChipClickSound);
      
      setGoldenChips(prev => prev.map(gc => 
          gc.id === id ? { ...gc, status: 'clicked' } : gc
      ));

      const newBoost: ActiveBoost = {
          id: Date.now(),
          type: 'click_multiplier',
          multiplier: GOLDEN_CHIP_BOOST_MULTIPLIER,
          endTime: Date.now() + GOLDEN_CHIP_BOOST_DURATION * 1000,
          source: 'Golden Chip!'
      };
      setActiveBoosts(prev => [...prev, newBoost]);
  }, [playSound]);

  const handleGoldenChipDisappeared = useCallback((id: number) => {
      setGoldenChips(prev => prev.filter(gc => gc.id !== id));
  }, []);

  const handleLoadState = useCallback((loadedState: SaveState) => {
      if (!loadedState) return;
      try {
        setCycles(loadedState.cycles);
        const mergedUpgrades = INITIAL_UPGRADES.map(initialUpgrade => {
            const savedUpgrade = loadedState.upgrades.find(u => u.id === initialUpgrade.id);
            return savedUpgrade ? { ...initialUpgrade, level: savedUpgrade.level } : initialUpgrade;
        });
        setUpgrades(mergedUpgrades);
        setCurrentMilestoneIndex(loadedState.milestoneIndex);
        setPlayerStats(loadedState.stats);
        setUnlockedAchievements(new Set(loadedState.unlockedAchievements));
        console.log("Game state loaded.");
      } catch (e) {
          console.error("Failed to parse or apply save data:", e);
      }
  }, []);

  const handleManualSave = useCallback(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    } catch (error) {
      console.error("Failed to save game manually:", error);
      alert("There was an error trying to save your progress.");
    }
  }, [gameState]);

  const handleManualLoad = useCallback(() => {
    if (window.confirm("Loading from this device will overwrite your current unsaved progress. Are you sure?")) {
        try {
            const savedData = localStorage.getItem(SAVE_KEY);
            if (savedData) {
                const loadedState: SaveState = JSON.parse(savedData);
                handleLoadState(loadedState);
            } else {
                alert("No saved data found on this device.");
            }
        } catch (error) {
            console.error("Failed to load game manually:", error);
            alert("There was an error trying to load your progress.");
        }
    }
  }, [handleLoadState]);


  return (
    <div className="h-screen bg-transparent text-slate-200 flex flex-col overflow-hidden relative font-sans pb-20 lg:pb-0">
      {settings.showBackgroundEffects && <BackgroundEffects />}
      {milestoneToast && (
        <MilestoneToast 
            key={milestoneToast.id}
            name={milestoneToast.name}
            rewardDescription={milestoneToast.rewardDescription}
            onClose={() => setMilestoneToast(null)}
        />
      )}
      {achievementToast && (
          <AchievementToast
              key={achievementToast.id}
              name={achievementToast.name}
              icon={achievementToast.icon}
              onClose={() => setAchievementToast(null)}
          />
      )}
      <div className="absolute top-4 right-4 z-50 flex gap-2 items-center">
        <button
          onClick={() => setIsAchievementsOpen(true)}
          className="p-3 rounded-full bg-slate-900/50 hover:bg-slate-800/80 text-slate-300 border border-slate-700 backdrop-blur-sm transition-all shadow-lg hover:shadow-pink-500/10 active:scale-95 hover:text-pink-300"
          aria-label="Open achievements"
        >
          <AchievementIcon />
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 rounded-full bg-slate-900/50 hover:bg-slate-800/80 text-slate-300 border border-slate-700 backdrop-blur-sm transition-all shadow-lg hover:shadow-pink-500/10 active:scale-95 hover:text-pink-300"
          aria-label="Open settings"
        >
          <SettingsIcon />
        </button>
      </div>

      {/* Desktop Layout */}
      <main className="hidden lg:grid w-full flex-grow p-4 grid-cols-1 lg:grid-cols-7 gap-4 min-h-0">
        <div className="lg:col-span-2 min-h-0">
            <GameArea
              cycles={cycles}
              cyclesPerClick={cyclesPerClick}
              cyclesPerSecond={cyclesPerSecond}
              onChipClick={handleChipClick}
              floatingNumbers={floatingNumbers}
              onAnimationEnd={handleAnimationEnd}
              activeBoosts={activeBoosts}
            />
        </div>
        <div className="lg:col-span-3 h-full flex flex-col gap-4 min-h-0">
             <MilestoneTracker 
                currentMilestone={currentMilestone}
                playerStats={playerStats}
            />
            <div className="flex-grow min-h-0">
                <BuildingDisplay upgrades={upgrades} />
            </div>
        </div>
        <div className="lg:col-span-2 min-h-0">
             <UpgradeStore
              upgrades={upgrades}
              onPurchase={handlePurchaseUpgrade}
              cycles={cycles}
            />
        </div>
      </main>

      {/* Mobile Layout */}
      <main className="lg:hidden w-full flex-grow p-4 flex flex-col min-h-0">
        <div className="flex-shrink-0 mb-4">
            <MilestoneTracker 
                currentMilestone={currentMilestone}
                playerStats={playerStats}
            />
        </div>
        <div className="flex-grow min-h-0">
            {activeMobileView === 'main' && (
                <GameArea
                    cycles={cycles}
                    cyclesPerClick={cyclesPerClick}
                    cyclesPerSecond={cyclesPerSecond}
                    onChipClick={handleChipClick}
                    floatingNumbers={floatingNumbers}
                    onAnimationEnd={handleAnimationEnd}
                    activeBoosts={activeBoosts}
                />
            )}
            {activeMobileView === 'buildings' && (
                 <BuildingDisplay upgrades={upgrades} />
            )}
            {activeMobileView === 'upgrades' && (
                 <UpgradeStore
                    upgrades={upgrades}
                    onPurchase={handlePurchaseUpgrade}
                    cycles={cycles}
                 />
            )}
        </div>
      </main>
      
      <MobileNav activeView={activeMobileView} setView={setActiveMobileView} />

      <ParticleCanvas ref={particleCanvasRef} />
      
      {goldenChips.map((gc) => (
        <GoldenChip
            key={gc.id}
            goldenChip={gc}
            onClick={handleGoldenChipClick}
            onDisappeared={handleGoldenChipDisappeared}
        />
      ))}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        onReset={handleResetGame}
        gameState={gameState}
        onLoadGame={handleLoadState}
        onManualSave={handleManualSave}
        onManualLoad={handleManualLoad}
      />
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={ACHIEVEMENTS}
        unlockedAchievements={unlockedAchievements}
        playerStats={playerStats}
        upgrades={upgrades}
      />
    </div>
  );
};

export default App;