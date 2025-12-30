import { LevelData, LevelProgress, SaveDataSchema } from '../types';

const STORAGE_KEY = 'chrono_connect_save_v2'; // Version bumped to reset "all unlocked" state
const CURRENT_VERSION = 1;

class StorageService {
  
  /**
   * Loads the user's progress and merges it with the current game definitions.
   * This ensures that if you add new levels to the code, they appear correctly
   * in the game state without breaking existing saves.
   */
  public loadProgress(allLevels: LevelData[]): LevelProgress[] {
    let saveData: SaveDataSchema = this.getEmptySave();

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Simple version check - can be expanded for migration logic later
        if (parsed.version === CURRENT_VERSION) {
          saveData = parsed;
        } else {
          // Placeholder for migration logic (e.g. v1 to v2)
          console.warn("Save version mismatch, resetting or migrating...");
          saveData = parsed; 
        }
      }
    } catch (e) {
      console.error("Failed to load save data", e);
    }

    // Hydration: Merge Code Definitions (Source of Truth for Structure) 
    // with Save Data (Source of Truth for User Status)
    const hydratedProgress: LevelProgress[] = allLevels.map((levelDef, index) => {
      const savedLevel = saveData.levels[levelDef.id];

      // If user has played this level, use their stats
      if (savedLevel) {
        return {
          levelId: levelDef.id,
          stars: savedLevel.stars,
          bestTime: savedLevel.bestTime,
          unlocked: savedLevel.unlocked
        };
      }

      // If this is a NEW level added by developer (not in save), create default state
      return {
        levelId: levelDef.id,
        stars: 0,
        bestTime: null,
        unlocked: index === 0 // Only the first level is unlocked by default
      };
    });

    // Ensure continuity logic remains
    // This double-checks that if you finished level N, N+1 is unlocked
    for (let i = 0; i < hydratedProgress.length - 1; i++) {
        if (hydratedProgress[i].stars > 0) {
            hydratedProgress[i+1].unlocked = true;
        }
    }

    return hydratedProgress;
  }

  /**
   * Saves the current list of progress back to local storage
   * optimized as a Map for O(1) lookups.
   */
  public saveProgress(progressList: LevelProgress[]) {
    const levelMap: Record<number, LevelProgress> = {};
    let lastPlayed = 1;

    progressList.forEach(p => {
      levelMap[p.levelId] = p;
      if (p.stars > 0) lastPlayed = p.levelId;
    });

    const payload: SaveDataSchema = {
      version: CURRENT_VERSION,
      lastPlayedLevelId: lastPlayed,
      levels: levelMap
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  }

  private getEmptySave(): SaveDataSchema {
    return {
      version: CURRENT_VERSION,
      lastPlayedLevelId: 1,
      levels: {}
    };
  }
}

export const storageService = new StorageService();