
import React from 'react';
import { World } from '../types';
import LevelCard from './LevelCard';
import Button from './Button'; 

interface LevelSelectionScreenProps {
  world: World;
  playerProgress: number[]; 
  onLevelSelect: (levelIndex: number) => void;
  onBackToWorlds: () => void;
  onCreateLevel: () => void; // New prop for creating a level
}

const LevelSelectionScreen: React.FC<LevelSelectionScreenProps> = ({ world, playerProgress, onLevelSelect, onBackToWorlds, onCreateLevel }) => {
  return (
    <div>
      <h2 className="text-[1.8rem] text-center text-[#073b4c] mb-6 font-semibold" style={{ color: world.color }}>
        {world.name}
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 justify-center">
        {world.levels.map((level, index) => {
          const stars = playerProgress[index] || 0;
          // Unlock logic: first level always unlocked, or if previous level has stars
          const isLocked = index > 0 && (!playerProgress[index - 1] || playerProgress[index - 1] === 0);
          return (
            <LevelCard
              key={index}
              levelIndex={index}
              stars={stars}
              isLocked={isLocked}
              onClick={() => onLevelSelect(index)}
              worldColor={world.color}
            />
          );
        })}
      </div>
      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <Button onClick={onBackToWorlds} variant="primary" iconClass="fas fa-map">
          กลับไปเลือกดินแดน
        </Button>
        <Button onClick={onCreateLevel} variant="secondary" iconClass="fas fa-plus-circle">
          สร้างด่านใหม่ในดินแดนนี้
        </Button>
      </div>
    </div>
  );
};

export default LevelSelectionScreen;
