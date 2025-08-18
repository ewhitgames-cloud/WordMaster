import { isOfficialWordleWord } from '@shared/official-wordle-words';

export type TileState = 'empty' | 'current' | 'correct' | 'present' | 'absent';
export type KeyState = 'default' | 'correct' | 'present' | 'absent';

export function isValidWord(word: string): boolean {
  return isOfficialWordleWord(word.toUpperCase());
}

export async function isValidWordExpanded(word: string): Promise<boolean> {
  // Use official Wordle word validation
  return isOfficialWordleWord(word.toUpperCase());
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
  // Normalize both to uppercase for comparison
  const normalizedGuess = guess.toUpperCase();
  const normalizedTarget = target.toUpperCase();
  const guessLetter = normalizedGuess[position];
  const targetLetter = normalizedTarget[position];
  
  // If the letter is in the correct position
  if (guessLetter === targetLetter) {
    return 'correct';
  }
  
  // Check if the letter exists in the target word at all
  if (!normalizedTarget.includes(guessLetter)) {
    return 'absent';
  }
  
  // For letters that exist in target but are in wrong position,
  // we need to check if there are available instances
  
  // Count total occurrences of this letter in target
  const targetCount = normalizedTarget.split('').filter(letter => letter === guessLetter).length;
  
  // Count how many of this letter are already correctly placed in the guess
  let correctlyPlaced = 0;
  for (let i = 0; i < normalizedGuess.length; i++) {
    if (normalizedGuess[i] === guessLetter && normalizedTarget[i] === guessLetter) {
      correctlyPlaced++;
    }
  }
  
  // Count how many of this letter appear before current position in wrong positions
  let wrongPositionsBefore = 0;
  for (let i = 0; i < position; i++) {
    if (normalizedGuess[i] === guessLetter && normalizedTarget[i] !== guessLetter) {
      wrongPositionsBefore++;
    }
  }
  
  // If we have available instances after accounting for correct placements and previous wrong positions
  const availableInstances = targetCount - correctlyPlaced;
  if (wrongPositionsBefore < availableInstances) {
    return 'present';
  }
  
  return 'absent';
}

export function getKeyboardState(guesses: string[], target: string): Record<string, KeyState> {
  // Normalize target to uppercase for consistency
  const normalizedTarget = target.toUpperCase();
  const keyboardState: Record<string, KeyState> = {};
  
  guesses.forEach(guess => {
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      const tileState = getTileState(guess, normalizedTarget, i);
      
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
