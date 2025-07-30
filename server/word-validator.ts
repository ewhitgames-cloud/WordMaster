import OpenAI from "openai";
import { getAllExpandedWords } from './word-expander';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
let openai: OpenAI | null = null;
let expandedWordsCache: Set<string> | null = null;
let expandedWordsCacheTime = 0;
const EXPANDED_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function getOpenAIClient(): OpenAI | null {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

async function getExpandedWordsSet(): Promise<Set<string>> {
  const now = Date.now();
  
  // Use cached expanded words if available and fresh
  if (expandedWordsCache && (now - expandedWordsCacheTime) < EXPANDED_CACHE_DURATION) {
    return expandedWordsCache;
  }
  
  try {
    console.log('Generating expanded word library from OpenAI...');
    const expandedWords = await getAllExpandedWords();
    expandedWordsCache = new Set(expandedWords);
    expandedWordsCacheTime = now;
    console.log(`Cached ${expandedWords.length} expanded words from OpenAI`);
    return expandedWordsCache;
  } catch (error) {
    console.error('Failed to get expanded words, using existing cache or empty set:', error);
    return expandedWordsCache || new Set();
  }
}

// Cache for validated words to avoid repeated API calls
const validatedWords = new Map<string, CacheEntry>();
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  isValid: boolean;
  timestamp: number;
}

export async function validateWordWithOpenAI(word: string): Promise<boolean> {
  const upperWord = word.toUpperCase();
  
  // Check cache first
  const cached = validatedWords.get(upperWord);
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
    return cached.isValid;
  }

  const client = getOpenAIClient();
  if (!client) {
    console.log('OpenAI not available for word validation, using fallback');
    return false;
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a word validator for a Wordle game. Respond with ONLY 'true' or 'false' to indicate if the given word is a valid 5-letter English word found in standard dictionaries. No proper nouns, abbreviations, or slang words."
        },
        {
          role: "user",
          content: `Is "${upperWord}" a valid 5-letter English word?`
        }
      ],
      temperature: 0,
      max_tokens: 10
    });

    const result = response.choices[0].message.content?.toLowerCase().trim();
    const isValid = result === 'true';

    // Cache the result
    validatedWords.set(upperWord, {
      isValid,
      timestamp: Date.now()
    } as CacheEntry);

    return isValid;
  } catch (error) {
    console.error('Error validating word with OpenAI:', error);
    return false;
  }
}

export async function validateWordExpanded(word: string, fallbackDictionary: Set<string>): Promise<boolean> {
  const upperWord = word.toUpperCase();
  
  // First check built-in dictionary for speed
  if (fallbackDictionary.has(upperWord)) {
    return true;
  }

  // Check common word patterns and return true for likely valid words if OpenAI is unavailable
  if (!process.env.OPENAI_API_KEY) {
    return isLikelyValidWord(upperWord);
  }

  try {
    // Then check with OpenAI for expanded validation
    return await validateWordWithOpenAI(upperWord);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log('OpenAI validation failed, using fallback validation:', errorMessage);
    // Fallback to pattern-based validation if OpenAI fails
    return isLikelyValidWord(upperWord);
  }
}

// Fallback validation for common word patterns
function isLikelyValidWord(word: string): boolean {
  // Basic validation: must be 5 letters, all alphabetic
  if (word.length !== 5 || !/^[A-Z]+$/.test(word)) {
    return false;
  }

  // Reject obvious non-words (too many repeated letters, etc.)
  const letterCounts = word.split('').reduce((acc, letter) => {
    acc[letter] = (acc[letter] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Reject if any letter appears more than 3 times
  if (Object.values(letterCounts).some(count => count > 3)) {
    return false;
  }

  // Common 5-letter word patterns and endings that are likely valid
  const commonEndings = ['ING', 'ION', 'TION', 'ED', 'ER', 'EST', 'LY', 'AL', 'IC', 'ABLE', 'IBLE'];
  const commonPrefixes = ['UN', 'RE', 'IN', 'DIS', 'EN', 'NON', 'PRE', 'SUB', 'OVER', 'OUT'];
  
  // Check for common patterns
  const hasCommonEnding = commonEndings.some(ending => word.endsWith(ending.slice(-Math.min(ending.length, 3))));
  const hasCommonPrefix = commonPrefixes.some(prefix => word.startsWith(prefix.slice(0, Math.min(prefix.length, 2))));
  
  // Accept words with common patterns or that look like real words
  return hasCommonEnding || hasCommonPrefix || hasReasonableLetterDistribution(word);
}

function hasReasonableLetterDistribution(word: string): boolean {
  // Check for reasonable vowel/consonant distribution
  const vowels = 'AEIOU';
  const vowelCount = word.split('').filter(letter => vowels.includes(letter)).length;
  const consonantCount = 5 - vowelCount;
  
  // Most English words have 1-3 vowels
  if (vowelCount < 1 || vowelCount > 4) return false;
  
  // Avoid words with too many consecutive consonants
  const consecutiveConsonants = word.match(/[BCDFGHJKLMNPQRSTVWXYZ]{4,}/);
  if (consecutiveConsonants) return false;
  
  return true;
}

// Batch validation for multiple words (useful for performance)
export async function validateWordsInBatch(words: string[]): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {};
  const client = getOpenAIClient();
  
  if (!client) {
    // Fallback to returning all false if no OpenAI
    words.forEach(word => results[word.toUpperCase()] = false);
    return results;
  }

  try {
    const wordList = words.map(w => w.toUpperCase()).join(', ');
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a word validator. For each word in the list, respond with JSON indicating if it's a valid 5-letter English dictionary word. Format: {\"WORD1\": true, \"WORD2\": false, ...}"
        },
        {
          role: "user",
          content: `Validate these 5-letter words: ${wordList}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Cache all results and return
    Object.entries(result).forEach(([word, isValid]) => {
      validatedWords.set(word as string, {
        isValid: isValid as boolean,
        timestamp: Date.now()
      } as CacheEntry);
      results[word as string] = isValid as boolean;
    });

    return results;
  } catch (error) {
    console.error('Error batch validating words:', error);
    words.forEach(word => results[word.toUpperCase()] = false);
    return results;
  }
}