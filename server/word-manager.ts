import { generateWords, generateDailyChallengeWords, generateWordsByCategory } from './openai-words';

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
    // Try to get from OpenAI first, fallback to built-in words
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

    // Fallback to built-in words - ensure all are exactly 5 letters
    const allBuiltInWords = Object.values(ENHANCED_WORD_CATEGORIES).flat().filter(word => word.length === 5);
    return allBuiltInWords[Math.floor(Math.random() * allBuiltInWords.length)];
  }

  async getDailyWord(): Promise<string> {
    // Use date-based seed for consistency
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    
    // Always use built-in words for reliability - ensure exactly 5 letters
    const allBuiltInWords = Object.values(ENHANCED_WORD_CATEGORIES).flat().filter(word => word.length === 5);
    return allBuiltInWords[dayOfYear % allBuiltInWords.length];
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

    // Fallback to built-in category words - ensure exactly 5 letters
    const categoryWords = (ENHANCED_WORD_CATEGORIES[category as keyof typeof ENHANCED_WORD_CATEGORIES] || 
                         ENHANCED_WORD_CATEGORIES.nature).filter(word => word.length === 5);
    return categoryWords[Math.floor(Math.random() * categoryWords.length)];
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