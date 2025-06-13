
import React from 'react';
import { World } from '../types';

interface WorldCardProps {
  world: World;
  onClick: () => void;
}

const WorldCard: React.FC<WorldCardProps> = ({ world, onClick }) => {
  return (
    <div
      className="bg-white rounded-[15px] p-5 text-center cursor-pointer shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out hover:transform hover:-translate-y-2 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
      style={{ borderBottom: `5px solid ${world.color}` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
    >
      <i className={`fas fa-${world.icon} text-5xl mb-3`} style={{ color: world.color }} aria-hidden="true"></i>
      <div className="text-[1.1rem] font-semibold text-[#073b4c]">{world.name}</div>
    </div>
  );
};

export default WorldCard;
