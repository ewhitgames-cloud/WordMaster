import { generateWords, generateDailyChallengeWords, generateWordsByCategory } from './openai-words';
import { getRandomAnswerWord, getThemedWord, ANSWER_WORDS } from '@shared/comprehensive-word-list';

// Enhanced word categories with larger sets
const ENHANCED_WORD_CATEGORIES = {
  nature: ['OCEAN', 'RIVER', 'BEACH', 'FIELD', 'PLANT', 'STONE', 'CLOUD', 'STORM', 'WOODS', 'GRASS', 'WATER', 'EARTH', 'WINDS', 'WAVES', 'BLOOM', 'FRESH', 'SUNNY'],
  emotions: ['HAPPY', 'BRAVE', 'PROUD', 'LOVED', 'EAGER', 'MERRY', 'SWEET', 'SMILE', 'PEACE', 'GRACE', 'CHARM', 'TRUST', 'PRIDE', 'DREAM', 'HOPES', 'BLISS', 'CHEER'],
  actions: ['DANCE', 'CLIMB', 'WRITE', 'PAINT', 'BUILD', 'LEARN', 'TEACH', 'LAUGH', 'REACH', 'SWIFT', 'SPEED', 'FLASH', 'SPARK', 'SHINE', 'GLIDE', 'DRIFT', 'FLOAT'],
  colors: ['GREEN', 'WHITE', 'BLACK', 'CORAL', 'AMBER', 'ROUGE', 'IVORY', 'AZURE', 'EBONY', 'LIGHT', 'BRIGHT', 'SHADE'],
  tech: ['CYBER', 'PIXEL', 'BYTES', 'NODES', 'VIRAL', 'CLOUD', 'SMART', 'CODED', 'LINKS', 'FEEDS', 'TREND', 'BLEND', 'MERGE'],
  fantasy: ['MAGIC', 'SPELL', 'CHARM', 'FAIRY', 'QUEST', 'REALM', 'MYTHS', 'ROYAL', 'CROWN', 'VALOR', 'HONOR', 'GLORY'],
  objects: ['CHAIR', 'TABLE', 'BOOKS', 'PHONE', 'WATCH', 'LIGHT', 'MUSIC', 'GLASS', 'PAPER', 'TOOLS']
};

// Cache for OpenAI-generated words
let wordCache: {
  [key: string]: {
    words: string[];
    timestamp: number;
  }
} = {};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export class WordManager {
  private static instance: WordManager;
  
  static getInstance(): WordManager {
    if (!WordManager.instance) {
      WordManager.instance = new WordManager();
    }
    return WordManager.instance;
  }

  private isCacheValid(key: string): boolean {
    const cached = wordCache[key];
    if (!cached) return false;
    return Date.now() - cached.timestamp < CACHE_DURATION;
  }

  async getRandomWord(): Promise<string> {
    // Use comprehensive built-in word list (500+ curated answer words)
    try {
      if (process.env.OPENAI_API_KEY) {
        const cacheKey = 'random_words';
        if (!this.isCacheValid(cacheKey)) {
          const generatedWords = await generateWords({
            category: 'general',
            difficulty: 'medium',
            count: 100
          });
          wordCache[cacheKey] = {
            words: generatedWords.map(w => w.word),
            timestamp: Date.now()
          };
        }
        
        const cachedWords = wordCache[cacheKey].words;
        return cachedWords[Math.floor(Math.random() * cachedWords.length)];
      }
    } catch (error) {
      console.log('OpenAI unavailable, using built-in words');
    }

    // Fallback to comprehensive built-in word list (500+ curated answer words)
    return getRandomAnswerWord();
  }

  async getDailyWord(): Promise<string> {
    // Use date-based seed for consistency
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    
    // Use comprehensive built-in word list for daily words
    return ANSWER_WORDS[dayOfYear % ANSWER_WORDS.length];
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  async getCategoryWord(category: string): Promise<string> {
    try {
      if (process.env.OPENAI_API_KEY) {
        const cacheKey = `category_${category}`;
        if (!this.isCacheValid(cacheKey)) {
          const generatedWords = await generateWordsByCategory(category, 50);
          if (generatedWords.length > 0) {
            wordCache[cacheKey] = {
              words: generatedWords,
              timestamp: Date.now()
            };
          }
        }
        
        if (this.isCacheValid(cacheKey)) {
          const cachedWords = wordCache[cacheKey].words;
          return cachedWords[Math.floor(Math.random() * cachedWords.length)];
        }
      }
    } catch (error) {
      console.log(`OpenAI unavailable for category ${category}, using built-in words`);
    }

    // Fallback to themed words from comprehensive list
    try {
      return getThemedWord(category as any);
    } catch {
      // If category not found, return random answer word
      return getRandomAnswerWord();
    }
  }



  // Get available categories
  getAvailableCategories(): string[] {
    return Object.keys(ENHANCED_WORD_CATEGORIES);
  }

  // Refresh cache for a specific category
  async refreshCategory(category: string): Promise<void> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key required for cache refresh');
    }
    
    try {
      const generatedWords = await generateWordsByCategory(category, 50);
      if (generatedWords.length > 0) {
        const cacheKey = `category_${category}`;
        wordCache[cacheKey] = {
          words: generatedWords,
          timestamp: Date.now()
        };
      }
    } catch (error) {
      console.error(`Failed to refresh category ${category}:`, error);
      throw error;
    }
  }

  // Get cache statistics
  getCacheStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    for (const [key, cache] of Object.entries(wordCache)) {
      stats[key] = {
        wordCount: cache.words.length,
        lastUpdated: new Date(cache.timestamp).toISOString(),
        isValid: this.isCacheValid(key)
      };
    }
    return stats;
  }
}

export const wordManager = WordManager.getInstance();