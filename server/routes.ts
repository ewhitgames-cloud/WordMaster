import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameStatsSchema, insertGameResultSchema } from "@shared/schema";
import { z } from "zod";
import { WordManager } from "./word-manager";
import { validateWordExpanded } from "./word-validator";
import { VALID_WORDS } from "./word-dictionary";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get game statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getGameStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get stats" });
    }
  });

  // Update game statistics
  app.post("/api/stats", async (req, res) => {
    try {
      const validatedData = insertGameStatsSchema.parse(req.body);
      const stats = await storage.updateGameStats(validatedData);
      res.json(stats);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update stats" });
      }
    }
  });

  // Save game result
  app.post("/api/results", async (req, res) => {
    try {
      const validatedData = insertGameResultSchema.parse(req.body);
      const result = await storage.saveGameResult(validatedData);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save result" });
      }
    }
  });

  // Get recent results
  app.get("/api/results", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const results = await storage.getRecentResults(limit);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to get results" });
    }
  });

  // Get a random word for the game (expanded word pool)
  app.get("/api/word", async (req, res) => {
    try {
      // Expanded target words with 300+ words organized by categories for variety
      const words = [
        // Nature & Elements
        'WATER', 'EARTH', 'FLAME', 'STORM', 'CLOUD', 'OCEAN', 'RIVER', 'BEACH', 'STONE', 'STEEL',
        'FROST', 'BLOOM', 'PLANT', 'GRASS', 'TREES', 'WOODS', 'FRESH', 'SUNNY', 'WINDS', 'WAVES',
        'CORAL', 'PEARL', 'AMBER', 'LUNAR', 'SOLAR', 'COMET', 'ORBIT', 'GALES', 'MISTY',
        
        // Emotions & Feelings
        'HAPPY', 'SMILE', 'LAUGH', 'PEACE', 'GRACE', 'CHARM', 'TRUST', 'PRIDE', 'DREAM', 'HOPES',
        'BRAVE', 'SMART', 'SWEET', 'GENTLE', 'CALM', 'BOLD', 'FIERCE', 'NOBLE', 'WARM', 'KIND',
        'BLISS', 'CHEER', 'MERRY', 'JOLLY', 'EAGER', 'LOVED', 'ADORE', 'HEART', 'SOUL', 'SPIRIT',
        
        // Actions & Movement
        'DANCE', 'CLIMB', 'REACH', 'SWIFT', 'SPEED', 'FLASH', 'SPARK', 'SHINE', 'GLIDE', 'SOAR',
        'DRIFT', 'FLOAT', 'SWING', 'TWIST', 'TWIRL', 'SLIDE', 'BOUND', 'LEAP', 'JUMP',
        'RUSH', 'ZOOM', 'WHIRL', 'SPIN', 'TURN', 'FLIP', 'DIVE', 'SURF', 'RIDE', 'FLOW',
        
        // Colors & Visual
        'LIGHT', 'BRIGHT', 'GLOW', 'SHADE', 'AZURE', 'CORAL', 'IVORY', 'EBONY', 'ROUGE', 'OLIVE',
        'AMBER', 'PEARL', 'GOLD', 'SILVER', 'BRONZE', 'ROYAL', 'VIVID', 'CLEAR', 'CRISP', 'SHARP',
        
        // Technology & Modern
        'CYBER', 'PIXEL', 'CODES', 'BYTES', 'LINKS', 'NODES', 'VIRAL', 'TREND', 'BLEND', 'MERGE',
        'SHIFT', 'ADAPT', 'SMART', 'QUICK', 'RAPID', 'BOOST', 'POWER', 'FORCE', 'DRIVE',
        
        // Adventure & Fantasy
        'QUEST', 'MAGIC', 'SPELL', 'CHARM', 'FAIRY', 'TALES', 'MYTHS', 'EPIC',
        'HERO', 'BRAVE', 'BOLD', 'VALOR', 'HONOR', 'GLORY', 'CROWN', 'ROYAL', 'NOBLE', 'MIGHTY',
        'SWORD', 'SHIELD', 'TOWER', 'REALM', 'LANDS', 'WORLD', 'SPACE', 'COSMIC',
        
        // Objects & Things
        'HOUSE', 'TOWER', 'CABIN', 'LODGE', 'VENUE', 'PLAZA', 'GATES', 'DOORS', 'WALLS', 'ROOF',
        'BOOKS', 'PAGES', 'WORDS', 'TALES', 'STORY', 'NOVEL', 'POEMS', 'SONGS', 'MUSIC', 'NOTES',
        'GIFTS', 'PRIZE', 'TOKEN', 'BADGE', 'MEDAL', 'CROWN', 'JEWEL', 'RINGS', 'CHAIN', 'CHARM',
        
        // Food & Taste
        'SWEET', 'SPICY', 'FRESH', 'CRISP', 'TASTE', 'SUGAR', 'HONEY', 'CREAM', 'JUICE',
        'FRUIT', 'GRAPE', 'APPLE', 'BERRY', 'MELON', 'PEACH', 'MANGO', 'LEMON', 'HERBS', 'SPICE',
        
        // Time & Seasons
        'TODAY', 'NIGHT', 'EARLY', 'LATER', 'TIMER', 'TIMES', 'YEARS', 'YOUTH', 'NEWLY', 'FRESH',
        'CYCLE', 'PHASE', 'STAGE', 'TURNS', 'SHIFT', 'CHANGE', 'TREND', 'STYLE', 'RETRO',
        
        // Abstract Concepts
        'TRUTH', 'FAITH', 'TRUST', 'UNITY', 'PEACE', 'HOPE', 'DREAM', 'IDEAL', 'VALUE', 'WORTH',
        'HONOR', 'PRIDE', 'GRACE', 'CHARM', 'STYLE', 'CLASS', 'ELITE', 'PRIME', 'ROYAL', 'GRAND',
        'SOLID', 'VALID', 'EXACT', 'CLEAR', 'SHARP', 'FOCUS', 'SCOPE', 'RANGE', 'LIMIT', 'BOUND',
        
        // Sports & Games
        'SPORT', 'GAMES', 'PLAYS', 'TEAMS', 'MATCH', 'SCORE', 'GOALS', 'SPEED',
        'POWER', 'FORCE', 'SWING', 'PITCH', 'CATCH', 'THROW', 'KICKS', 'JUMPS', 'RUNS', 'RACE',
        
        // Art & Creativity
        'PAINT', 'BRUSH', 'COLOR', 'SHADE', 'LINES', 'CRAFT', 'STYLE', 'FORMS', 'SHAPE', 'CURVE',
        'BLEND', 'MERGE', 'TWIST', 'SWIRL', 'FLOW', 'GRACE', 'CHARM', 'ARTSY',
        
        // Communication
        'VOICE', 'SPEAK', 'WORDS', 'TALES', 'STORY', 'SHARE', 'TALKS', 'CALLS', 'TEXTS', 'CODES',
        'SIGNS', 'HINTS', 'CLUES', 'NOTES', 'MEMOS', 'NEWS', 'INFO', 'DATA', 'FACTS', 'TRUTH'
      ];
      
      const randomWord = await wordManager.getRandomWord();
      res.json({ 
        word: randomWord,
        source: process.env.OPENAI_API_KEY ? 'OpenAI' : 'built-in'
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get word" });
    }
  });

  // Get current game word - this is what the client actually calls
  app.get("/api/word/current-game", async (req, res) => {
    try {
      const wordManager = WordManager.getInstance();
      const selectedWord = await wordManager.getRandomWord();
      
      res.json({ 
        word: selectedWord,
        source: process.env.OPENAI_API_KEY ? 'built-in-with-openai-fallback' : 'built-in'
      });
    } catch (error) {
      console.error('Error getting current game word:', error);
      
      // Emergency fallback to ensure game always works - all exactly 5 letters
      const emergencyWords = [
        'WATER', 'HAPPY', 'DANCE', 'LIGHT', 'MAGIC', 'POWER', 'VOICE', 'DREAM', 'SMILE', 'PEACE',
        'BRAVE', 'SWIFT', 'SPARK', 'SHINE', 'OCEAN', 'STORM', 'GLIDE', 'TWIST', 'CHARM', 'QUEST'
      ].filter(word => word.length === 5);
      const emergencyWord = emergencyWords[Math.floor(Math.random() * emergencyWords.length)];
      
      res.json({ 
        word: emergencyWord,
        source: 'emergency-fallback'
      });
    }
  });

  // Get word by mode (random, daily, challenge, category-specific)
  app.get("/api/word/generate/:mode", async (req, res) => {
    try {
      const { mode } = req.params;
      const { category } = req.query;
      
      const allWords = [
        // All the same words from above for consistency
        'WATER', 'EARTH', 'FLAME', 'STORM', 'CLOUD', 'OCEAN', 'RIVER', 'BEACH', 'STONE', 'STEEL',
        'FROST', 'BLOOM', 'PLANT', 'GRASS', 'TREES', 'WOODS', 'FRESH', 'SUNNY', 'WINDS', 'WAVES',
        'CORAL', 'PEARL', 'AMBER', 'LUNAR', 'SOLAR', 'COMET', 'ORBIT', 'GALES', 'MISTY',
        'HAPPY', 'SMILE', 'LAUGH', 'PEACE', 'GRACE', 'CHARM', 'TRUST', 'PRIDE', 'DREAM', 'HOPES',
        'BRAVE', 'SMART', 'SWEET', 'GENTLE', 'CALM', 'BOLD', 'FIERCE', 'NOBLE', 'WARM', 'KIND',
        'BLISS', 'CHEER', 'MERRY', 'JOLLY', 'EAGER', 'LOVED', 'ADORE', 'HEART', 'SOUL', 'SPIRIT',
        'DANCE', 'CLIMB', 'REACH', 'SWIFT', 'SPEED', 'FLASH', 'SPARK', 'SHINE', 'GLIDE', 'SOAR',
        'DRIFT', 'FLOAT', 'SWING', 'TWIST', 'TWIRL', 'SLIDE', 'BOUND', 'LEAP', 'JUMP',
        'RUSH', 'ZOOM', 'WHIRL', 'SPIN', 'TURN', 'FLIP', 'DIVE', 'SURF', 'RIDE', 'FLOW',
        'LIGHT', 'BRIGHT', 'GLOW', 'SHADE', 'AZURE', 'CORAL', 'IVORY', 'EBONY', 'ROUGE', 'OLIVE',
        'CYBER', 'PIXEL', 'CODES', 'BYTES', 'LINKS', 'NODES', 'VIRAL', 'TREND', 'BLEND', 'MERGE',
        'QUEST', 'MAGIC', 'SPELL', 'CHARM', 'FAIRY', 'TALES', 'MYTHS', 'EPIC', 'HERO', 'VALOR'
      ];

      let selectedWord: string;

      switch (mode) {
        case 'daily':
          selectedWord = await WordManager.getInstance().getDailyWord();
          break;
          
        case 'daily-challenge':
          selectedWord = await WordManager.getInstance().getDailyChallengeWord();
          break;
          
        case 'challenge':
          selectedWord = await WordManager.getInstance().getCategoryWord('tech');
          break;
          
        case 'category':
          if (category && typeof category === 'string') {
            selectedWord = await WordManager.getInstance().getCategoryWord(category);
          } else {
            selectedWord = await WordManager.getInstance().getRandomWord();
          }
          break;
          
        default:
          selectedWord = await WordManager.getInstance().getRandomWord();
      }

      res.json({ 
        word: selectedWord, 
        mode,
        category: category || 'all',
        totalAvailable: allWords.length 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate word" });
    }
  });

  // Get today's daily challenge word
  app.get("/api/word/daily-challenge", async (req, res) => {
    try {
      const selectedWord = await WordManager.getInstance().getDailyChallengeWord();
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      
      res.json({ 
        word: selectedWord,
        date: dateString,
        difficulty: 'hard',
        source: process.env.OPENAI_API_KEY ? 'OpenAI' : 'built-in'
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get daily challenge word" });
    }
  });

  // Get word cache statistics and available categories
  app.get("/api/word/stats", async (req, res) => {
    try {
      const cacheStats = WordManager.getInstance().getCacheStats();
      const categories = WordManager.getInstance().getAvailableCategories();
      
      res.json({
        hasOpenAI: !!process.env.OPENAI_API_KEY,
        categories,
        cacheStats,
        totalCachedWords: Object.values(cacheStats).reduce((sum, stat) => sum + stat.wordCount, 0)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get word stats" });
    }
  });

  // Refresh word cache for a specific category
  app.post("/api/word/refresh/:category", async (req, res) => {
    try {
      const { category } = req.params;
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(400).json({ message: "OpenAI API key required for cache refresh" });
      }
      
      await WordManager.getInstance().refreshCategory(category);
      res.json({ message: `Cache refreshed for category: ${category}` });
    } catch (error) {
      res.status(500).json({ message: `Failed to refresh cache for category: ${req.params.category}` });
    }
  });

  // Validate a word using OpenAI + built-in dictionary
  app.post("/api/word/validate", async (req, res) => {
    try {
      const { word } = req.body;
      
      if (!word || typeof word !== 'string' || word.length !== 5) {
        return res.status(400).json({ 
          message: "Word must be a 5-letter string",
          isValid: false 
        });
      }

      const isValid = await validateWordExpanded(word, VALID_WORDS);
      
      res.json({ 
        word: word.toUpperCase(),
        isValid,
        source: VALID_WORDS.has(word.toUpperCase()) ? 'built-in' : 'OpenAI',
        hasOpenAI: !!process.env.OPENAI_API_KEY
      });
    } catch (error) {
      console.error('Word validation error:', error);
      res.status(500).json({ 
        message: "Failed to validate word",
        isValid: false
      });
    }
  });

  // Batch validate multiple words
  app.post("/api/word/validate-batch", async (req, res) => {
    try {
      const { words } = req.body;
      
      if (!Array.isArray(words) || words.length === 0) {
        return res.status(400).json({ 
          message: "Words must be a non-empty array",
          results: {}
        });
      }

      const results: Record<string, boolean> = {};
      
      // Process words in parallel for better performance
      const validationPromises = words.map(async (word: string) => {
        if (typeof word === 'string' && word.length === 5) {
          const isValid = await validateWordExpanded(word, VALID_WORDS);
          return { word: word.toUpperCase(), isValid };
        }
        return { word: word.toUpperCase(), isValid: false };
      });

      const validationResults = await Promise.all(validationPromises);
      
      validationResults.forEach(({ word, isValid }) => {
        results[word] = isValid;
      });
      
      res.json({ 
        results,
        totalWords: words.length,
        validWords: Object.values(results).filter(Boolean).length,
        hasOpenAI: !!process.env.OPENAI_API_KEY
      });
    } catch (error) {
      console.error('Batch word validation error:', error);
      res.status(500).json({ 
        message: "Failed to validate words",
        results: {}
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
