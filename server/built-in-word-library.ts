// Import comprehensive word dictionary
import { ANSWER_WORDS, getRandomAnswerWord, VALID_GUESS_WORD_SET, THEMED_WORDS, getThemedWord } from '@shared/comprehensive-word-list';

// Export functions that use the comprehensive word list
export function getAllBuiltInWords(): string[] {
  return ANSWER_WORDS;
}

export function getWordsByDifficulty(difficulty: 'common' | 'intermediate' | 'advanced'): string[] {
  // Return different slices of the answer words based on difficulty
  if (difficulty === 'common') {
    return ANSWER_WORDS.slice(0, 150);
  } else if (difficulty === 'intermediate') {
    return ANSWER_WORDS.slice(150, 300);
  } else {
    return ANSWER_WORDS.slice(300);
  }
}

export function getWordsByCategory(category: keyof typeof THEMED_WORDS): string[] {
  return THEMED_WORDS[category];
}

export function getRandomExpandedWord(): string {
  return getRandomAnswerWord();
}

// Check if word is valid guess
export function isValidBuiltInWord(word: string): boolean {
  return VALID_GUESS_WORD_SET.has(word.toUpperCase());
}