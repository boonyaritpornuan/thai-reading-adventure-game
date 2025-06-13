
import React from 'react';
import { World } from '../types';
import WorldCard from './WorldCard';
import Button from './Button';

interface WorldSelectionScreenProps {
  worlds: World[];
  onWorldSelect: (worldId: string) => void;
  onCreateNewLevelGlobal: () => void; // New prop for global level creation
}

const WorldSelectionScreen: React.FC<WorldSelectionScreenProps> = ({ worlds, onWorldSelect, onCreateNewLevelGlobal }) => {
  return (
    <div>
      <h2 className="text-[1.8rem] text-center text-[#073b4c] mb-6 font-semibold">เลือกดินแดนการเรียนรู้</h2>
      {worlds && worlds.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {worlds.map(world => (
            <WorldCard key={world.id} world={world} onClick={() => onWorldSelect(world.id)} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 my-8">ยังไม่มีดินแดนให้เลือก ลองสร้างด่านใหม่ดูสิ!</p>
      )}
      <div className="mt-8 flex justify-center">
        <Button onClick={onCreateNewLevelGlobal} variant="secondary" iconClass="fas fa-plus-square">
          สร้างด่านใหม่ (เลือกดินแดนเอง)
        </Button>
      </div>
    </div>
  );
};

export default WorldSelectionScreen;
