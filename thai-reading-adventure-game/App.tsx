
import React, { useState, useEffect, useCallback } from 'react';
import { ScreenType, Player, World, Level, PlayerProgress } from './types';
// WORLDS_DATA is now a fallback
import { INITIAL_PLAYER_NAME } from './constants';
import { loadPlayerData, savePlayerData } from './services/playerService';
import { loadWorldsData, saveWorldsData } from './services/worldService';
import Header from './components/Header';
import PlayerInfoBar from './components/PlayerInfoBar';
import WorldSelectionScreen from './components/WorldSelectionScreen';
import LevelSelectionScreen from './components/LevelSelectionScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import LevelCreationScreen from './components/LevelCreationScreen';

const App: React.FC = () => {
  const [worldsData, setWorldsData] = useState<World[]>(loadWorldsData());
  const [player, setPlayer] = useState<Player>(() => loadPlayerData(worldsData)); 
  
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(ScreenType.WORLD_SELECTION);
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number | null>(null);
  const [lastGameResult, setLastGameResult] = useState<{ isWin: boolean; starsEarned: number; coinsEarned: number } | null>(null);
  const [levelCreationEntryPoint, setLevelCreationEntryPoint] = useState<'world_selection' | 'level_selection' | null>(null);

  useEffect(() => {
    savePlayerData(player);
  }, [player]);

  useEffect(() => {
    saveWorldsData(worldsData);
    setPlayer(prevPlayer => {
      const newProgress: PlayerProgress = {};
      worldsData.forEach(world => {
        const existingWorldProgress = prevPlayer.progress[world.id] || [];
        const newWorldLevelsCount = world.levels.length;
        const currentWorldProgress = Array(newWorldLevelsCount).fill(0);

        for (let i = 0; i < Math.min(existingWorldProgress.length, newWorldLevelsCount); i++) {
          currentWorldProgress[i] = existingWorldProgress[i];
        }
        newProgress[world.id] = currentWorldProgress;
      });
      return { ...prevPlayer, progress: newProgress };
    });
  }, [worldsData]);

  const navigateTo = (screen: ScreenType) => {
    setCurrentScreen(screen);
  };

  const handlePlayerNameChange = useCallback((newName: string) => {
    setPlayer(prevPlayer => ({ ...prevPlayer, name: newName }));
  }, []);

  const handleWorldSelect = useCallback((worldId: string) => {
    const world = worldsData.find(w => w.id === worldId);
    if (world) {
      setSelectedWorld(world);
      navigateTo(ScreenType.LEVEL_SELECTION);
    }
  }, [worldsData]);

  const handleLevelSelect = useCallback((levelIndex: number) => {
    setCurrentLevelIndex(levelIndex);
    navigateTo(ScreenType.GAME);
  }, []);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (selectedWorld && currentLevelIndex !== null) {
      let starsEarned = 0;
      if (isCorrect) {
        starsEarned = 3; 
      } else {
        starsEarned = 1; 
      }
      const coinsEarned = starsEarned * 10;

      setPlayer(prevPlayer => {
        const newProgress = { ...prevPlayer.progress };
        const worldProgress = [...(newProgress[selectedWorld.id] || Array(selectedWorld.levels.length).fill(0))];
        
        const oldStars = worldProgress[currentLevelIndex] || 0;
        const netStarGain = starsEarned > oldStars ? starsEarned - oldStars : 0;

        worldProgress[currentLevelIndex] = Math.max(oldStars, starsEarned);
        newProgress[selectedWorld.id] = worldProgress;
        
        return {
          ...prevPlayer,
          stars: prevPlayer.stars + netStarGain,
          coins: prevPlayer.coins + (netStarGain > 0 || (starsEarned > 0 && oldStars === 0) ? coinsEarned : 0),
          progress: newProgress,
        };
      });
      
      setLastGameResult({ isWin: isCorrect, starsEarned, coinsEarned });
      navigateTo(ScreenType.RESULT);
    }
  }, [selectedWorld, currentLevelIndex]);

  const handleNextLevel = useCallback(() => {
    if (selectedWorld && currentLevelIndex !== null) {
      const nextLevelIndex = currentLevelIndex + 1;
      if (nextLevelIndex < selectedWorld.levels.length) {
        setCurrentLevelIndex(nextLevelIndex);
        navigateTo(ScreenType.GAME);
      } else {
        navigateTo(ScreenType.LEVEL_SELECTION); // Back to level selection if last level in world
      }
    }
  }, [selectedWorld, currentLevelIndex]);

  const handleBackToLevels = useCallback(() => {
    // This function assumes selectedWorld is set, which is true if coming from Game or Result screen
    if (selectedWorld) {
        navigateTo(ScreenType.LEVEL_SELECTION);
    } else {
        // Fallback to worlds if no world context (should ideally not happen from game/result)
        navigateTo(ScreenType.WORLD_SELECTION);
    }
  }, [selectedWorld]);

  const handleBackToWorlds = useCallback(() => {
    setSelectedWorld(null);
    setCurrentLevelIndex(null);
    navigateTo(ScreenType.WORLD_SELECTION);
  }, []);
  
  const handleBackToLevelSelectionFromGame = useCallback(() => {
    if (selectedWorld) {
        navigateTo(ScreenType.LEVEL_SELECTION);
    } else {
        handleBackToWorlds(); // Fallback if selectedWorld is somehow null
    }
  }, [selectedWorld, handleBackToWorlds]);

  const navigateToLevelCreation = useCallback((contextWorldId?: string) => {
    if (contextWorldId) {
        const world = worldsData.find(w => w.id === contextWorldId);
        if (world) {
            setSelectedWorld(world); 
            setLevelCreationEntryPoint('level_selection');
        } else { 
            console.error("Attempted to navigate to level creation with invalid worldId:", contextWorldId);
            return; 
        }
    } else {
        setSelectedWorld(null); 
        setLevelCreationEntryPoint('world_selection');
    }
    navigateTo(ScreenType.LEVEL_CREATION);
  }, [worldsData]);

  const handleBackFromLevelCreation = useCallback(() => {
    if (levelCreationEntryPoint === 'level_selection' && selectedWorld) {
        navigateTo(ScreenType.LEVEL_SELECTION); // selectedWorld should be the context world
    } else {
        setSelectedWorld(null);
        navigateTo(ScreenType.WORLD_SELECTION);
    }
    setLevelCreationEntryPoint(null); 
  }, [levelCreationEntryPoint, selectedWorld]);


  const handleAddLevel = useCallback((newLevel: Level, worldIdToAddLevelTo: string) => {
    setWorldsData(prevWorldsData => {
      const updatedWorldsData = prevWorldsData.map(world => {
        if (world.id === worldIdToAddLevelTo) {
          return { ...world, levels: [...world.levels, newLevel] };
        }
        return world;
      });
      return updatedWorldsData;
    });
    
    // After adding, navigate to the level selection of the world where the level was added.
    const updatedWorld = worldsData.find(w => w.id === worldIdToAddLevelTo) || 
                         loadWorldsData().find(w => w.id === worldIdToAddLevelTo); // Ensure we get the latest
    if (updatedWorld) {
        setSelectedWorld(updatedWorld); // Set for LevelSelectionScreen
        navigateTo(ScreenType.LEVEL_SELECTION);
    } else {
        handleBackToWorlds(); // Fallback
    }
    setLevelCreationEntryPoint(null); // Reset entry point
  }, [worldsData, handleBackToWorlds]);


  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenType.WORLD_SELECTION:
        return (
            <WorldSelectionScreen 
                worlds={worldsData} 
                onWorldSelect={handleWorldSelect} 
                onCreateNewLevelGlobal={() => navigateToLevelCreation()}
            />
        );
      case ScreenType.LEVEL_SELECTION:
        if (selectedWorld) {
          return (
            <LevelSelectionScreen
              world={selectedWorld}
              playerProgress={player.progress[selectedWorld.id] || []}
              onLevelSelect={handleLevelSelect}
              onBackToWorlds={handleBackToWorlds}
              onCreateLevel={() => navigateToLevelCreation(selectedWorld.id)}
            />
          );
        }
        // If selectedWorld is null, redirect to world selection (should not happen if navigation is correct)
        handleBackToWorlds();
        return null;
      case ScreenType.GAME:
        if (selectedWorld && currentLevelIndex !== null) {
          const level = selectedWorld.levels[currentLevelIndex];
          if (level) {
            return (
              <GameScreen 
                level={level} 
                onAnswer={handleAnswer} 
                onBack={handleBackToLevelSelectionFromGame} 
              />
            );
          }
        }
         // If data is missing, redirect
        handleBackToWorlds();
        return null; 
      case ScreenType.RESULT:
        if (lastGameResult && selectedWorld && currentLevelIndex !== null) {
          const hasNextLevel = currentLevelIndex < selectedWorld.levels.length - 1;
          return (
            <ResultScreen
              isWin={lastGameResult.isWin}
              starsEarned={lastGameResult.starsEarned}
              coinsEarned={lastGameResult.coinsEarned}
              onNextLevel={handleNextLevel}
              onBackToLevels={handleBackToLevels}
              hasNextLevel={hasNextLevel}
            />
          );
        }
         // If data is missing, redirect
        handleBackToWorlds();
        return null;
      case ScreenType.LEVEL_CREATION:
        return (
          <LevelCreationScreen
            worlds={worldsData}
            // Pass the ID of the world if we are creating a level for a specific world.
            // This tells LevelCreationScreen to pre-select and disable the world dropdown.
            currentSelectedWorldId={levelCreationEntryPoint === 'level_selection' ? selectedWorld?.id : undefined}
            onAddLevel={handleAddLevel}
            onBack={handleBackFromLevelCreation} 
            allWorldsData={worldsData}
          />
        );
      default:
        return <WorldSelectionScreen worlds={worldsData} onWorldSelect={handleWorldSelect} onCreateNewLevelGlobal={() => navigateToLevelCreation()} />;
    }
  };
  
  const showHomeButton = currentScreen !== ScreenType.WORLD_SELECTION;

  return (
    <div className="bg-gradient-to-br from-[#4facfe] to-[#00f2fe] min-h-screen flex justify-center items-center p-4 font-['Kanit'] text-[#073b4c]">
      <div className="w-full max-w-[800px] bg-white/98 rounded-[25px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col">
        <Header 
            title="อ่านอ๊าน อ่านอาน!" 
            onHomeClick={showHomeButton ? handleBackToWorlds : undefined}
        />
        <PlayerInfoBar 
          name={player.name} 
          stars={player.stars} 
          coins={player.coins}
          onNameChange={handlePlayerNameChange} 
        />
        <main className="p-4 sm:p-6 bg-[#f0f8ff] min-h-[450px] relative">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
};

export default App;
