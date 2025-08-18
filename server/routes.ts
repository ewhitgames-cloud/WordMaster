import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameStatsSchema, insertGameResultSchema } from "@shared/schema";
import { z } from "zod";
import { 
  OFFICIAL_WORDLE_ANSWERS, 
  isOfficialWordleWord, 
  getRandomAnswerWord, 
  getDailyWord 
} from "@shared/official-wordle-words";

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
        console.error('Failed to save game result:', error);
        // Return empty object to prevent client errors
        res.json({});
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

  // Get a random word for the game (official Wordle words only)
  app.get("/api/word", async (req, res) => {
    try {
      const randomWord = getRandomAnswerWord();
      res.json({ 
        word: randomWord,
        source: 'official-wordle'
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get word" });
    }
  });

  // Get current game word - this is what the client actually calls
  app.get("/api/word/current-game", async (req, res) => {
    try {
      const selectedWord = getRandomAnswerWord();
      console.log('Target word set to:', selectedWord);
      
      res.json({ 
        word: selectedWord,
        source: 'official-wordle'
      });
    } catch (error) {
      console.error('Error getting current game word:', error);
      res.status(500).json({ message: "Failed to get word" });
    }
  });

  // Get daily challenge word
  app.get("/api/word/daily-challenge", async (req, res) => {
    try {
      const dailyWord = getDailyWord();
      const today = new Date().toISOString().split('T')[0];
      
      res.json({ 
        word: dailyWord,
        date: today,
        source: 'official-wordle-daily'
      });
    } catch (error) {
      console.error('Error getting daily challenge word:', error);
      res.status(500).json({ message: "Failed to get daily word" });
    }
  });

  // Validate a single word (for user input validation)
  app.post("/api/word/validate", async (req, res) => {
    try {
      const { word } = req.body;
      
      if (!word || typeof word !== 'string') {
        return res.status(400).json({ 
          message: "Word is required",
          isValid: false 
        });
      }

      const cleanWord = word.trim().toUpperCase();
      
      if (cleanWord.length !== 5) {
        return res.json({ 
          isValid: false,
          message: "Word must be exactly 5 letters",
          word: cleanWord
        });
      }

      const isValid = isOfficialWordleWord(cleanWord);
      
      res.json({ 
        isValid,
        word: cleanWord,
        source: 'official-wordle',
        message: isValid ? "Valid word" : "Not in official Wordle word list"
      });
    } catch (error) {
      console.error('Word validation error:', error);
      res.status(500).json({ 
        message: "Failed to validate word",
        isValid: false 
      });
    }
  });

  // Batch validate words (for checking multiple words at once)
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
      
      words.forEach((word: any) => {
        if (typeof word === 'string' && word.length === 5) {
          const cleanWord = word.trim().toUpperCase();
          results[cleanWord] = isOfficialWordleWord(cleanWord);
        } else {
          const cleanWord = String(word).trim().toUpperCase();
          results[cleanWord] = false;
        }
      });
      
      res.json({ 
        results,
        totalWords: words.length,
        validWords: Object.values(results).filter(Boolean).length,
        source: 'official-wordle'
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