import { apiRequest } from "./queryClient";

// Cache for validated words to avoid repeated API calls
const wordValidationCache = new Map<string, boolean>();

interface WordValidationResponse {
  word: string;
  isValid: boolean;
  source: 'built-in' | 'OpenAI';
  hasOpenAI: boolean;
}

/**
 * Validate a word using OpenAI + built-in dictionary with caching
 */
export async function validateWordWithAPI(word: string): Promise<boolean> {
  const upperWord = word.toUpperCase();
  
  // Check cache first
  if (wordValidationCache.has(upperWord)) {
    return wordValidationCache.get(upperWord)!;
  }

  try {
    const response = await apiRequest('POST', '/api/word/validate', { word: upperWord });
    const result: WordValidationResponse = await response.json();
    
    // Cache the result
    wordValidationCache.set(upperWord, result.isValid);
    
    return result.isValid;
  } catch (error) {
    console.error('Error validating word with API:', error);
    // Fallback to client-side validation if API fails
    return false;
  }
}

/**
 * Batch validate multiple words for better performance
 */
export async function validateWordsInBatch(words: string[]): Promise<Record<string, boolean>> {
  // Filter out already cached words
  const uncachedWords = words.filter(word => !wordValidationCache.has(word.toUpperCase()));
  const results: Record<string, boolean> = {};
  
  // Get cached results
  words.forEach(word => {
    const upperWord = word.toUpperCase();
    if (wordValidationCache.has(upperWord)) {
      results[upperWord] = wordValidationCache.get(upperWord)!;
    }
  });

  // If all words are cached, return immediately
  if (uncachedWords.length === 0) {
    return results;
  }

  try {
    const response = await apiRequest('POST', '/api/word/validate-batch', { words: uncachedWords });
    const batchResult = await response.json();
    
    // Cache and merge results
    Object.entries(batchResult.results).forEach(([word, isValid]) => {
      wordValidationCache.set(word, isValid as boolean);
      results[word] = isValid as boolean;
    });
    
    return results;
  } catch (error) {
    console.error('Error batch validating words:', error);
    // Return cached results and mark uncached as invalid
    uncachedWords.forEach(word => {
      results[word.toUpperCase()] = false;
    });
    return results;
  }
}

/**
 * Clear the validation cache (useful for testing or when needed)
 */
export function clearWordValidationCache(): void {
  wordValidationCache.clear();
}

/**
 * Get cache statistics
 */
export function getWordValidationCacheStats(): { size: number; validWords: number; invalidWords: number } {
  const validWords = Array.from(wordValidationCache.values()).filter(Boolean).length;
  const invalidWords = wordValidationCache.size - validWords;
  
  return {
    size: wordValidationCache.size,
    validWords,
    invalidWords
  };
}