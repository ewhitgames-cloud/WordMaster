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

  // Get a random word for the game
  app.get("/api/word", async (req, res) => {
    try {
      const words = [
        "HOUSE", "BRAVE", "CLAIM", "DRINK", "PRIDE", "MUSIC", "DANCE", "LIGHT", "PLANT", "STORM",
        "GRACE", "SHINE", "PEACE", "CHARM", "TRUST", "SWIFT", "DREAM", "SMART", "LAUGH", "SMILE",
        "HEART", "WORLD", "POWER", "ROYAL", "SWEET", "MAGIC", "GIANT", "QUEST", "BEACH", "RIVER",
        "FOREST", "OCEAN", "CLOUD", "FLAME", "STEEL", "STONE", "FRESH", "CLIMB", "REACH", "YOUTH",
        "SPACE", "TIME", "HONOR", "WORTH", "CRISP", "BLOOM", "FROST", "SPARK", "TREND", "BLEND"
      ];
      
      const randomWord = words[Math.floor(Math.random() * words.length)];
      res.json({ word: randomWord });
    } catch (error) {
      res.status(500).json({ message: "Failed to get word" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
