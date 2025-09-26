import React, { useState } from 'react';
import type { GameSettings, SaveState } from '../types';
import GoogleAuth from './GoogleAuth';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSettingsChange: (newSettings: Partial<GameSettings>) => void;
  onReset: () => void;
  gameState: SaveState;
  onLoadGame: (state: SaveState) => void;
  onManualSave: () => void;
  onManualLoad: () => void;
}

const SpeakerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
);
const CloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
    </svg>
);

const FloppyDiskIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1H3zm5 2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1V5zm-2 8a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" />
    </svg>
);

interface SettingsToggleProps {
    label: string;
    description?: string;
    isEnabled: boolean;
    onToggle: () => void;
}

const SettingsToggle: React.FC<SettingsToggleProps> = ({ label, description, isEnabled, onToggle }) => (
    <div className="flex items-center justify-between p-3 bg-slate-700/50 border border-slate-600 rounded-lg">
        <div>
            <span className="font-semibold text-slate-200 select-none cursor-pointer" onClick={onToggle}>
                {label}
            </span>
            {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
        </div>
        <button
          role="switch"
          aria-checked={isEnabled}
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-slate-800 ${isEnabled ? 'bg-pink-500' : 'bg-slate-500'}`}
          aria-label={label}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);


const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSettingsChange, onReset, gameState, onLoadGame, onManualSave, onManualLoad }) => {
  if (!isOpen) return null;

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const handleManualSaveClick = () => {
    onManualSave();
    setSaveStatus('saved');
    setTimeout(() => {
        setSaveStatus('idle');
    }, 2000);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-md text-slate-200 border border-slate-600/80 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-100">Settings</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition-colors rounded-full w-8 h-8 flex items-center justify-center"
            aria-label="Close settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Audio Section */}
          <section>
            <h3 className="font-bold text-lg mb-2 text-slate-300 flex items-center"><SpeakerIcon /> Audio</h3>
            <div className="space-y-3">
              <SettingsToggle 
                label="Sound Effects"
                isEnabled={settings.sfxEnabled}
                onToggle={() => onSettingsChange({ sfxEnabled: !settings.sfxEnabled })}
              />
              <div className={`p-3 bg-slate-700/50 border border-slate-600 rounded-lg transition-opacity ${!settings.sfxEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <label htmlFor="sfx-volume-slider" className="font-semibold text-slate-200 mb-2 block text-sm">SFX Volume</label>
                <input
                  id="sfx-volume-slider"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={settings.sfxVolume}
                  onChange={e => onSettingsChange({ sfxVolume: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  disabled={!settings.sfxEnabled}
                />
              </div>
              <SettingsToggle 
                label="Background Music"
                isEnabled={settings.musicEnabled}
                onToggle={() => onSettingsChange({ musicEnabled: !settings.musicEnabled })}
              />
              <div className={`p-3 bg-slate-700/50 border border-slate-600 rounded-lg transition-opacity ${!settings.musicEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <label htmlFor="music-volume-slider" className="font-semibold text-slate-200 mb-2 block text-sm">Music Volume</label>
                <input
                  id="music-volume-slider"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={settings.musicVolume}
                  onChange={e => onSettingsChange({ musicVolume: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  disabled={!settings.musicEnabled}
                />
              </div>
            </div>
          </section>

          <div className="border-t border-slate-700/80"></div>

          {/* Visuals Section */}
          <section>
             <h3 className="font-bold text-lg mb-2 text-slate-300 flex items-center"><EyeIcon /> Visuals</h3>
             <div className="space-y-3">
                 <SettingsToggle 
                    label="Floating Click Numbers"
                    description="Shows the number of cycles gained per click."
                    isEnabled={settings.showFloatingNumbers}
                    onToggle={() => onSettingsChange({ showFloatingNumbers: !settings.showFloatingNumbers })}
                 />
                 <SettingsToggle 
                    label="Click Particles"
                    description="Visual effects when you click the chip."
                    isEnabled={settings.showParticles}
                    onToggle={() => onSettingsChange({ showParticles: !settings.showParticles })}
                 />
                 <SettingsToggle 
                    label="Background Effects"
                    description="Animated circuits in the background."
                    isEnabled={settings.showBackgroundEffects}
                    onToggle={() => onSettingsChange({ showBackgroundEffects: !settings.showBackgroundEffects })}
                 />
             </div>
          </section>

          <div className="border-t border-slate-700/80"></div>

          {/* Data Section */}
          <section>
            <h3 className="font-bold text-lg mb-2 text-slate-300 flex items-center"><FloppyDiskIcon /> Local & Cloud Data</h3>
            <div className="space-y-3">
                <div className="p-3 bg-slate-700/50 border border-slate-600 rounded-lg space-y-3">
                    <p className="text-sm text-slate-400">Save/load your progress to this device.</p>
                    <div className="flex gap-2 pt-1">
                        <button
                            onClick={handleManualSaveClick}
                            disabled={saveStatus === 'saved'}
                            className={`flex-1 text-sm font-bold py-2 px-3 rounded-lg shadow-sm transition-all duration-150 active:scale-95 text-white ${saveStatus === 'saved' ? 'bg-pink-600 hover:bg-pink-600 cursor-default' : 'bg-purple-600 hover:bg-purple-700'}`}
                        >
                            {saveStatus === 'saved' ? 'Saved!' : 'Save to Device'}
                        </button>
                        <button
                            onClick={onManualLoad}
                            className="flex-1 text-sm font-bold py-2 px-3 rounded-lg shadow-sm transition-all duration-150 active:scale-95 bg-slate-600 hover:bg-slate-500 text-white"
                        >
                            Load from Device
                        </button>
                    </div>
                </div>
                <CloudIcon />
                <GoogleAuth gameState={gameState} onLoadGame={onLoadGame} />
            </div>
          </section>

          <div className="border-t border-slate-700/80"></div>

          {/* Danger Zone Section */}
          <section>
            <h3 className="font-bold text-lg mb-2 text-red-500">Danger Zone</h3>
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                <button
                    onClick={onReset}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 active:scale-95"
                >
                    Reset Game Progress
                </button>
                <p className="text-xs text-center mt-2 text-red-400">This action cannot be undone.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;