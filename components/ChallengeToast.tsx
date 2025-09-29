import React, { useEffect } from 'react';
import { TrophyIcon, StopwatchIcon } from '../constants';
import type { ChallengeToastInfo } from '../types';

const ChallengeToast: React.FC<ChallengeToastInfo & { onClose: () => void }> = ({ name, status, rewardDescription, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // 5 seconds visibility
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = status === 'success';

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-md p-4 text-white rounded-xl shadow-2xl animate-slide-in-down
        ${isSuccess ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600' : 'bg-gradient-to-br from-slate-600 to-slate-800'}
      `}
      role="alert"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {isSuccess ? <TrophyIcon className="h-6 w-6" /> : <StopwatchIcon />}
        </div>
        <div className="ml-3">
          <p className="font-bold text-lg">{isSuccess ? 'Challenge Complete!' : 'Challenge Failed'}</p>
          <p className="text-sm font-semibold">{name}</p>
          {isSuccess && rewardDescription && (
            <p className="text-sm mt-1">Reward: {rewardDescription}</p>
          )}
        </div>
        <button onClick={onClose} className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-full hover:bg-white/20 transition-colors" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </div>
  );
};

export default ChallengeToast;
