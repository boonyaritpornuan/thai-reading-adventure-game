
export enum ScreenType {
  WORLD_SELECTION = 'world-selection',
  LEVEL_SELECTION = 'level-selection',
  GAME = 'game-screen',
  RESULT = 'result-screen',
  LEVEL_CREATION = 'level-creation',
}

export interface World {
  id: string;
  name: string;
  icon: string; // Font Awesome icon name (without 'fa-')
  color: string; // For card border/icon color
  levels: Level[]; // Levels are mandatory once a world is defined
  locked?: boolean; // Optional: if worlds can be locked
}

export interface Level {
  type: string; // e.g., 'match_image_word', 'sentence_from_image'
  question: string;
  image?: string;
  passage?: string; // Added to support passage comprehension
  options: string[];
  answer: string;
}

export interface PlayerProgress {
  [worldId: string]: number[]; // Array of stars for each level
}

export interface Player {
  name: string;
  stars: number;
  coins: number;
  progress: PlayerProgress;
}
