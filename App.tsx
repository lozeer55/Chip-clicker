import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import GameArea from './components/GameArea';
import UpgradeStore from './components/UpgradeStore';
import ParticleCanvas, { ParticleCanvasHandle } from './components/ParticleCanvas';
import SettingsModal from './components/SettingsModal';
import AchievementsModal from './components/AchievementsModal';
import StatsModal from './components/StatsModal';
import BackgroundEffects from './components/BackgroundEffects';
import MilestoneTracker from './components/MilestoneTracker';
import MilestoneToast from './components/MilestoneToast';
import AchievementToast from './components/AchievementToast';
import BuildingDisplay from './components/BuildingDisplay';
import GoldenDroplet from './components/GoldenBanana';
import MobileNav from './components/MobileNav';
import DailyRewardModal from './components/DailyRewardModal';
import ChallengesModal from './components/ChallengesModal';
import ChallengeTracker from './components/ChallengeTracker';
import ChallengeToast from './components/ChallengeToast';
import EventToast from './components/EventToast';
import ShootingStar from './components/ShootingStar';
import AdminModal from './components/AdminModal';
import PrestigeTracker from './components/PrestigeTracker';
import type { Upgrade, FloatingNumberType, GameSettings, PlayerStats, Achievement, ActiveBoost, MilestoneToastInfo, AchievementToastInfo, GoldenDropletType, SaveState, MobileView, PrestigeUpgrade, Challenge, ActiveChallengeState, ChallengeToastInfo, EventToastInfo, ShootingStarType } from './types';
// FIX: Imported `LightningIcon` to resolve "Cannot find name 'LightningIcon'" error.
import { INITIAL_UPGRADES, SettingsIcon, MILESTONES, ACHIEVEMENTS, AchievementIcon, ChartBarIcon, GOLDEN_DROPLET_LIFESPAN, GOLDEN_DROPLET_SPAWN_INTERVAL_MIN, GOLDEN_DROPLET_SPAWN_INTERVAL_MAX, GOLDEN_DROPLET_BOOST_MULTIPLIER, GOLDEN_DROPLET_BOOST_DURATION, PRESTIGE_UPGRADES, calculatePrestigePoints, DAILY_REWARDS, CHALLENGES, StopwatchIcon, RANDOM_EVENT_CONFIG, MagicIcon, LightningIcon, AdminIcon, PRESTIGE_REQUIREMENT } from './constants';
import { backgroundMusic, clickSound, milestoneSound, purchaseSound, achievementSound, goldenChipSpawnSound, goldenChipClickSound, prestigeSound } from './sounds';

const SAVE_KEY = 'elixirClickerSave';
const SETTINGS_KEY = 'elixirClickerSettings';

type Notification = 
  | ({ type: 'milestone' } & MilestoneToastInfo)
  | ({ type: 'achievement' } & AchievementToastInfo)
  | ({ type: 'challenge' } & ChallengeToastInfo)
  | ({ type: 'event' } & EventToastInfo);

// Load game state from localStorage
const loadGame = (): { 
    initialCycles: number; 
    initialUpgrades: Upgrade[]; 
    initialMilestoneIndex: number;
    initialStats: PlayerStats;
    initialUnlockedAchievements: Set<string>;
    initialCompletedChallenges: Set<string>;
    initialPrestigePoints: number;
    initialPrestigeUpgrades: PrestigeUpgrade[];
    initialLoginStreak: number;
    initialLastLoginDate: string | null;
} => {
  try {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      // FIX: Type the parsed save data to avoid properties being inferred as `any` or `unknown`.
      const { cycles, upgrades: savedUpgrades, milestoneIndex, stats, unlockedAchievements, completedChallenges, prestigePoints, prestigeUpgrades: savedPrestigeUpgrades, loginStreak, lastLoginDate }: Partial<SaveState> = JSON.parse(savedData);
      
      let upgradesWithLevels = INITIAL_UPGRADES.map(initialUpgrade => {
        // FIX: Added optional chaining as savedUpgrades can be undefined with a partial save state.
        const savedUpgrade = savedUpgrades?.find((u) => u.id === initialUpgrade.id);
        return savedUpgrade ? { ...initialUpgrade, level: savedUpgrade.level } : { ...initialUpgrade, level: 0 };
      });
      
      const savedPrestigeUpgradesMap = new Map(
        (savedPrestigeUpgrades || []).map((u) => [u.id, u.level])
      );
      const prestigeUpgradesWithLevels = PRESTIGE_UPGRADES.map(initialUpgrade => ({
        ...initialUpgrade,
        level: savedPrestigeUpgradesMap.get(initialUpgrade.id) || 0,
      }));
      
      // Apply prestige bonuses to the initial upgrades
      for (const pUpgrade of prestigeUpgradesWithLevels) {
          // FIX: `pUpgrade.level` is now correctly inferred as a number, allowing this comparison.
          if (pUpgrade.level > 0) {
              const { bonus } = pUpgrade;
              // FIX: `pUpgrade.level` is now correctly inferred as a number, allowing this comparison.
              for (let i = 0; i < pUpgrade.level; i++) {
                  if (bonus.type === 'increase_max_level') {
                      upgradesWithLevels = upgradesWithLevels.map(u => 
                          bonus.upgradeIds.includes(u.id)
                              ? { ...u, maxLevel: u.maxLevel + bonus.amount }
                              : u
                      );
                  } else if (bonus.type === 'increase_power_multiplier') {
                       upgradesWithLevels = upgradesWithLevels.map(u => 
                          bonus.upgradeIds.includes(u.id)
                              ? { ...u, power: u.power * bonus.multiplier }
                              : u
                      );
                  }
              }
          }
      }


      const defaultStats: PlayerStats = { totalClicks: 0, totalCyclesEarned: 0, xp: 0, totalPrestigePointsEver: 0, totalPrestiges: 0, goldenDropletsClicked: 0 };
      const loadedStats = {
          totalClicks: stats?.totalClicks || 0,
          totalCyclesEarned: stats?.totalCyclesEarned || 0,
          xp: stats?.xp || 0,
          totalPrestigePointsEver: stats?.totalPrestigePointsEver || 0,
          totalPrestiges: stats?.totalPrestiges || 0,
          goldenDropletsClicked: stats?.goldenDropletsClicked || 0,
      };

      return { 
        initialCycles: cycles || 0, 
        initialUpgrades: upgradesWithLevels, 
        initialMilestoneIndex: milestoneIndex || 0,
        initialStats: { ...defaultStats, ...loadedStats },
        initialUnlockedAchievements: new Set(unlockedAchievements || []),
        initialCompletedChallenges: new Set(completedChallenges || []),
        initialPrestigePoints: prestigePoints || 0,
        // FIX: `prestigeUpgradesWithLevels` is now correctly typed as PrestigeUpgrade[], satisfying the return type.
        initialPrestigeUpgrades: prestigeUpgradesWithLevels,
        initialLoginStreak: loginStreak || 0,
        initialLastLoginDate: lastLoginDate || null,
      };
    }
  } catch (error) {
    console.error("Failed to load saved game:", error);
  }
  return { 
      initialCycles: 0, 
      initialUpgrades: INITIAL_UPGRADES.map(u => ({...u, level: 0})), 
      initialMilestoneIndex: 0,
      initialStats: { totalClicks: 0, totalCyclesEarned: 0, xp: 0, totalPrestigePointsEver: 0, totalPrestiges: 0, goldenDropletsClicked: 0 },
      initialUnlockedAchievements: new Set(),
      initialCompletedChallenges: new Set(),
      initialPrestigePoints: 0,
      initialPrestigeUpgrades: PRESTIGE_UPGRADES.map(u => ({...u, level: 0})),
      initialLoginStreak: 0,
      initialLastLoginDate: null,
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
  const { initialCycles, initialUpgrades, initialMilestoneIndex, initialStats, initialUnlockedAchievements, initialCompletedChallenges, initialPrestigePoints, initialPrestigeUpgrades, initialLoginStreak, initialLastLoginDate } = useMemo(() => loadGame(), []);
  
  const [cycles, setCycles] = useState<number>(initialCycles);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(initialUpgrades);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumberType[]>([]);
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isChallengesOpen, setIsChallengesOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState<number>(initialMilestoneIndex);
  const [activeBoosts, setActiveBoosts] = useState<ActiveBoost[]>([]);
  const [notificationQueue, setNotificationQueue] = useState<Notification[]>([]);
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats>(initialStats);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(initialUnlockedAchievements);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(initialCompletedChallenges);
  const [goldenDroplets, setGoldenDroplets] = useState<GoldenDropletType[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStarType[]>([]);
  const [activeMobileView, setActiveMobileView] = useState<MobileView>('main');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [prestigePoints, setPrestigePoints] = useState<number>(initialPrestigePoints);
  const [prestigeUpgrades, setPrestigeUpgrades] = useState<PrestigeUpgrade[]>(initialPrestigeUpgrades);
  const [loginStreak, setLoginStreak] = useState<number>(initialLoginStreak);
  const [lastLoginDate, setLastLoginDate] = useState<string | null>(initialLastLoginDate);
  const [isDailyRewardModalOpen, setIsDailyRewardModalOpen] = useState(false);
  const [effectiveStreak, setEffectiveStreak] = useState(1);
  const [activeChallenge, setActiveChallenge] = useState<ActiveChallengeState | null>(null);

  const particleCanvasRef = useRef<ParticleCanvasHandle>(null);
  const goldenDropletTimerRef = useRef<number | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  
  const gameState = useMemo((): SaveState => ({
    cycles,
    upgrades: upgrades.map(({ id, level }) => ({ id, level })),
    milestoneIndex: currentMilestoneIndex,
    stats: playerStats,
    unlockedAchievements: Array.from(unlockedAchievements),
    completedChallenges: Array.from(completedChallenges),
    prestigePoints,
    prestigeUpgrades: prestigeUpgrades.map(({ id, level }) => ({ id, level })),
    lastLoginDate,
    loginStreak,
  }), [cycles, upgrades, currentMilestoneIndex, playerStats, unlockedAchievements, completedChallenges, prestigePoints, prestigeUpgrades, lastLoginDate, loginStreak]);
  
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

  // Daily Reward Check Logic - runs once on startup
  useEffect(() => {
    const today = new Date();
    const todayString = today.toDateString();
    
    // If the player has already claimed today's reward, do nothing.
    if (lastLoginDate === todayString) {
        return; 
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    let currentStreak = 1;
    // Check if the last login was yesterday to continue the streak
    if (lastLoginDate === yesterdayString) {
        currentStreak = loginStreak + 1;
    } // Otherwise, it's a new streak, which defaults to 1.

    setEffectiveStreak(currentStreak);
    // Use a small timeout to let the rest of the app load before showing the modal
    setTimeout(() => {
        setIsDailyRewardModalOpen(true);
    }, 500);
  }, []); // Intentionally empty dependency array to run only on initial mount.
  
  const totalBoostMultiplier = useCallback((type: 'click_multiplier' | 'bps_multiplier') => {
      const now = Date.now();
      return activeBoosts
          .filter(b => b.type === type && now < b.endTime)
          .reduce((acc, b) => acc * b.multiplier, 1);
  }, [activeBoosts]);

  const prestigeMultiplier = useMemo(() => {
    return 1 + prestigeUpgrades.reduce((total, u) => {
        if (u.bonus.type === 'all_cycles_multiplier') {
            return total + u.bonus.value * u.level;
        }
        return total;
    }, 0);
  }, [prestigeUpgrades]);

  const baseCyclesPerSecond = useMemo(() => {
    return upgrades
      .filter(u => u.type === 'auto')
      .reduce((total, u) => total + u.power * u.level, 0);
  }, [upgrades]);

  const cyclesPerSecond = useMemo(() => {
    return baseCyclesPerSecond * totalBoostMultiplier('bps_multiplier') * prestigeMultiplier;
  }, [baseCyclesPerSecond, totalBoostMultiplier, prestigeMultiplier]);

  const cyclesPerClick = useMemo(() => {
    const baseCPC = upgrades
      .filter(u => u.type === 'click' && u.level > 0)
      .reduce((total, u) => total + u.power * u.level, 1);
      
    const synergyBonus = prestigeUpgrades.reduce((total, u) => {
        if (u.bonus.type === 'cps_to_click_synergy') {
            return total + (u.bonus.value * u.level * baseCyclesPerSecond);
        }
        return total;
    }, 0);

    return (baseCPC + synergyBonus) * totalBoostMultiplier('click_multiplier') * prestigeMultiplier;
  }, [upgrades, totalBoostMultiplier, prestigeMultiplier, prestigeUpgrades, baseCyclesPerSecond]);

  useEffect(() => {
    if (cyclesPerSecond === 0) return;
    const ticksPerSecond = 20;
    const interval = setInterval(() => {
      const earned = cyclesPerSecond / ticksPerSecond;
      setCycles(prev => prev + earned);
      setPlayerStats(prev => ({
        ...prev,
        totalCyclesEarned: prev.totalCyclesEarned + earned
      }));
    }, 1000 / ticksPerSecond);
    return () => clearInterval(interval);
  }, [cyclesPerSecond]);

  useEffect(() => {
    document.title = `${Math.floor(cycles).toLocaleString()} Essence | Elixir Clicker`;
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

  // Notification Queue Manager
  useEffect(() => {
    if (!activeNotification && notificationQueue.length > 0) {
      const [nextNotification, ...rest] = notificationQueue;
      setActiveNotification(nextNotification);
      setNotificationQueue(rest);
    }
  }, [activeNotification, notificationQueue]);

  const currentMilestone = useMemo(() => {
    return MILESTONES[currentMilestoneIndex] || null;
  }, [currentMilestoneIndex]);

  useEffect(() => {
    if (!currentMilestone || activeChallenge) return; 

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
        : `${reward.multiplier}x essence per second for ${reward.duration} seconds!`;

      setNotificationQueue(prev => [...prev, {
          type: 'milestone',
          id: Date.now(),
          name: currentMilestone.name,
          rewardDescription: rewardDescription
      }]);
      setCurrentMilestoneIndex(prev => prev + 1);
    }
  }, [playerStats.xp, currentMilestone, playSound, activeChallenge]);
  
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
        newlyUnlocked.forEach((ach, index) => {
            // Stagger toast creation slightly to ensure unique IDs if they unlock in the same tick
            setTimeout(() => {
                setNotificationQueue(prev => [...prev, { 
                    type: 'achievement', 
                    id: Date.now() + index, 
                    name: ach.name, 
                    icon: ach.icon 
                }]);
            }, index * 50);
        });
        playSound(achievementSound);
    }
  }, [playerStats, upgrades, unlockedAchievements, playSound]);

  // Golden Droplet Spawner
    useEffect(() => {
        const scheduleNextSpawn = () => {
            if (goldenDropletTimerRef.current) {
                clearTimeout(goldenDropletTimerRef.current);
            }
            const delay = Math.random() * (GOLDEN_DROPLET_SPAWN_INTERVAL_MAX - GOLDEN_DROPLET_SPAWN_INTERVAL_MIN) + GOLDEN_DROPLET_SPAWN_INTERVAL_MIN;
            
            goldenDropletTimerRef.current = setTimeout(() => {
                setGoldenDroplets(prev => {
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
            if (goldenDropletTimerRef.current) {
                clearTimeout(goldenDropletTimerRef.current);
            }
        };
    }, [playSound]);

    // Golden Droplet Timeout
    useEffect(() => {
        const visibleDroplet = goldenDroplets.find(gc => gc.status === 'visible');
        if (visibleDroplet) {
            const timeoutId = setTimeout(() => {
                setGoldenDroplets(prev => prev.map(gc => 
                    gc.id === visibleDroplet.id ? { ...gc, status: 'missed' } : gc
                ));
            }, GOLDEN_DROPLET_LIFESPAN);

            return () => clearTimeout(timeoutId);
        }
    }, [goldenDroplets]);
    
    // --- Challenge Logic ---
    
    const handleChallengeEnd = useCallback((isSuccess: boolean) => {
        if (!activeChallenge) return;
        
        const { challenge } = activeChallenge;

        if (isSuccess) {
            playSound(milestoneSound);
            if (challenge.reward.type === 'prestige_points') {
                setPrestigePoints(prev => prev + challenge.reward.value);
            }
            setCompletedChallenges(prev => new Set([...prev, challenge.id]));
            setNotificationQueue(prev => [...prev, {
                type: 'challenge',
                id: Date.now(),
                name: challenge.name,
                status: 'success',
                rewardDescription: `+${challenge.reward.value} Prestige Points`
            }]);
        } else {
            // Optional: play failure sound
            setNotificationQueue(prev => [...prev, {
                type: 'challenge',
                id: Date.now(),
                name: challenge.name,
                status: 'failure',
            }]);
        }
        
        setActiveChallenge(null);
    }, [activeChallenge, playSound]);

    // Challenge Timer
    useEffect(() => {
        if (!activeChallenge) return;

        const timer = setInterval(() => {
            const elapsed = Date.now() - activeChallenge.startTime;
            if (elapsed >= activeChallenge.challenge.duration * 1000) {
                handleChallengeEnd(false); // Time's up, not a success (unless already completed)
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [activeChallenge, handleChallengeEnd]);
    
    // Challenge Progress Checker
    useEffect(() => {
        if (!activeChallenge) return;

        const { challenge, initialValue } = activeChallenge;
        let isComplete = false;

        if (challenge.objective.type === 'earn_essence') {
            const earned = cycles - initialValue;
            if (earned >= challenge.objective.value) {
                isComplete = true;
            }
        } else if (challenge.objective.type === 'upgrade_level') {
            const upgrade = upgrades.find(u => u.id === challenge.objective.upgradeId);
            if (upgrade && upgrade.level >= challenge.objective.value) {
                isComplete = true;
            }
        }

        if (isComplete) {
            handleChallengeEnd(true); // Objective met, success!
        }
    }, [cycles, upgrades, activeChallenge, handleChallengeEnd]);


    // Random Event Spawner
    useEffect(() => {
        const eventTimer = setInterval(() => {
            if (Math.random() > RANDOM_EVENT_CONFIG.EVENT_CHANCE) return;
            
            const totalWeight = RANDOM_EVENT_CONFIG.EVENTS.reduce((sum, event) => sum + event.weight, 0);
            let random = Math.random() * totalWeight;
            
            for (const event of RANDOM_EVENT_CONFIG.EVENTS) {
                if (random < event.weight) {
                    // Trigger this event
                    switch (event.type) {
                        case 'ESSENCE_FRENZY':
                            playSound(milestoneSound);
                            const now = Date.now();
                            const endTime = now + event.duration * 1000;
                            setActiveBoosts(prev => [
                                ...prev,
                                { id: now, type: 'click_multiplier', multiplier: event.multiplier, endTime, source: 'Essence Frenzy' },
                                { id: now + 1, type: 'bps_multiplier', multiplier: event.multiplier, endTime, source: 'Essence Frenzy' }
                            ]);
                            setNotificationQueue(prev => [...prev, {
                                type: 'event',
                                id: now,
                                title: '¡Frenesí de Esencia!',
                                description: `¡Toda la ganancia de esencia x${event.multiplier} por ${event.duration} segundos!`,
                                icon: <LightningIcon />
                            }]);
                            break;
                        
                        case 'UPGRADE_SURGE':
                            const eligibleUpgrades = upgrades.filter(u => u.level > 0 && u.level < u.maxLevel && !u.surged);
                            if (eligibleUpgrades.length > 0) {
                                playSound(milestoneSound);
                                const randomUpgrade = eligibleUpgrades[Math.floor(Math.random() * eligibleUpgrades.length)];
                                setUpgrades(current => current.map(u => 
                                    u.id === randomUpgrade.id 
                                        ? { ...u, surged: { discount: event.discount, endTime: Date.now() + event.duration * 1000 } }
                                        : u
                                ));
                                setNotificationQueue(prev => [...prev, {
                                    type: 'event',
                                    id: Date.now(),
                                    title: '¡Oleada de Mejoras!',
                                    description: `${randomUpgrade.name} tiene un ${event.discount * 100}% de descuento por ${event.duration}s!`,
                                    icon: <MagicIcon className="h-6 w-6" />
                                }]);
                            }
                            break;

                        case 'SHOOTING_STAR':
                            playSound(goldenChipSpawnSound);
                            const id = Date.now();
                            const isFromLeft = Math.random() > 0.5;
                            const startX = isFromLeft ? -100 : window.innerWidth + 100;
                            const startY = -100;
                            const endX = window.innerWidth - (isFromLeft ? -100 : window.innerWidth + 100);
                            const endY = window.innerHeight + 100;
                            setShootingStars(prev => [...prev, {
                                id, startX, startY, endX, endY, duration: event.duration, status: 'visible'
                            }]);
                            break;
                    }
                    return; // Exit after triggering one event
                }
                random -= event.weight;
            }

        }, RANDOM_EVENT_CONFIG.TICK_INTERVAL);

        return () => clearInterval(eventTimer);
    }, [upgrades, playSound]);

    // Upgrade Surge cleaner
    useEffect(() => {
        const surgeCleaner = setInterval(() => {
            let needsUpdate = false;
            const now = Date.now();
            const cleanedUpgrades = upgrades.map(u => {
                if (u.surged && now > u.surged.endTime) {
                    needsUpdate = true;
                    const { surged, ...rest } = u; // remove surged property
                    return rest;
                }
                return u;
            });

            if (needsUpdate) {
                setUpgrades(cleanedUpgrades);
            }
        }, 1000); // Check every second

        return () => clearInterval(surgeCleaner);
    }, [upgrades]);


  const handleChipClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if(!hasInteracted) setHasInteracted(true);
    playSound(clickSound);
    
    const isBoosted = totalBoostMultiplier('click_multiplier') > 1;
    const amount = cyclesPerClick;

    setCycles(prev => prev + amount);
    setPlayerStats(prev => ({
        ...prev,
        totalCyclesEarned: prev.totalCyclesEarned + amount,
        totalClicks: prev.totalClicks + 1,
        xp: prev.xp + 1,
    }));

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
    if (!upgrade || levelsToBuy <= 0 || upgrade.level + levelsToBuy > upgrade.maxLevel) return;

    let totalCost = 0;
    const { baseCost, costGrowth, level: currentLevel } = upgrade;
    const discount = upgrade.surged?.discount || 0;

    // Calculate the total cost by summing the cost of each individual level
    for (let i = 0; i < levelsToBuy; i++) {
        let levelCost = Math.floor(baseCost * Math.pow(costGrowth, currentLevel + i));
        levelCost *= (1 - discount);
        totalCost += levelCost;
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
  
  const handlePurchasePrestigeUpgrade = useCallback((upgradeId: string) => {
    const upgrade = prestigeUpgrades.find(u => u.id === upgradeId);
    if (!upgrade) return;

    // Check dependency
    if (upgrade.requires) {
        const requiredUpgrade = prestigeUpgrades.find(p => p.id === upgrade.requires);
        if (!requiredUpgrade || requiredUpgrade.level === 0) {
            return; // Requirement not met
        }
    }

    const cost = upgrade.cost(upgrade.level);
    if (prestigePoints >= cost && (!upgrade.maxLevel || upgrade.level < upgrade.maxLevel)) {
        playSound(purchaseSound);
        setPrestigePoints(prev => prev - cost);
        
        const newPrestigeUpgrades = prestigeUpgrades.map(u =>
            u.id === upgradeId ? { ...u, level: u.level + 1 } : u
        );
        setPrestigeUpgrades(newPrestigeUpgrades);

        // --- Start of Bonus Recalculation ---
        // Start with base upgrades, but preserve current levels
        let recalculatedUpgrades = INITIAL_UPGRADES.map(initialUpg => {
            const currentUpg = upgrades.find(u => u.id === initialUpg.id);
            return { ...initialUpg, level: currentUpg ? currentUpg.level : 0 };
        });

        // Apply ALL bonuses from the new prestige state
        for (const pUpgrade of newPrestigeUpgrades) {
            if (pUpgrade.level > 0) {
                const { bonus } = pUpgrade;
                for (let i = 0; i < pUpgrade.level; i++) {
                    if (bonus.type === 'increase_max_level') {
                        recalculatedUpgrades = recalculatedUpgrades.map(u =>
                            bonus.upgradeIds.includes(u.id) ? { ...u, maxLevel: u.maxLevel + bonus.amount } : u
                        );
                    } else if (bonus.type === 'increase_power_multiplier') {
                        recalculatedUpgrades = recalculatedUpgrades.map(u =>
                            bonus.upgradeIds.includes(u.id) ? { ...u, power: u.power * bonus.multiplier } : u
                        );
                    }
                }
            }
        }
        
        setUpgrades(recalculatedUpgrades);
        // --- End of Bonus Recalculation ---
    }
  }, [prestigePoints, prestigeUpgrades, upgrades, playSound]);

  const handlePrestige = useCallback(() => {
    const pointsGained = calculatePrestigePoints(playerStats.totalCyclesEarned);
    if (pointsGained <= 0) {
        alert("You have not earned enough essence to gain Prestige Points.");
        return;
    }

    if (window.confirm(`Are you sure you want to prestige? This will reset your essence, upgrades, and milestones, but you will gain ${pointsGained} Prestige Points.`)) {
        const startingCycles = prestigeUpgrades.reduce((total, u) => {
            if (u.bonus.type === 'starting_cycles') {
                return total + u.bonus.value * u.level;
            }
            return total;
        }, 0);

        setCycles(startingCycles);
        // Reset upgrades but keep ascended properties (maxLevel, power)
        let resetUpgrades = INITIAL_UPGRADES.map(u => ({ ...u, level: 0 }));
        for (const pUpgrade of prestigeUpgrades) {
          if (pUpgrade.level > 0) {
              const { bonus } = pUpgrade;
              for (let i = 0; i < pUpgrade.level; i++) {
                  if (bonus.type === 'increase_max_level') {
                      resetUpgrades = resetUpgrades.map(u => 
                          bonus.upgradeIds.includes(u.id)
                              ? { ...u, maxLevel: u.maxLevel + bonus.amount }
                              : u
                      );
                  } else if (bonus.type === 'increase_power_multiplier') {
                       resetUpgrades = resetUpgrades.map(u => 
                          bonus.upgradeIds.includes(u.id)
                              ? { ...u, power: u.power * bonus.multiplier }
                              : u
                      );
                  }
              }
          }
        }
        setUpgrades(resetUpgrades);


        setCurrentMilestoneIndex(0);
        setPlayerStats(prev => ({
            ...prev,
            totalClicks: 0,
            totalCyclesEarned: 0,
            xp: 0,
            totalPrestigePointsEver: prev.totalPrestigePointsEver + pointsGained,
            totalPrestiges: (prev.totalPrestiges || 0) + 1,
        }));
        setPrestigePoints(prev => prev + pointsGained);
        setActiveBoosts([]);
        setFloatingNumbers([]);
        
        playSound(prestigeSound);
    }
  }, [playerStats.totalCyclesEarned, prestigeUpgrades, playSound]);

  const handleClaimDailyReward = useCallback(() => {
    const rewardIndex = (effectiveStreak - 1) % DAILY_REWARDS.length;
    const reward = DAILY_REWARDS[rewardIndex];

    // Apply reward
    switch (reward.type) {
        case 'essence_minutes':
            // Base of 100 essence ensures reward even with 0 EPS
            const essenceToAdd = Math.max(100, (cyclesPerSecond || 1) * 60 * reward.value);
            setCycles(c => c + essenceToAdd);
            setPlayerStats(p => ({ ...p, totalCyclesEarned: p.totalCyclesEarned + essenceToAdd }));
            break;
        case 'prestige_points':
            setPrestigePoints(p => p + reward.value);
            break;
        case 'click_boost': {
            const clickBoost: ActiveBoost = {
                id: Date.now(),
                type: 'click_multiplier',
                multiplier: reward.value,
                endTime: Date.now() + (reward.duration || 60) * 1000,
                source: 'Daily Reward'
            };
            setActiveBoosts(prev => [...prev, clickBoost]);
            break;
        }
        case 'bps_boost': {
            const bpsBoost: ActiveBoost = {
                id: Date.now(),
                type: 'bps_multiplier',
                multiplier: reward.value,
                endTime: Date.now() + (reward.duration || 60) * 1000,
                source: 'Daily Reward'
            };
            setActiveBoosts(prev => [...prev, bpsBoost]);
            break;
        }
    }
    
    playSound(milestoneSound); // Re-using a celebratory sound

    // Update state
    setLoginStreak(effectiveStreak);
    setLastLoginDate(new Date().toDateString());
    setIsDailyRewardModalOpen(false);

  }, [effectiveStreak, cyclesPerSecond, playSound]);

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

  const handleGoldenDropletClick = useCallback((id: number) => {
      playSound(goldenChipClickSound);
      
      setGoldenDroplets(prev => prev.map(gc => 
          gc.id === id ? { ...gc, status: 'clicked' } : gc
      ));
      
      setPlayerStats(prev => ({ ...prev, goldenDropletsClicked: (prev.goldenDropletsClicked || 0) + 1 }));

      const newBoost: ActiveBoost = {
          id: Date.now(),
          type: 'click_multiplier',
          multiplier: GOLDEN_DROPLET_BOOST_MULTIPLIER,
          endTime: Date.now() + GOLDEN_DROPLET_BOOST_DURATION * 1000,
          source: 'Golden Droplet!'
      };
      setActiveBoosts(prev => [...prev, newBoost]);
  }, [playSound]);

  const handleGoldenDropletDisappeared = useCallback((id: number) => {
      setGoldenDroplets(prev => prev.filter(gc => gc.id !== id));
  }, []);

    const handleShootingStarClick = useCallback((id: number) => {
        playSound(goldenChipClickSound);
        setShootingStars(prev => prev.map(ss => ss.id === id ? { ...ss, status: 'clicked' } : ss));
        
        const eventConfig = RANDOM_EVENT_CONFIG.EVENTS.find(e => e.type === 'SHOOTING_STAR');
        if (eventConfig && eventConfig.type === 'SHOOTING_STAR') {
            const reward = (cyclesPerSecond || 1) * 60 * eventConfig.rewardMinutesCps;
            setCycles(c => c + reward);
            setPlayerStats(p => ({ ...p, totalCyclesEarned: p.totalCyclesEarned + reward }));
        }
    }, [playSound, cyclesPerSecond]);

    const handleShootingStarDisappeared = useCallback((id: number) => {
        setShootingStars(prev => prev.filter(ss => ss.id !== id));
    }, []);

  const handleLoadState = useCallback((loadedState: SaveState) => {
      if (!loadedState) return;
      try {
        const { cycles, upgrades: savedUpgrades, milestoneIndex, stats, unlockedAchievements, completedChallenges, prestigePoints, prestigeUpgrades: savedPrestigeUpgrades, loginStreak, lastLoginDate } = loadedState;
        
        let upgradesWithLevels = INITIAL_UPGRADES.map(initialUpgrade => {
            const savedUpgrade = savedUpgrades.find(u => u.id === initialUpgrade.id);
            return savedUpgrade ? { ...initialUpgrade, level: savedUpgrade.level } : { ...initialUpgrade, level: 0 };
        });
        
        const savedPrestigeUpgradesMap = new Map(
            (savedPrestigeUpgrades || []).map(u => [u.id, u.level])
        );
        const prestigeUpgradesWithLevels = PRESTIGE_UPGRADES.map(initialUpgrade => ({
            ...initialUpgrade,
            level: savedPrestigeUpgradesMap.get(initialUpgrade.id) || 0,
        }));

        for (const pUpgrade of prestigeUpgradesWithLevels) {
            if (pUpgrade.level > 0) {
                const { bonus } = pUpgrade;
                for (let i = 0; i < pUpgrade.level; i++) {
                    if (bonus.type === 'increase_max_level') {
                        upgradesWithLevels = upgradesWithLevels.map(u => 
                            bonus.upgradeIds.includes(u.id) ? { ...u, maxLevel: u.maxLevel + bonus.amount } : u
                        );
                    } else if (bonus.type === 'increase_power_multiplier') {
                         upgradesWithLevels = upgradesWithLevels.map(u => 
                            bonus.upgradeIds.includes(u.id) ? { ...u, power: u.power * bonus.multiplier } : u
                        );
                    }
                }
            }
        }
        
        setCycles(cycles);
        setUpgrades(upgradesWithLevels);
        setCurrentMilestoneIndex(milestoneIndex);
        setPlayerStats(stats);
        setUnlockedAchievements(new Set(unlockedAchievements));
        setCompletedChallenges(new Set(completedChallenges || []));
        setPrestigePoints(prestigePoints || 0);
        setPrestigeUpgrades(prestigeUpgradesWithLevels);
        setLoginStreak(loginStreak || 0);
        setLastLoginDate(lastLoginDate || null);

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

  const handleStartChallenge = useCallback((challenge: Challenge) => {
    if (activeChallenge) {
        alert("You are already in a challenge!");
        return;
    }
    playSound(purchaseSound);
    let initialValue = 0;
    if (challenge.objective.type === 'earn_essence') {
        initialValue = cycles;
    } else if (challenge.objective.type === 'upgrade_level') {
        const upg = upgrades.find(u => u.id === challenge.objective.upgradeId);
        initialValue = upg ? upg.level : 0;
    }
    
    setActiveChallenge({
        challenge,
        startTime: Date.now(),
        initialValue,
    });
    setIsChallengesOpen(false);
  }, [activeChallenge, cycles, upgrades, playSound]);

  const handleAbandonChallenge = useCallback(() => {
    if (window.confirm("Are you sure you want to abandon this challenge? Your progress will be lost.")) {
        setActiveChallenge(null);
    }
  }, []);

  const handleAdminClick = () => {
    const pass = prompt("Enter admin password:");
    if (pass === 'elixir') {
        setIsAdminModalOpen(true);
    } else if (pass !== null) { // User didn't cancel
        alert("Incorrect password.");
    }
  };

  const showPrestigeTracker = (playerStats.totalPrestiges > 0 || playerStats.totalCyclesEarned > PRESTIGE_REQUIREMENT * 0.01);

  return (
    <div className="h-screen bg-transparent text-slate-200 flex flex-col overflow-hidden relative font-sans pb-20 lg:pb-0">
      {settings.showBackgroundEffects && <BackgroundEffects />}
      <DailyRewardModal
        isOpen={isDailyRewardModalOpen}
        onClaim={handleClaimDailyReward}
        streak={effectiveStreak}
      />
      {activeNotification && (() => {
        const commonProps = {
            key: activeNotification.id,
            onClose: () => setActiveNotification(null),
        };
        switch (activeNotification.type) {
            case 'milestone':
                return <MilestoneToast {...activeNotification} {...commonProps} />;
            case 'achievement':
                return <AchievementToast {...activeNotification} {...commonProps} />;
            case 'challenge':
                return <ChallengeToast {...activeNotification} {...commonProps} />;
            case 'event':
                return <EventToast {...activeNotification} {...commonProps} />;
            default:
                return null;
        }
      })()}
      <div className="absolute top-4 right-4 z-50 flex gap-2 items-center">
        <button
          onClick={() => setIsChallengesOpen(true)}
          className="p-3 rounded-full bg-slate-900/50 hover:bg-slate-800/80 text-slate-300 border border-slate-700 backdrop-blur-sm transition-all shadow-lg hover:shadow-pink-500/10 active:scale-95 hover:text-pink-300"
          aria-label="Open challenges"
        >
          <StopwatchIcon />
        </button>
        <button
          onClick={() => setIsAchievementsOpen(true)}
          className="p-3 rounded-full bg-slate-900/50 hover:bg-slate-800/80 text-slate-300 border border-slate-700 backdrop-blur-sm transition-all shadow-lg hover:shadow-pink-500/10 active:scale-95 hover:text-pink-300"
          aria-label="Open achievements"
        >
          <AchievementIcon />
        </button>
        <button
          onClick={() => setIsStatsOpen(true)}
          className="p-3 rounded-full bg-slate-900/50 hover:bg-slate-800/80 text-slate-300 border border-slate-700 backdrop-blur-sm transition-all shadow-lg hover:shadow-pink-500/10 active:scale-95 hover:text-pink-300"
          aria-label="Open statistics"
        >
          <ChartBarIcon />
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 rounded-full bg-slate-900/50 hover:bg-slate-800/80 text-slate-300 border border-slate-700 backdrop-blur-sm transition-all shadow-lg hover:shadow-pink-500/10 active:scale-95 hover:text-pink-300"
          aria-label="Open settings"
        >
          <SettingsIcon />
        </button>
      </div>

      <button
        onClick={handleAdminClick}
        className="absolute bottom-2 left-2 z-50 p-2 rounded-full bg-slate-900/20 text-slate-700 hover:text-pink-400 hover:bg-slate-800/80 transition-all opacity-25 hover:opacity-100"
        aria-label="Open Admin Panel"
      >
        <AdminIcon />
      </button>

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
             {activeChallenge ? (
                <ChallengeTracker
                    activeChallenge={activeChallenge}
                    cycles={cycles}
                    upgrades={upgrades}
                    onAbandon={handleAbandonChallenge}
                />
             ) : showPrestigeTracker ? (
                <PrestigeTracker playerStats={playerStats} onPrestige={handlePrestige} />
             ) : (
                <MilestoneTracker 
                    currentMilestone={currentMilestone}
                    playerStats={playerStats}
                />
             )}
            <div className="flex-grow min-h-0">
                <BuildingDisplay upgrades={upgrades} />
            </div>
        </div>
        <div className="lg:col-span-2 min-h-0">
             <UpgradeStore
              upgrades={upgrades}
              onPurchase={handlePurchaseUpgrade}
              cycles={cycles}
              prestigePoints={prestigePoints}
              prestigeUpgrades={prestigeUpgrades}
              onPurchasePrestige={handlePurchasePrestigeUpgrade}
            />
        </div>
      </main>

      {/* Mobile Layout */}
      <main className="lg:hidden w-full flex-grow p-4 flex flex-col min-h-0">
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
                    prestigePoints={prestigePoints}
                    prestigeUpgrades={prestigeUpgrades}
                    onPurchasePrestige={handlePurchasePrestigeUpgrade}
                 />
            )}
            {activeMobileView === 'progress' && (
                activeChallenge ? (
                    <ChallengeTracker
                        activeChallenge={activeChallenge}
                        cycles={cycles}
                        upgrades={upgrades}
                        onAbandon={handleAbandonChallenge}
                    />
                 ) : showPrestigeTracker ? (
                    <PrestigeTracker playerStats={playerStats} onPrestige={handlePrestige} />
                 ) : (
                    <MilestoneTracker 
                        currentMilestone={currentMilestone}
                        playerStats={playerStats}
                    />
                 )
            )}
        </div>
      </main>
      
      <MobileNav activeView={activeMobileView} setView={setActiveMobileView} />

      <ParticleCanvas ref={particleCanvasRef} />
      
      {goldenDroplets.map((gc) => (
        <GoldenDroplet
            key={gc.id}
            goldenDroplet={gc}
            onClick={handleGoldenDropletClick}
            onDisappeared={handleGoldenDropletDisappeared}
        />
      ))}
       {shootingStars.map((ss) => (
        <ShootingStar
            key={ss.id}
            star={ss}
            onClick={handleShootingStarClick}
            onDisappeared={handleShootingStarDisappeared}
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
        onPrestige={handlePrestige}
        totalCyclesEarned={playerStats.totalCyclesEarned}
      />
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={ACHIEVEMENTS}
        unlockedAchievements={unlockedAchievements}
        playerStats={playerStats}
        upgrades={upgrades}
      />
       <ChallengesModal
        isOpen={isChallengesOpen}
        onClose={() => setIsChallengesOpen(false)}
        challenges={CHALLENGES}
        completedChallenges={completedChallenges}
        playerStats={playerStats}
        onStartChallenge={handleStartChallenge}
        activeChallenge={activeChallenge}
      />
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={playerStats}
        cycles={cycles}
        cyclesPerClick={cyclesPerClick}
        cyclesPerSecond={cyclesPerSecond}
        prestigePoints={prestigePoints}
        prestigePointsToGain={calculatePrestigePoints(playerStats.totalCyclesEarned)}
        upgrades={upgrades}
        unlockedAchievementsCount={unlockedAchievements.size}
        completedChallengesCount={completedChallenges.size}
      />
       <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        gameState={gameState}
        onLoadState={handleLoadState}
        onAddCycles={(amount) => {
            setCycles(c => c + amount);
            setPlayerStats(p => ({ ...p, totalCyclesEarned: p.totalCyclesEarned + amount }));
        }}
        onAddPrestigePoints={(amount) => setPrestigePoints(p => p + amount)}
        onSetMaxPP={() => setPrestigePoints(999999)}
      />
    </div>
  );
};

export default App;