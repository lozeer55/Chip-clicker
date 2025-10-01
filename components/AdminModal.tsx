import React, { useState, useEffect } from 'react';
import type { SaveState } from '../types';
import { AdminIcon } from '../constants';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: SaveState;
  onLoadState: (state: SaveState) => void;
  onAddCycles: (amount: number) => void;
  onAddPrestigePoints: (amount: number) => void;
  onSetMaxPP: () => void;
}

const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  gameState,
  onLoadState,
  onAddCycles,
  onAddPrestigePoints,
  onSetMaxPP
}) => {
  const [saveData, setSaveData] = useState('');
  const [cyclesToAdd, setCyclesToAdd] = useState('1e6');
  const [ppToAdd, setPpToAdd] = useState('10');

  useEffect(() => {
    if (isOpen) {
      // Format the JSON nicely for the textarea when the modal opens
      setSaveData(JSON.stringify(gameState, null, 2));
    }
  }, [isOpen, gameState]);

  if (!isOpen) return null;

  const handleApplyState = () => {
    try {
      const newState = JSON.parse(saveData);
      onLoadState(newState);
      alert('State loaded successfully!');
      onClose();
    } catch (error) {
      console.error("Failed to parse or apply state:", error);
      alert(`Error loading state: ${error instanceof Error ? error.message : 'Invalid JSON'}. Check the console for details.`);
    }
  };
  
  const handleAddCycles = () => {
      onAddCycles(Number(cyclesToAdd));
  };

  const handleAddPP = () => {
      onAddPrestigePoints(Number(ppToAdd));
  };


  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && window.innerWidth >= 640) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/70 flex items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-slate-800 w-full h-full sm:w-auto sm:h-auto sm:rounded-2xl shadow-xl text-slate-200 border-slate-600/80 sm:border sm:max-w-2xl sm:max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2"><AdminIcon /> Admin Panel</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition-colors rounded-full w-8 h-8 flex items-center justify-center"
            aria-label="Close admin panel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto p-4 sm:p-6">
            {/* Quick Actions */}
            <section>
                <h3 className="font-bold text-lg mb-2 text-pink-400">Quick Actions</h3>
                <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Add Essence</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={cyclesToAdd}
                                    onChange={(e) => setCyclesToAdd(e.target.value)}
                                    className="flex-grow bg-slate-800 border border-slate-600 rounded-md px-3 py-2 font-mono"
                                    placeholder="e.g., 1e9"
                                />
                                <button onClick={handleAddCycles} className="font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md">Add</button>
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-300 mb-1">Add Prestige Points</label>
                            <div className="flex gap-2">
                                <input 
                                    type="number" 
                                    value={ppToAdd}
                                    onChange={(e) => setPpToAdd(e.target.value)}
                                    className="flex-grow bg-slate-800 border border-slate-600 rounded-md px-3 py-2 font-mono"
                                    placeholder="e.g., 100"
                                />
                                <button onClick={handleAddPP} className="font-semibold bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">Add</button>
                            </div>
                        </div>
                    </div>
                     <button 
                        onClick={onSetMaxPP}
                        className="w-full font-bold py-2 px-4 rounded-lg transition-colors text-white bg-purple-600 hover:bg-purple-700"
                    >
                        Set 999k Prestige Points
                    </button>
                </div>
            </section>
        
            {/* Raw Save Editor */}
            <section>
                <h3 className="font-bold text-lg mb-2 text-pink-400">Raw Save Editor</h3>
                <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 space-y-3">
                    <p className="text-xs text-slate-400">Caution: Modifying these values can break your save. Make sure your JSON is valid before applying.</p>
                    <textarea
                    value={saveData}
                    onChange={(e) => setSaveData(e.target.value)}
                    className="w-full h-64 p-3 bg-slate-900 border border-slate-600 rounded-md font-mono text-xs text-slate-200 resize-y"
                    spellCheck="false"
                    />
                    <button
                    onClick={handleApplyState}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 active:scale-95"
                    >
                    Apply State
                    </button>
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;