import { generateWords, generateDailyChallengeWords, generateWordsByCategory } from './openai-words';

// Enhanced word categories with larger sets
const ENHANCED_WORD_CATEGORIES = {
  nature: ['OCEAN', 'RIVER', 'BEACH', 'FIELD', 'PLANT', 'STONE', 'CLOUD', 'STORM', 'WOODS', 'GRASS'],
  emotions: ['HAPPY', 'BRAVE', 'PROUD', 'LOVED', 'CALM', 'EAGER', 'MERRY', 'SWEET', 'KIND', 'WARM'],
  actions: ['JUMP', 'DANCE', 'CLIMB', 'WRITE', 'PAINT', 'BUILD', 'LEARN', 'TEACH', 'LAUGH', 'SING'],
  colors: ['BLUE', 'GREEN', 'GOLD', 'PINK', 'WHITE', 'BLACK', 'CORAL', 'AMBER', 'ROUGE', 'IVORY'],
  tech: ['CYBER', 'PIXEL', 'BYTES', 'NODES', 'VIRAL', 'CLOUD', 'SMART', 'CODED', 'LINKS', 'FEEDS'],
  fantasy: ['MAGIC', 'SPELL', 'CHARM', 'FAIRY', 'DRAGON', 'QUEST', 'REALM', 'MYTHS', 'ROYAL', 'CROWN'],
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

    // Fallback to built-in words
    const allBuiltInWords = Object.values(ENHANCED_WORD_CATEGORIES).flat();
    return allBuiltInWords[Math.floor(Math.random() * allBuiltInWords.length)];
  }

  async getDailyWord(): Promise<string> {
    // Use date-based seeding for consistent daily words
    const today = new Date();
    const dateString = today.toDateString();
    const seed = this.hashString(dateString);
    
    const allWords = Object.values(ENHANCED_WORD_CATEGORIES).flat();
    return allWords[seed % allWords.length];
  }

  async getDailyChallengeWord(): Promise<string> {
    // Harder words for daily challenge
    const challengeWords = [...ENHANCED_WORD_CATEGORIES.tech, ...ENHANCED_WORD_CATEGORIES.fantasy];
    const today = new Date();
    const dateString = today.toDateString() + '-challenge';
    const seed = this.hashString(dateString);
    
    return challengeWords[seed % challengeWords.length];
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
              words: generatedWords.map(w => w.word),
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

    // Fallback to built-in category words
    const categoryWords = ENHANCED_WORD_CATEGORIES[category as keyof typeof ENHANCED_WORD_CATEGORIES] || 
                         ENHANCED_WORD_CATEGORIES.nature;
    return categoryWords[Math.floor(Math.random() * categoryWords.length)];
  }

  async getDailyWord(): Promise<string> {
    // Use date-based seed for consistency
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    
    try {
      if (process.env.OPENAI_API_KEY) {
        const cacheKey = 'daily_words';
        if (!this.isCacheValid(cacheKey)) {
          const generatedWords = await generateWords({
            category: 'daily challenges',
            difficulty: 'medium',
            count: 365 // A year's worth
          });
          wordCache[cacheKey] = {
            words: generatedWords.map(w => w.word),
            timestamp: Date.now()
          };
        }
        
        const cachedWords = wordCache[cacheKey].words;
        return cachedWords[dayOfYear % cachedWords.length];
      }
    } catch (error) {
      console.log('OpenAI unavailable for daily word, using built-in words');
    }

    // Fallback to built-in words with date seed
    const allBuiltInWords = Object.values(ENHANCED_WORD_CATEGORIES).flat();
    return allBuiltInWords[dayOfYear % allBuiltInWords.length];
  }

  async getDailyChallengeWord(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    // Create a seed based on date to ensure consistency
    const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    let seed = 0;
    for (let i = 0; i < dateString.length; i++) {
      seed = ((seed << 5) - seed + dateString.charCodeAt(i)) & 0xffffffff;
    }

    try {
      if (process.env.OPENAI_API_KEY) {
        const cacheKey = 'daily_challenge_words';
        if (!this.isCacheValid(cacheKey)) {
          const generatedWords = await generateDailyChallengeWords(200);
          if (generatedWords.length > 0) {
            wordCache[cacheKey] = {
              words: generatedWords.map(w => w.word),
              timestamp: Date.now()
            };
          }
        }
        
        if (this.isCacheValid(cacheKey)) {
          const cachedWords = wordCache[cacheKey].words;
          return cachedWords[Math.abs(seed) % cachedWords.length];
        }
      }
    } catch (error) {
      console.log('OpenAI unavailable for daily challenge, using built-in words');
    }

    // Fallback to built-in challenging words
    const challengeWords = [
      'VIVID', 'AZURE', 'EBONY', 'ROUGE', 'IVORY', 'AMBER', 'CORAL', 'PEARL', 'LUNAR', 'SOLAR',
      'CYBER', 'PIXEL', 'BYTES', 'NODES', 'VIRAL', 'BLEND', 'MERGE', 'SHIFT', 'ADAPT', 'EVOLVE',
      'MYSTIC', 'VALOR', 'HONOR', 'GLORY', 'REALM', 'SPELL', 'CHARM', 'FAIRY', 'MYTHS', 'EPIC'
    ];
    return challengeWords[Math.abs(seed) % challengeWords.length];
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
          words: generatedWords.map(w => w.word),
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