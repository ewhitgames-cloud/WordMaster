import { type GameStats, type InsertGameStats, type GameResult, type InsertGameResult, gameStats, gameResults } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Game Stats
  getGameStats(): Promise<GameStats | undefined>;
  createGameStats(stats: InsertGameStats): Promise<GameStats>;
  updateGameStats(stats: Partial<InsertGameStats>): Promise<GameStats>;
  
  // Game Results
  saveGameResult(result: InsertGameResult): Promise<GameResult>;
  getRecentResults(limit: number): Promise<GameResult[]>;
}

export class DatabaseStorage implements IStorage {
  async getGameStats(): Promise<GameStats | undefined> {
    // Get the first (and should be only) game stats record
    const [stats] = await db.select().from(gameStats).limit(1);
    
    // If no stats exist, create default stats
    if (!stats) {
      return await this.createGameStats({
        totalGames: 0,
        totalWins: 0,
        currentStreak: 0,
        maxStreak: 0,
        totalPoints: 0,
        guessDistribution: '{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0}',
        lastPlayed: null,
      });
    }
    
    return stats;
  }

  async createGameStats(insertStats: InsertGameStats): Promise<GameStats> {
    const [stats] = await db
      .insert(gameStats)
      .values(insertStats)
      .returning();
    return stats;
  }

  async updateGameStats(updateStats: Partial<InsertGameStats>): Promise<GameStats> {
    // First get existing stats
    const existingStats = await this.getGameStats();
    if (!existingStats) {
      throw new Error("Game stats not found");
    }

    // Update the stats
    const [updatedStats] = await db
      .update(gameStats)
      .set({
        ...updateStats,
        lastPlayed: new Date(),
      })
      .where(eq(gameStats.id, existingStats.id))
      .returning();
    
    return updatedStats;
  }

  async saveGameResult(insertResult: InsertGameResult): Promise<GameResult> {
    const [result] = await db
      .insert(gameResults)
      .values(insertResult)
      .returning();
    return result;
  }

  async getRecentResults(limit: number): Promise<GameResult[]> {
    const results = await db
      .select()
      .from(gameResults)
      .orderBy((table) => table.playedAt)
      .limit(limit);
    
    return results.reverse(); // Most recent first
  }
}

export const storage = new DatabaseStorage();
