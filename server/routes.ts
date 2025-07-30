import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameStatsSchema, insertGameResultSchema } from "@shared/schema";
import { z } from "zod";

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
      
      const randomWord = words[Math.floor(Math.random() * words.length)];
      res.json({ word: randomWord });
    } catch (error) {
      res.status(500).json({ message: "Failed to get word" });
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
          // Generate consistent daily word based on date
          const today = new Date();
          const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
          selectedWord = allWords[dayOfYear % allWords.length];
          break;
          
        case 'daily-challenge':
          // Generate daily challenge word with sophisticated vocabulary
          const challengeDailyWords = [
            'VIVID', 'AZURE', 'EBONY', 'ROUGE', 'IVORY', 'AMBER', 'CORAL', 'PEARL', 'LUNAR', 'SOLAR',
            'CYBER', 'PIXEL', 'BYTES', 'NODES', 'VIRAL', 'BLEND', 'MERGE', 'SHIFT', 'ADAPT', 'EVOLVE',
            'MYSTIC', 'VALOR', 'HONOR', 'GLORY', 'REALM', 'SPELL', 'CHARM', 'FAIRY', 'MYTHS', 'EPIC',
            'CRISP', 'SWIFT', 'SHARP', 'CLEAR', 'SCOPE', 'RANGE', 'LIMIT', 'BOUND', 'SOLID',
            'GALES', 'MISTY', 'ORBIT', 'COMET', 'COSMIC', 'PHASE', 'CYCLE', 'STAGE', 'TURNS', 'TWIST',
            'WHIRL', 'SWIRL', 'TWIRL', 'GLIDE', 'SOAR', 'DRIFT', 'FLOAT', 'LEAP', 'SURF',
            'BLISS', 'CHEER', 'MERRY', 'JOLLY', 'EAGER', 'LOVED', 'ADORE', 'GENTLE', 'FIERCE', 'NOBLE',
            'GRACE', 'CHARM', 'STYLE', 'CLASS', 'ELITE', 'PRIME', 'GRAND', 'ROYAL', 'MIGHTY', 'BOLD',
            'ARTSY', 'CRAFT', 'FORMS', 'CURVE', 'SHADE', 'LINES', 'BRUSH', 'PAINT', 'COLOR', 'GLOW',
            'CODES', 'HINTS', 'CLUES', 'SIGNS', 'TEXTS', 'MEMOS', 'VOICE', 'TALES', 'STORY', 'POEMS'
          ];
          
          const todayChallenge = new Date();
          const year = todayChallenge.getFullYear();
          const month = todayChallenge.getMonth() + 1;
          const day = todayChallenge.getDate();
          
          // Create a seed based on date to ensure consistency
          const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          let seed = 0;
          for (let i = 0; i < dateString.length; i++) {
            seed = ((seed << 5) - seed + dateString.charCodeAt(i)) & 0xffffffff;
          }
          
          // Use seeded random to select from challenge words
          const challengeIndex = Math.abs(seed) % challengeDailyWords.length;
          selectedWord = challengeDailyWords[challengeIndex];
          break;
          
        case 'challenge':
          // Select more challenging words (tech/fantasy themes)
          const challengeWords = [
            'CYBER', 'PIXEL', 'CODES', 'BYTES', 'NODES', 'VIRAL', 'BLEND', 'MERGE', 'SHIFT', 'ADAPT',
            'QUEST', 'MAGIC', 'SPELL', 'CHARM', 'FAIRY', 'MYTHS', 'EPIC', 'VALOR', 'HONOR', 'GLORY',
            'COSMIC', 'LUNAR', 'SOLAR', 'COMET', 'ORBIT', 'GALES', 'MISTY', 'AZURE', 'ROUGE', 'EBONY'
          ];
          selectedWord = challengeWords[Math.floor(Math.random() * challengeWords.length)];
          break;
          
        case 'category':
          // Select from specific category if provided
          const categories = {
            nature: ['WATER', 'EARTH', 'FLAME', 'STORM', 'CLOUD', 'OCEAN', 'RIVER', 'BEACH', 'STONE', 'STEEL'],
            emotions: ['HAPPY', 'SMILE', 'LAUGH', 'PEACE', 'GRACE', 'CHARM', 'TRUST', 'PRIDE', 'DREAM', 'HOPES'],
            actions: ['DANCE', 'CLIMB', 'REACH', 'SWIFT', 'SPEED', 'FLASH', 'SPARK', 'SHINE', 'GLIDE', 'SOAR'],
            fantasy: ['QUEST', 'MAGIC', 'SPELL', 'CHARM', 'FAIRY', 'TALES', 'MYTHS', 'EPIC', 'HERO', 'VALOR']
          };
          const categoryWords = categories[category as keyof typeof categories] || allWords;
          selectedWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
          break;
          
        default:
          // Random selection
          selectedWord = allWords[Math.floor(Math.random() * allWords.length)];
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
      const challengeDailyWords = [
        'VIVID', 'AZURE', 'EBONY', 'ROUGE', 'IVORY', 'AMBER', 'CORAL', 'PEARL', 'LUNAR', 'SOLAR',
        'CYBER', 'PIXEL', 'BYTES', 'NODES', 'VIRAL', 'BLEND', 'MERGE', 'SHIFT', 'ADAPT', 'EVOLVE',
        'MYSTIC', 'VALOR', 'HONOR', 'GLORY', 'REALM', 'SPELL', 'CHARM', 'FAIRY', 'MYTHS', 'EPIC',
        'CRISP', 'SWIFT', 'SHARP', 'CLEAR', 'SCOPE', 'RANGE', 'LIMIT', 'BOUND', 'SOLID',
        'GALES', 'MISTY', 'ORBIT', 'COMET', 'COSMIC', 'PHASE', 'CYCLE', 'STAGE', 'TURNS', 'TWIST',
        'WHIRL', 'SWIRL', 'TWIRL', 'GLIDE', 'SOAR', 'DRIFT', 'FLOAT', 'LEAP', 'SURF',
        'BLISS', 'CHEER', 'MERRY', 'JOLLY', 'EAGER', 'LOVED', 'ADORE', 'GENTLE', 'FIERCE', 'NOBLE',
        'GRACE', 'CHARM', 'STYLE', 'CLASS', 'ELITE', 'PRIME', 'GRAND', 'ROYAL', 'MIGHTY', 'BOLD',
        'ARTSY', 'CRAFT', 'FORMS', 'CURVE', 'SHADE', 'LINES', 'BRUSH', 'PAINT', 'COLOR', 'GLOW',
        'CODES', 'HINTS', 'CLUES', 'SIGNS', 'TEXTS', 'MEMOS', 'VOICE', 'TALES', 'STORY', 'POEMS'
      ];
      
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
      
      // Use seeded random to select from challenge words
      const challengeIndex = Math.abs(seed) % challengeDailyWords.length;
      const selectedWord = challengeDailyWords[challengeIndex];
      
      res.json({ 
        word: selectedWord,
        date: dateString,
        difficulty: 'hard',
        totalChallengeWords: challengeDailyWords.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get daily challenge word" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
