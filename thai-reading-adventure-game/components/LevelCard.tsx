
import React from 'react';

interface LevelCardProps {
  levelIndex: number;
  stars: number;
  isLocked: boolean;
  onClick: () => void;
  worldColor: string;
}

const LevelCard: React.FC<LevelCardProps> = ({ levelIndex, stars, isLocked, onClick, worldColor }) => {
  let cardClasses = "w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-full flex items-center justify-center text-[1.6rem] sm:text-[1.8rem] font-bold shadow-[0_4px_8px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out";

  if (isLocked) {
    cardClasses += " bg-gray-300 text-gray-500 cursor-not-allowed";
  } else if (stars > 0) {
    cardClasses += ` text-white cursor-pointer hover:scale-110`; // bg-gradient-to-br from-[#06d6a0] to-[#5ddea8]
    // Using worldColor for completed levels:
    cardClasses += ` bg-[${worldColor}]`;
  } else {
    cardClasses += " bg-white text-[#073b4c] cursor-pointer hover:scale-110 hover:bg-gray-100";
  }

  return (
    <div
      className={cardClasses}
      onClick={!isLocked ? onClick : undefined}
      role={!isLocked ? "button" : undefined}
      tabIndex={!isLocked ? 0 : undefined}
      onKeyPress={!isLocked ? (e) => e.key === 'Enter' && onClick() : undefined}
      aria-label={`ด่าน ${levelIndex + 1}${isLocked ? ' (ล็อกอยู่)' : ''}${stars > 0 ? ` (ได้ ${stars} ดาว)` : ''}`}
    >
      {isLocked ? (
        <i className="fas fa-lock text-2xl" aria-hidden="true"></i>
      ) : stars > 0 ? (
        <div className="flex flex-col items-center">
           <span className="text-sm -mb-1">{levelIndex + 1}</span>
           <div className="flex">
            {Array.from({ length: stars }).map((_, i) => (
              <i key={i} className="fas fa-star text-yellow-400 text-xs" />
            ))}
           </div>
        </div>
      ) : (
        <span>{levelIndex + 1}</span>
      )}
    </div>
  );
};

export default LevelCard;
