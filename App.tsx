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
import PrestigeModal from './components/PrestigeModal';
import type { Upgrade, FloatingNumberType, GameSettings, PlayerStats, Achievement, ActiveBoost, MilestoneToastInfo, AchievementToastInfo, GoldenDropletType, SaveState, MobileView, PrestigeUpgrade, Challenge, ActiveChallengeState, ChallengeToastInfo, EventToastInfo, ShootingStarType } from './types';
import { INITIAL_UPGRADES, UPGRADE_TIERS, SettingsIcon, MILESTONES, ACHIEVEMENTS, AchievementIcon, ChartBarIcon, BASE_GOLDEN_DROPLET_CONFIG, PRESTIGE_UPGRADES, calculatePrestigePoints, DAILY_REWARDS, CHALLENGES, StopwatchIcon, BASE_RANDOM_EVENT_CONFIG, MagicIcon, LightningIcon, AdminIcon, PRESTIGE_REQUIREMENT, GalaxyIcon } from './constants';
import { backgroundMusic, clickSound, milestoneSound, purchaseSound, achievementSound, goldenChipSpawnSound, goldenChipClickSound, prestigeSound } from './sounds';

const SAVE_KEY = 'elixirClickerSave';
const SETTINGS_KEY = 'elixirClickerSettings';

type Notification = 
  | ({ type: 'milestone' } & MilestoneToastInfo)
  | ({ type: 'achievement' } & AchievementToastInfo)
  | ({ type: 'challenge' } & ChallengeToastInfo)
  | ({ type: 'event' } & EventToastInfo);

// Centralized function to apply all prestige bonuses to a given set of upgrades.
// This is the single source of truth for how prestige affects the game state.
const applyPrestigeBonuses = (baseUpgrades: Upgrade[], prestigeUpgrades: PrestigeUpgrade[]): Upgrade[] => {
    let finalUpgrades = baseUpgrades.map(u => ({...u})); // Start with a fresh copy

    const firstInTierUpgradeIds = UPGRADE_TIERS.map(tier => tier.upgrades[0].id);
    const secondInTierUpgradeIds = UPGRADE_TIERS.filter(t => t.upgrades.length > 1).map(tier => tier.upgrades[1].id);
    const catalystSynergyLevel = prestigeUpgrades.find(pu => pu.id === 'catalyst_synergy')?.level || 0;

    for (const pUpgrade of prestigeUpgrades) {
        if (pUpgrade.level <= 0) continue;
        
        for (let i = 0; i < pUpgrade.level; i++) {
            const bonus = pUpgrade.bonus;
            switch(bonus.type) {
                case 'increase_max_level':
                    finalUpgrades = finalUpgrades.map(u =>
                        bonus.upgradeIds.includes(u.id) ? { ...u, maxLevel: u.maxLevel + bonus.amount } : u
                    );
                    break;
                case 'increase_power_multiplier':
                    // Synergy nexus is handled in calculation hooks, not by modifying base power
                    if (pUpgrade.id === 'synergy_nexus') continue;
                     
                    finalUpgrades = finalUpgrades.map(u =>
                        bonus.upgradeIds.includes(u.id) ? { ...u, power: u.power * bonus.multiplier } : u
                    );
                    break;
                case 'unlock_upgrade':
                    finalUpgrades = finalUpgrades.map(u =>
                        u.id === bonus.upgradeId ? { ...u, isUnlocked: true } : u
                    );
                    break;
                case 'first_in_tier_bonus':
                     finalUpgrades = finalUpgrades.map(u => {
                        // Apply to first in tier
                        if (firstInTierUpgradeIds.includes(u.id)) {
                            return { ...u, power: u.power * bonus.multiplier };
                        }
                        // Apply to second in tier if catalyst is owned
                        if (catalystSynergyLevel > 0 && secondInTierUpgradeIds.includes(u.id)) {
                             return { ...u, power: u.power * bonus.multiplier };
                        }
                        return u;
                    });
                    break;
            }
        }
    }
    return finalUpgrades;
};

// A simple function to load and parse the save file, or return null.
const loadState = (): SaveState | null => {
    try {
        const savedData = localStorage.getItem(SAVE_KEY);
        if (savedData) {
            return JSON.parse(savedData);
        }
    } catch (error) {
        console.error("Failed to load saved game:", error);
        localStorage.removeItem(SAVE_KEY); // Clear corrupted save
    }
    return null;
}

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
  const [initialState] = useState(() => {
    const saved = loadState();

    if (saved) {
        // Rebuild full state from save data and constants
        const prestigeUpgradesWithLevels = PRESTIGE_UPGRADES.map(pu => ({
            ...pu,
            level: saved.prestigeUpgrades?.find(spu => spu.id === pu.id)?.level || 0
        }));

        const baseUpgrades = INITIAL_UPGRADES.map(iu => ({
            ...iu,
            level: saved.upgrades?.find(su => su.id === iu.id)?.level || 0,
            isUnlocked: saved.upgrades?.find(su => su.id === iu.id)?.isUnlocked ?? !iu.isSecret
        }));
        
        const finalUpgrades = applyPrestigeBonuses(baseUpgrades, prestigeUpgradesWithLevels);
        
        const defaultStats: PlayerStats = { totalClicks: 0, totalCyclesEarned: 0, xp: 0, totalPrestigePointsEver: 0, totalPrestiges: 0, goldenDropletsClicked: 0 };

        return {
            cycles: saved.cycles || 0,
            upgrades: finalUpgrades,
            milestoneIndex: saved.milestoneIndex || 0,
            stats: { ...defaultStats, ...(saved.stats || {}) },
            unlockedAchievements: new Set(saved.unlockedAchievements || []),
            completedChallenges: new Set(saved.completedChallenges || []),
            prestigePoints: saved.prestigePoints || 0,
            prestigeUpgrades: prestigeUpgradesWithLevels,
            loginStreak: saved.loginStreak || 0,
            lastLoginDate: saved.lastLoginDate || null,
        };
    }
    
    // If no save, return a pristine default state
    const defaultPrestigeUpgrades = PRESTIGE_UPGRADES.map(u => ({...u, level: 0}));
    const defaultUpgrades = INITIAL_UPGRADES.map(u => ({...u, level: 0, isUnlocked: !u.isSecret}));

    return {
        cycles: 0,
        upgrades: defaultUpgrades,
        milestoneIndex: 0,
        stats: { totalClicks: 0, totalCyclesEarned: 0, xp: 0, totalPrestigePointsEver: 0, totalPrestiges: 0, goldenDropletsClicked: 0 },
        unlockedAchievements: new Set<string>(),
        completedChallenges: new Set<string>(),
        prestigePoints: 0,
        prestigeUpgrades: defaultPrestigeUpgrades,
        loginStreak: 0,
        lastLoginDate: null,
    };
  });
  
  const [cycles, setCycles] = useState<number>(initialState.cycles);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(initialState.upgrades);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumberType[]>([]);
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isChallengesOpen, setIsChallengesOpen] = useState(false);
  const [isPrestigeModalOpen, setIsPrestigeModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState<number>(initialState.milestoneIndex);
  const [activeBoosts, setActiveBoosts] = useState<ActiveBoost[]>([]);
  const [notificationQueue, setNotificationQueue] = useState<Notification[]>([]);
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats>(initialState.stats);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(initialState.unlockedAchievements);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(initialState.completedChallenges);
  const [goldenDroplets, setGoldenDroplets] = useState<GoldenDropletType[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStarType[]>([]);
  const [activeMobileView, setActiveMobileView] = useState<MobileView>('main');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [prestigePoints, setPrestigePoints] = useState<number>(initialState.prestigePoints);
  const [prestigeUpgrades, setPrestigeUpgrades] = useState<PrestigeUpgrade[]>(initialState.prestigeUpgrades);
  const [loginStreak, setLoginStreak] = useState<number>(initialState.loginStreak);
  const [lastLoginDate, setLastLoginDate] = useState<string | null>(initialState.lastLoginDate);
  const [isDailyRewardModalOpen, setIsDailyRewardModalOpen] = useState(false);
  const [effectiveStreak, setEffectiveStreak] = useState(1);
  const [activeChallenge, setActiveChallenge] = useState<ActiveChallengeState | null>(null);

  const particleCanvasRef = useRef<ParticleCanvasHandle>(null);
  const goldenDropletTimerRef = useRef<number | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  
  const gameState = useMemo((): SaveState => ({
    cycles,
    upgrades: upgrades.map(({ id, level, isUnlocked }) => ({ id, level, isUnlocked })),
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
  
  const prestigeBonuses = useMemo(() => {
    const bonuses = {
        all_cycles_multiplier: 1,
        achievement_bonus: 0,
        prestige_point_bonus: 1,
        golden_droplet_chance: 1,
        golden_droplet_duration: 1,
        golden_droplet_effect: 1,
        random_event_chance: 1,
        random_event_effect: 1,
        xp_multiplier: 1,
        prestige_cost_reduction: 1,
        cps_to_click_synergy: 0,
        auto_to_click_synergy: 0,
        click_to_auto_synergy: 0,
        ascension_pp_synergy: 0,
    };

    let meta_perm_boost_multiplier = 1;
    let synergy_nexus_multiplier = 1;

    // First pass to gather all base bonuses
    for (const pUpgrade of prestigeUpgrades) {
        if (pUpgrade.level <= 0) continue;

        for (let i = 0; i < pUpgrade.level; i++) {
            const b = pUpgrade.bonus;
            switch (b.type) {
                case 'all_cycles_multiplier': bonuses.all_cycles_multiplier += b.value; break;
                case 'achievement_bonus': bonuses.achievement_bonus += b.multiplier_per_achievement; break;
                case 'prestige_point_bonus': bonuses.prestige_point_bonus *= b.multiplier; break;
                case 'golden_droplet_chance': bonuses.golden_droplet_chance *= b.multiplier; break;
                case 'golden_droplet_duration': bonuses.golden_droplet_duration *= b.multiplier; break;
                case 'golden_droplet_effect': bonuses.golden_droplet_effect *= b.multiplier; break;
                case 'random_event_chance': bonuses.random_event_chance *= b.multiplier; break;
                case 'random_event_effect': bonuses.random_event_effect *= b.multiplier; break;
                case 'xp_multiplier': bonuses.xp_multiplier *= b.multiplier; break;
                case 'prestige_cost_reduction': bonuses.prestige_cost_reduction *= b.multiplier; break;
                case 'cps_to_click_synergy': bonuses.cps_to_click_synergy += b.value; break;
                case 'auto_to_click_synergy': bonuses.auto_to_click_synergy += b.value; break;
                case 'click_to_auto_synergy': bonuses.click_to_auto_synergy += b.value; break;
                case 'meta_perm_boost_multiplier': meta_perm_boost_multiplier *= b.multiplier; break;
                case 'ascension_pp_synergy': {
                  const ascensionUpgradesOwned = prestigeUpgrades.filter(pu => pu.id.startsWith('ascension_') && pu.level > 0).length;
                  bonuses.ascension_pp_synergy = ascensionUpgradesOwned * b.multiplier;
                  break;
                }
            }
        }
        if (pUpgrade.id === 'synergy_nexus' && pUpgrade.level > 0) {
            synergy_nexus_multiplier = pUpgrade.bonus.type === 'increase_power_multiplier' ? pUpgrade.bonus.multiplier : 1;
        }
    }
    
    // Apply meta bonuses
    bonuses.all_cycles_multiplier = 1 + ((bonuses.all_cycles_multiplier - 1) * meta_perm_boost_multiplier);
    bonuses.cps_to_click_synergy *= synergy_nexus_multiplier;
    bonuses.auto_to_click_synergy *= synergy_nexus_multiplier;
    bonuses.click_to_auto_synergy *= synergy_nexus_multiplier;
    
    // Finalize PP bonus
    bonuses.prestige_point_bonus += bonuses.ascension_pp_synergy;

    return bonuses;
  }, [prestigeUpgrades]);

  const achievementMultiplier = useMemo(() => {
    return 1 + (unlockedAchievements.size * prestigeBonuses.achievement_bonus);
  }, [unlockedAchievements.size, prestigeBonuses.achievement_bonus]);

  const baseCyclesPerSecond = useMemo(() => {
    return upgrades
      .filter(u => u.type === 'auto')
      .reduce((total, u) => total + u.power * u.level, 0);
  }, [upgrades]);
  
  const baseCyclesPerClick = useMemo(() => {
      return upgrades
        .filter(u => u.type === 'click' && u.level > 0)
        .reduce((total, u) => total + u.power * u.level, 1);
  }, [upgrades]);

  const cyclesPerSecond = useMemo(() => {
    const synergyBonus = (baseCyclesPerClick - 1) * prestigeBonuses.click_to_auto_synergy;
    return (baseCyclesPerSecond + synergyBonus) * totalBoostMultiplier('bps_multiplier') * prestigeBonuses.all_cycles_multiplier * achievementMultiplier;
  }, [baseCyclesPerSecond, baseCyclesPerClick, totalBoostMultiplier, prestigeBonuses, achievementMultiplier]);

  const cyclesPerClick = useMemo(() => {
    const synergyBonusCps = baseCyclesPerSecond * prestigeBonuses.cps_to_click_synergy;
    const synergyBonusAuto = baseCyclesPerSecond * prestigeBonuses.auto_to_click_synergy;
    return (baseCyclesPerClick + synergyBonusCps + synergyBonusAuto) * totalBoostMultiplier('click_multiplier') * prestigeBonuses.all_cycles_multiplier * achievementMultiplier;
  }, [baseCyclesPerClick, baseCyclesPerSecond, totalBoostMultiplier, prestigeBonuses, achievementMultiplier]);

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
  
  const effectiveGoldenDropletConfig = useMemo(() => ({
    LIFESPAN: BASE_GOLDEN_DROPLET_CONFIG.LIFESPAN * prestigeBonuses.golden_droplet_duration,
    SPAWN_INTERVAL_MIN: BASE_GOLDEN_DROPLET_CONFIG.SPAWN_INTERVAL_MIN / prestigeBonuses.golden_droplet_chance,
    SPAWN_INTERVAL_MAX: BASE_GOLDEN_DROPLET_CONFIG.SPAWN_INTERVAL_MAX / prestigeBonuses.golden_droplet_chance,
    BOOST_MULTIPLIER: BASE_GOLDEN_DROPLET_CONFIG.BOOST_MULTIPLIER * prestigeBonuses.golden_droplet_effect,
    BOOST_DURATION: BASE_GOLDEN_DROPLET_CONFIG.BOOST_DURATION * prestigeBonuses.golden_droplet_effect,
  }), [prestigeBonuses]);

  // Golden Droplet Spawner
    useEffect(() => {
        const scheduleNextSpawn = () => {
            if (goldenDropletTimerRef.current) {
                clearTimeout(goldenDropletTimerRef.current);
            }
            const delay = Math.random() * (effectiveGoldenDropletConfig.SPAWN_INTERVAL_MAX - effectiveGoldenDropletConfig.SPAWN_INTERVAL_MIN) + effectiveGoldenDropletConfig.SPAWN_INTERVAL_MIN;
            
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
    }, [playSound, effectiveGoldenDropletConfig]);

    // Golden Droplet Timeout
    useEffect(() => {
        const visibleDroplet = goldenDroplets.find(gc => gc.status === 'visible');
        if (visibleDroplet) {
            const timeoutId = setTimeout(() => {
                setGoldenDroplets(prev => prev.map(gc => 
                    gc.id === visibleDroplet.id ? { ...gc, status: 'missed' } : gc
                ));
            }, effectiveGoldenDropletConfig.LIFESPAN);

            return () => clearTimeout(timeoutId);
        }
    }, [goldenDroplets, effectiveGoldenDropletConfig.LIFESPAN]);
    
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

    const effectiveRandomEventConfig = useMemo(() => {
        const effectMult = prestigeBonuses.random_event_effect;
        return {
            ...BASE_RANDOM_EVENT_CONFIG,
            EVENT_CHANCE: BASE_RANDOM_EVENT_CONFIG.EVENT_CHANCE * prestigeBonuses.random_event_chance,
            EVENTS: BASE_RANDOM_EVENT_CONFIG.EVENTS.map(event => ({
                ...event,
                duration: event.duration * effectMult,
                multiplier: event.multiplier ? event.multiplier * effectMult : undefined,
                discount: event.discount ? 1 - ((1 - event.discount) / effectMult) : undefined, // discount gets stronger
                rewardMinutesCps: event.rewardMinutesCps ? event.rewardMinutesCps * effectMult : undefined,
            }))
        };
    }, [prestigeBonuses]);

    // Random Event Spawner
    useEffect(() => {
        const eventTimer = setInterval(() => {
            if (Math.random() > effectiveRandomEventConfig.EVENT_CHANCE) return;
            
            const totalWeight = effectiveRandomEventConfig.EVENTS.reduce((sum, event) => sum + event.weight, 0);
            let random = Math.random() * totalWeight;
            
            for (const event of effectiveRandomEventConfig.EVENTS) {
                if (random < event.weight) {
                    // Trigger this event
                    switch (event.type) {
                        case 'ESSENCE_FRENZY':
                            playSound(milestoneSound);
                            const now = Date.now();
                            const endTime = now + (event.duration || 15) * 1000;
                            setActiveBoosts(prev => [
                                ...prev,
                                { id: now, type: 'click_multiplier', multiplier: event.multiplier || 5, endTime, source: 'Essence Frenzy' },
                                { id: now + 1, type: 'bps_multiplier', multiplier: event.multiplier || 5, endTime, source: 'Essence Frenzy' }
                            ]);
                            setNotificationQueue(prev => [...prev, {
                                type: 'event',
                                id: now,
                                title: '¡Frenesí de Esencia!',
                                description: `¡Toda la ganancia de esencia x${event.multiplier || 5} por ${Math.round(event.duration || 15)} segundos!`,
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
                                        ? { ...u, surged: { discount: event.discount || 0.9, endTime: Date.now() + (event.duration || 20) * 1000 } }
                                        : u
                                ));
                                setNotificationQueue(prev => [...prev, {
                                    type: 'event',
                                    id: Date.now(),
                                    title: '¡Oleada de Mejoras!',
                                    description: `${randomUpgrade.name} tiene un ${Math.round((event.discount || 0.9) * 100)}% de descuento por ${Math.round(event.duration || 20)}s!`,
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
                                id, startX, startY, endX, endY, duration: event.duration || 5, status: 'visible'
                            }]);
                            break;
                    }
                    return; // Exit after triggering one event
                }
                random -= event.weight;
            }

        }, effectiveRandomEventConfig.TICK_INTERVAL);

        return () => clearInterval(eventTimer);
    }, [upgrades, playSound, effectiveRandomEventConfig]);

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
        xp: prev.xp + (1 * prestigeBonuses.xp_multiplier),
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

  }, [cyclesPerClick, playSound, totalBoostMultiplier, settings.showFloatingNumbers, settings.showParticles, hasInteracted, prestigeBonuses.xp_multiplier]);

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
      setPlayerStats(prev => ({...prev, xp: prev.xp + (levelsToBuy * 5 * prestigeBonuses.xp_multiplier) }));
    }
  }, [cycles, upgrades, playSound, prestigeBonuses.xp_multiplier]);
  
  const handlePurchasePrestigeUpgrade = useCallback((upgradeId: string) => {
    const upgrade = prestigeUpgrades.find(u => u.id === upgradeId);
    if (!upgrade) return;

    // Check dependency
    const requires = Array.isArray(upgrade.requires) ? upgrade.requires : (upgrade.requires ? [upgrade.requires] : []);
    const requirementsMet = requires.every(reqId => {
        const requiredUpgrade = prestigeUpgrades.find(p => p.id === reqId);
        return requiredUpgrade && requiredUpgrade.level > 0;
    });

    if (!requirementsMet) {
        return; // Requirement not met
    }

    const cost = upgrade.cost(upgrade.level) * prestigeBonuses.prestige_cost_reduction;
    if (prestigePoints >= cost && (!upgrade.maxLevel || upgrade.level < upgrade.maxLevel)) {
        playSound(purchaseSound);
        setPrestigePoints(prev => prev - cost);
        
        const newPrestigeUpgrades = prestigeUpgrades.map(u =>
            u.id === upgradeId ? { ...u, level: u.level + 1 } : u
        );
        setPrestigeUpgrades(newPrestigeUpgrades);

        // --- Bonus Recalculation using the new centralized function ---
        const baseUpgradesWithLevels = upgrades.map(u => ({...u})); // Create copy of current upgrades
        const finalUpgrades = applyPrestigeBonuses(baseUpgradesWithLevels, newPrestigeUpgrades);
        setUpgrades(finalUpgrades);
    }
  }, [prestigePoints, prestigeUpgrades, upgrades, playSound, prestigeBonuses.prestige_cost_reduction]);

  const handlePrestige = useCallback(() => {
    const pointsGained = calculatePrestigePoints(playerStats.totalCyclesEarned, prestigeBonuses.prestige_point_bonus);
    if (pointsGained <= 0) {
        alert("You have not earned enough essence to gain Prestige Points.");
        return;
    }

    if (window.confirm(`Are you sure you want to prestige? This will reset your essence, upgrades, and milestones, but you will gain ${pointsGained} Prestige Points.`)) {
        
        let newBoosts: ActiveBoost[] = [];
        let startingCycles = 0;

        // Handle special "on prestige" triggers
        for (const pUpgrade of prestigeUpgrades) {
            if (pUpgrade.level <= 0) continue;
            const bonus = pUpgrade.bonus;
            for (let i = 0; i < pUpgrade.level; i++) {
                if (bonus.type === 'prestige_burst_essence') {
                    startingCycles += (prestigePoints * bonus.percent_of_pp);
                } else if (bonus.type === 'starting_cycles') {
                    startingCycles += bonus.value * (i + 1);
                } else if (bonus.type === 'prestige_boost') {
                     let duration = bonus.duration;
                     const durationMultiplier = prestigeUpgrades.reduce((mult, pu) => {
                        if (pu.level > 0 && pu.bonus.type === 'prestige_boost_duration_multiplier') {
                            return mult * Math.pow(pu.bonus.multiplier, pu.level);
                        }
                        return mult;
                     }, 1);

                    newBoosts.push({
                        id: Date.now() + Math.random(),
                        type: bonus.boost_type === 'click' ? 'click_multiplier' : 'bps_multiplier',
                        multiplier: bonus.multiplier,
                        endTime: Date.now() + duration * durationMultiplier * 1000,
                        source: 'Prestige Boost'
                    });
                } else if (bonus.type === 'unlock_upgrade' && bonus.upgradeId === 'star_caller_ability') {
                     const id = Date.now();
                     const isFromLeft = Math.random() > 0.5;
                     const startX = isFromLeft ? -100 : window.innerWidth + 100;
                     const startY = -100;
                     const endX = window.innerWidth - (isFromLeft ? -100 : window.innerWidth + 100);
                     const endY = window.innerHeight + 100;
                     setShootingStars(prev => [...prev, {
                         id, startX, startY, endX, endY, duration: 5, status: 'visible'
                     }]);
                }
            }
        }

        setCycles(startingCycles);
        
        // Use centralized function to correctly reset upgrades while keeping prestige bonuses
        const baseResetUpgrades = INITIAL_UPGRADES.map(u => ({ ...u, level: 0, isUnlocked: !u.isSecret }));
        const finalResetUpgrades = applyPrestigeBonuses(baseResetUpgrades, prestigeUpgrades);
        setUpgrades(finalResetUpgrades);

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
        setActiveBoosts(newBoosts);
        setFloatingNumbers([]);
        
        playSound(prestigeSound);
    }
  }, [playerStats.totalCyclesEarned, prestigeUpgrades, prestigePoints, playSound, prestigeBonuses.prestige_point_bonus]);

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
            // Forcefully remove known keys first for good measure.
            localStorage.removeItem(SAVE_KEY);
            localStorage.removeItem(SETTINGS_KEY);
            // Clear absolutely everything for the domain.
            localStorage.clear();
            // Reload the page to start from a clean slate.
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

      let newBoosts: ActiveBoost[] = [{
          id: Date.now(),
          type: 'click_multiplier',
          multiplier: effectiveGoldenDropletConfig.BOOST_MULTIPLIER,
          endTime: Date.now() + effectiveGoldenDropletConfig.BOOST_DURATION * 1000,
          source: 'Golden Droplet!'
      }];
      
      for(const pUpgrade of prestigeUpgrades) {
          if (pUpgrade.level > 0 && pUpgrade.bonus.type === 'golden_droplet_secondary_boost') {
              const bonus = pUpgrade.bonus;
              newBoosts.push({
                id: Date.now() + 1,
                type: 'bps_multiplier',
                multiplier: bonus.multiplier,
                endTime: Date.now() + bonus.duration * 1000,
                source: 'Gilded Essence'
              });
          }
      }
      
      setActiveBoosts(prev => [...prev, ...newBoosts]);
  }, [playSound, effectiveGoldenDropletConfig, prestigeUpgrades]);

  const handleGoldenDropletDisappeared = useCallback((id: number) => {
      setGoldenDroplets(prev => prev.filter(gc => gc.id !== id));
  }, []);

    const handleShootingStarClick = useCallback((id: number) => {
        playSound(goldenChipClickSound);
        setShootingStars(prev => prev.map(ss => ss.id === id ? { ...ss, status: 'clicked' } : ss));
        
        const eventConfig = effectiveRandomEventConfig.EVENTS.find(e => e.type === 'SHOOTING_STAR');
        if (eventConfig && eventConfig.type === 'SHOOTING_STAR') {
            const reward = (cyclesPerSecond || 1) * 60 * (eventConfig.rewardMinutesCps || 2);
            setCycles(c => c + reward);
            setPlayerStats(p => ({ ...p, totalCyclesEarned: p.totalCyclesEarned + reward }));
        }
    }, [playSound, cyclesPerSecond, effectiveRandomEventConfig]);

    const handleShootingStarDisappeared = useCallback((id: number) => {
        setShootingStars(prev => prev.filter(ss => ss.id !== id));
    }, []);

  const handleLoadState = useCallback((loadedState: SaveState) => {
      if (!loadedState) return;
      try {
        const { cycles, upgrades: savedUpgrades, milestoneIndex, stats, unlockedAchievements, completedChallenges, prestigePoints, prestigeUpgrades: savedPrestigeUpgrades, loginStreak, lastLoginDate } = loadedState;
        
        const prestigeUpgradesWithLevels = PRESTIGE_UPGRADES.map(pu => ({
            ...pu,
            level: savedPrestigeUpgrades?.find(spu => spu.id === pu.id)?.level || 0
        }));

        const baseUpgrades = INITIAL_UPGRADES.map(iu => ({
            ...iu,
            level: savedUpgrades?.find(su => su.id === iu.id)?.level || 0,
            isUnlocked: savedUpgrades?.find(su => su.id === iu.id)?.isUnlocked ?? !iu.isSecret
        }));
        
        const finalUpgrades = applyPrestigeBonuses(baseUpgrades, prestigeUpgradesWithLevels);
        
        setCycles(cycles);
        setUpgrades(finalUpgrades);
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
          onClick={() => setIsPrestigeModalOpen(true)}
          className="p-3 rounded-full bg-slate-900/50 hover:bg-slate-800/80 text-slate-300 border border-slate-700 backdrop-blur-sm transition-all shadow-lg hover:shadow-purple-500/10 active:scale-95 hover:text-purple-300"
          aria-label="Open Prestige Tree"
        >
          <GalaxyIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => setIsChallengesOpen(true)}
          className="p-3 rounded-full bg-slate-900/50 hover:bg-slate-800/80 text-slate-300 border border-slate-700 backdrop-blur-sm transition-all shadow-lg hover:shadow-pink-500/10 active:scale-95 hover:text-pink-300"
          aria-label="Open challenges"
        >
          <StopwatchIcon className="h-6 w-6" />
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
                <PrestigeTracker playerStats={playerStats} onPrestige={handlePrestige} prestigePointBonus={prestigeBonuses.prestige_point_bonus} />
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
                    <PrestigeTracker playerStats={playerStats} onPrestige={handlePrestige} prestigePointBonus={prestigeBonuses.prestige_point_bonus} />
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
        prestigePointsToGain={calculatePrestigePoints(playerStats.totalCyclesEarned, prestigeBonuses.prestige_point_bonus)}
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
      <PrestigeModal
        isOpen={isPrestigeModalOpen}
        onClose={() => setIsPrestigeModalOpen(false)}
        prestigePoints={prestigePoints}
        prestigeUpgrades={prestigeUpgrades}
        onPurchase={handlePurchasePrestigeUpgrade}
       />
    </div>
  );
};

export default App;