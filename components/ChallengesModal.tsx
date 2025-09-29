import React from 'react';
import type { Challenge, PlayerStats, ActiveChallengeState } from '../types';
import { LockIcon } from '../constants';

interface ChallengeItemProps {
  challenge: Challenge;
  isUnlocked: boolean;
  isCompleted: boolean;
  onStart: (challenge: Challenge) => void;
  isActive: boolean;
}

const ChallengeItem: React.FC<ChallengeItemProps> = ({ challenge, isUnlocked, isCompleted, onStart, isActive }) => {
  const canStart = isUnlocked && !isCompleted && !isActive;

  return (
    <li className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${isCompleted ? 'bg-pink-900/30 border-pink-700/50' : isUnlocked ? 'bg-slate-700/50 border-slate-600/80' : 'bg-slate-800/50 border-slate-700 opacity-60'}`}>
      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${isCompleted ? 'bg-pink-800/50 text-pink-300' : isUnlocked ? 'bg-slate-600/80 text-slate-400' : 'bg-slate-700 text-slate-500'}`}>
        {React.cloneElement(challenge.icon, { className: 'h-8 w-8' })}
      </div>
      <div className="flex-grow">
        <h4 className={`font-bold ${isCompleted ? 'text-pink-200' : 'text-slate-200'}`}>{challenge.name}</h4>
        <p className={`text-sm ${isCompleted ? 'text-pink-300/90' : 'text-slate-400'}`}>{challenge.description}</p>
        <p className={`text-sm font-semibold mt-1 ${isCompleted ? 'text-green-400' : 'text-purple-300'}`}>
          Reward: +{challenge.reward.value} Prestige Points
        </p>
      </div>
      <div className="w-32 text-right">
        {!isUnlocked ? (
          <div className="flex items-center justify-end gap-2 text-slate-500">
            <LockIcon />
            <span className="text-sm font-semibold">Requires {challenge.unlockCondition.value} prestiges</span>
          </div>
        ) : (
          <button
            onClick={() => onStart(challenge)}
            disabled={!canStart}
            className="font-bold py-2 px-4 rounded-lg transition-colors text-white w-full
              disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-400
              bg-pink-600 hover:bg-pink-700"
          >
            {isCompleted ? 'Completed' : isActive ? 'In Progress' : 'Start'}
          </button>
        )}
      </div>
    </li>
  );
};

interface ChallengesModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenges: Challenge[];
  completedChallenges: Set<string>;
  playerStats: PlayerStats;
  onStartChallenge: (challenge: Challenge) => void;
  activeChallenge: ActiveChallengeState | null;
}

const ChallengesModal: React.FC<ChallengesModalProps> = ({ isOpen, onClose, challenges, completedChallenges, playerStats, onStartChallenge, activeChallenge }) => {
  if (!isOpen) return null;

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
        className="bg-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-3xl h-[80vh] flex flex-col text-slate-200 border border-slate-600/80"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-100">Challenges</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition-colors rounded-full w-8 h-8 flex items-center justify-center"
            aria-label="Close challenges"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto -mr-3 pr-3">
          <ul className="space-y-3">
            {challenges.map(challenge => {
              const isUnlocked = playerStats.totalPrestiges >= challenge.unlockCondition.value;
              const isCompleted = completedChallenges.has(challenge.id);
              return (
                <ChallengeItem
                  key={challenge.id}
                  challenge={challenge}
                  isUnlocked={isUnlocked}
                  isCompleted={isCompleted}
                  onStart={onStartChallenge}
                  isActive={!!activeChallenge}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChallengesModal;
