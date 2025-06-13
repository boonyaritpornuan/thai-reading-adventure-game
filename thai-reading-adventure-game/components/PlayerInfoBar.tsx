import React, { useState, useEffect } from 'react';

interface PlayerInfoBarProps {
  name: string;
  stars: number;
  coins: number;
  onNameChange: (newName: string) => void;
}

const PlayerStat: React.FC<{ iconClass: string; value: string | number; label?: string }> = ({ iconClass, value, label }) => (
  <div className="flex items-center gap-2 text-[1rem] md:text-[1.1rem] text-[#073b4c]">
    <i className={`${iconClass} text-[#ffd166]`} aria-hidden="true"></i>
    <span>{label && `${label}: `}{value}</span>
  </div>
);

const PlayerInfoBar: React.FC<PlayerInfoBarProps> = ({ name, stars, coins, onNameChange }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editableName, setEditableName] = useState(name);

  useEffect(() => {
    setEditableName(name); // Sync with prop changes, e.g., initial load
  }, [name]);

  const handleNameSave = () => {
    if (editableName.trim() && editableName.trim() !== name) {
      onNameChange(editableName.trim());
    }
    setIsEditingName(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleNameSave();
    } else if (event.key === 'Escape') {
      setEditableName(name); // Revert to original name
      setIsEditingName(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-around items-center p-3 bg-white border-b-2 border-gray-100 font-semibold gap-2 sm:gap-4">
      <div className="flex items-center gap-2 text-[1rem] md:text-[1.1rem] text-[#073b4c]">
        <i className="fas fa-user text-[#ffd166]" aria-hidden="true"></i>
        {isEditingName ? (
          <input
            type="text"
            value={editableName}
            onChange={(e) => setEditableName(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={handleKeyPress}
            className="border-b-2 border-[#4facfe] focus:outline-none px-1 py-0.5 font-semibold"
            autoFocus
            aria-label="Edit player name"
          />
        ) : (
          <>
            <span>{name}</span>
            <button 
              onClick={() => setIsEditingName(true)} 
              className="ml-2 text-sm text-[#4facfe] hover:text-[#007bff]"
              aria-label="Edit name"
            >
              <i className="fas fa-pencil-alt"></i>
            </button>
          </>
        )}
      </div>
      <PlayerStat iconClass="fas fa-star" value={stars} />
      <PlayerStat iconClass="fas fa-coins" value={coins} />
    </div>
  );
};

export default PlayerInfoBar;