
import React, { useState, useEffect } from 'react';
import Button from './Button'; // Corrected import path

interface ResultScreenProps {
  isWin: boolean;
  starsEarned: number;
  coinsEarned: number;
  onNextLevel: () => void;
  onBackToLevels: () => void;
  hasNextLevel: boolean;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ isWin, starsEarned, coinsEarned, onNextLevel, onBackToLevels, hasNextLevel }) => {
  const [animatedStars, setAnimatedStars] = useState(0);

  useEffect(() => {
    setAnimatedStars(0); // Reset for animation
    if (starsEarned > 0) {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setAnimatedStars(current => current + 1);
        if (count >= starsEarned) {
          clearInterval(interval);
        }
      }, 300); // Stagger star animation
      return () => clearInterval(interval);
    }
  }, [starsEarned]);

  const resultIconClass = isWin ? "fas fa-trophy text-[#ffd166]" : "fas fa-lightbulb text-[#4facfe]";
  const resultTitleText = isWin ? "เยี่ยมมาก!" : "พยายามอีกนิดนะ!";

  return (
    <div className="text-center flex flex-col items-center justify-center h-full">
      <div className={`text-7xl mb-5 ${isWin ? 'animate-bounce' : ''}`}>
        <i className={resultIconClass} aria-hidden="true"></i>
      </div>
      <h2 className="text-[2rem] md:text-[2.2rem] font-bold mb-3 text-[#073b4c]">{resultTitleText}</h2>
      
      <div className="flex justify-center gap-2 sm:gap-4 my-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <i
            key={i}
            className={`fas fa-star text-5xl sm:text-6xl transition-all duration-500 ease-out ${i < animatedStars ? 'text-[#ffd166] scale-110' : 'text-gray-300'}`}
            style={{ transform: i < animatedStars ? 'scale(1.1)' : 'scale(1)'}} // Simplified pop
            aria-hidden="true"
          ></i>
        ))}
      </div>
      
      <p className="text-[1.2rem] mb-8 text-[#073b4c]">{`ได้รับ ${coinsEarned} เหรียญ`}</p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {hasNextLevel && isWin && (
          <Button onClick={onNextLevel} variant="secondary" iconClass="fas fa-arrow-right">
            ด่านต่อไป
          </Button>
        )}
         <Button onClick={onBackToLevels} variant="primary" iconClass="fas fa-list">
          กลับไปเลือกด่าน
        </Button>
      </div>
    </div>
  );
};

export default ResultScreen;
