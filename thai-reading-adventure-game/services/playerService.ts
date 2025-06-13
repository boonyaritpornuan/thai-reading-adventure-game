
import { Player, PlayerProgress, World } from '../types';
import { INITIAL_PLAYER_DATA as DEFAULT_INITIAL_PLAYER_DATA } from '../constants'; // Renamed

const PLAYER_DATA_KEY = 'readingGamePlayerAanAan';

// Helper to initialize progress based on current worlds data
const initializePlayerProgressFromWorlds = (worlds: World[]): PlayerProgress => {
  const progress: PlayerProgress = {};
  worlds.forEach(world => {
    progress[world.id] = Array(world.levels.length).fill(0);
  });
  return progress;
};

export const loadPlayerData = (currentWorldsData: World[]): Player => {
  const savedData = localStorage.getItem(PLAYER_DATA_KEY);
  let playerToReturn: Player;

  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData) as Player;
      // Ensure progress structure is up-to-date with current game data
      let progressNeedsUpdate = false;
      const newProgress: PlayerProgress = { ...parsedData.progress };

      currentWorldsData.forEach(world => {
        const worldLevelCount = world.levels.length;
        if (!newProgress[world.id] || newProgress[world.id].length !== worldLevelCount) {
          // If world exists in progress but level count differs, adjust it
          const existingLevelProgress = newProgress[world.id] || [];
          const updatedLevelProgress = Array(worldLevelCount).fill(0);
          for(let i = 0; i < Math.min(existingLevelProgress.length, worldLevelCount); i++) {
            updatedLevelProgress[i] = existingLevelProgress[i];
          }
          newProgress[world.id] = updatedLevelProgress;
          progressNeedsUpdate = true;
        }
      });
      
      // Check for worlds in progress that no longer exist in currentWorldsData (optional cleanup)
      Object.keys(newProgress).forEach(worldIdInProgress => {
        if (!currentWorldsData.find(w => w.id === worldIdInProgress)) {
          delete newProgress[worldIdInProgress];
          progressNeedsUpdate = true;
        }
      });

      playerToReturn = { ...parsedData, progress: newProgress };
      
      if(progressNeedsUpdate) {
          // Re-save if structure was updated to ensure consistency with currentWorldsData.
          savePlayerData(playerToReturn); 
      }
      return playerToReturn;

    } catch (error) {
      console.error("Error parsing player data from localStorage:", error);
      // Fallback to default if parsing fails
      const initialProgress = initializePlayerProgressFromWorlds(currentWorldsData);
      playerToReturn = { ...DEFAULT_INITIAL_PLAYER_DATA, progress: initialProgress };
    }
  } else {
    const initialProgress = initializePlayerProgressFromWorlds(currentWorldsData);
    playerToReturn = { ...DEFAULT_INITIAL_PLAYER_DATA, progress: initialProgress };
  }
  return playerToReturn;
};

export const savePlayerData = (player: Player): void => {
  try {
    localStorage.setItem(PLAYER_DATA_KEY, JSON.stringify(player));
  } catch (error) {
    console.error("Error saving player data to localStorage:", error);
  }
};
