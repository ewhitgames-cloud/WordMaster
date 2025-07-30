import { VALID_WORDS } from './words';
import { validateWordWithAPI } from './word-validation';

export type TileState = 'empty' | 'current' | 'correct' | 'present' | 'absent';
export type KeyState = 'default' | 'correct' | 'present' | 'absent';

export function isValidWord(word: string): boolean {
  return VALID_WORDS.has(word.toUpperCase());
}

export async function isValidWordExpanded(word: string): Promise<boolean> {
  // First try client-side validation for speed
  if (VALID_WORDS.has(word.toUpperCase())) {
    return true;
  }
  
  // Then try OpenAI validation for expanded word support
  return await validateWordWithAPI(word);
}

export function calculateScore(attempts: number, timeElapsed: number, challengeMode: boolean): number {
  // Base score starts at 1000 and decreases with attempts
  let score = Math.max(100, 1000 - (attempts - 1) * 150);
  
  if (challengeMode) {
    // Bonus for challenge mode
    score *= 1.5;
    
    // Time bonus (faster = more points)
    const timeBonus = Math.max(0, 180 - timeElapsed) * 2;
    score += timeBonus;
  }
  
  return Math.round(score);
}

export function getTileState(guess: string, target: string, position: number): TileState {
  if (guess[position] === target[position]) {
    return 'correct';
  } else if (target.includes(guess[position])) {
    return 'present';
  } else {
    return 'absent';
  }
}

export function getKeyboardState(guesses: string[], target: string): Record<string, KeyState> {
  const keyboardState: Record<string, KeyState> = {};
  
  guesses.forEach(guess => {
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      const tileState = getTileState(guess, target, i);
      
      // Convert TileState to KeyState
      let keyState: KeyState = 'default';
      if (tileState === 'correct') keyState = 'correct';
      else if (tileState === 'present') keyState = 'present';
      else if (tileState === 'absent') keyState = 'absent';
      
      // Only update if current state is better than existing
      if (!keyboardState[letter] || 
          (keyState === 'correct') ||
          (keyState === 'present' && keyboardState[letter] !== 'correct')) {
        keyboardState[letter] = keyState;
      }
    }
  });
  
  return keyboardState;
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
