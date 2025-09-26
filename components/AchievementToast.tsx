import React, { useEffect } from 'react';

interface AchievementToastProps {
  name: string;
  // FIX: Updated the icon prop type to be a more specific ReactElement (`React.ReactElement<{ className?: string }>`) to resolve the overload error with `React.cloneElement`.
  icon: React.ReactElement<{ className?: string }>;
  onClose: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ name, icon, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // 5 seconds visibility
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs p-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow-2xl animate-slide-in-down"
      role="alert"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 text-white">
          {/* FIX: Removed type assertion for `icon` as its type is now correctly defined in props, fixing the overload error. */}
          {React.cloneElement(icon, { className: 'h-8 w-8' })}
        </div>
        <div className="ml-3">
          <p className="font-bold text-lg">Achievement Unlocked!</p>
          <p className="text-sm font-semibold">{name}</p>
        </div>
        <button onClick={onClose} className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-full hover:bg-white/20 transition-colors" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </div>
  );
};

export default AchievementToast;