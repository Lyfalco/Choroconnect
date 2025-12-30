
import { GamePieceInstance, Rotation } from '../types';

export class ConnectionValidator {
  
  /**
   * Checks if the sequence of pieces is chronologically correct.
   * Logic: 
   * 1. Iterate through the current list.
   * 2. Check if the piece at index i matches the correctIndex i.
   * 3. Check if the piece is upright (rotation % 360 === 0).
   */
  static validateSequence(pieces: GamePieceInstance[]): boolean {
    if (pieces.length === 0) return false;

    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      
      // Check order
      if (piece.correctIndex !== i) {
        return false;
      }

      // Check orientation (using modulo because rotation allows > 360)
      if (Math.abs(piece.currentRotation) % 360 !== 0) {
        return false;
      }
    }

    return true;
  }

  /**
   * Checks if two specific adjacent pieces are connected correctly.
   * Used for visual feedback (drawing lines between valid pairs).
   */
  static areConnected(leftPiece: GamePieceInstance, rightPiece: GamePieceInstance): boolean {
    // Must be in correct relative order (e.g., 0 then 1) AND upright
    const indexDiff = rightPiece.correctIndex - leftPiece.correctIndex;
    return indexDiff === 1 && 
           Math.abs(leftPiece.currentRotation) % 360 === 0 && 
           Math.abs(rightPiece.currentRotation) % 360 === 0;
  }
}

/**
 * Shuffles an array and applies random rotations (0, 90, 180, 270)
 */
export const scrambleLevel = (piecesData: any[]): GamePieceInstance[] => {
  const instances: GamePieceInstance[] = piecesData.map(p => ({
    ...p,
    instanceId: Math.random().toString(36).substr(2, 9),
    currentRotation: getRandomRotation()
  }));

  // Fisher-Yates Shuffle
  for (let i = instances.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [instances[i], instances[j]] = [instances[j], instances[i]];
  }

  return instances;
};

const getRandomRotation = (): Rotation => {
  // Use simple base rotations for start, user will increase them
  const rots: Rotation[] = [0, 90, 180, 270];
  return rots[Math.floor(Math.random() * rots.length)];
};

/**
 * Generic array shuffle (Fisher-Yates)
 * Used for shuffling the level order itself.
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};