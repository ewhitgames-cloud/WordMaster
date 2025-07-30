import { type GameStats, type InsertGameStats, type GameResult, type InsertGameResult } from "@shared/schema";
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

export class MemStorage implements IStorage {
  private gameStats: GameStats | undefined;
  private gameResults: Map<string, GameResult>;

  constructor() {
    this.gameResults = new Map();
    // Initialize default stats
    this.gameStats = {
      id: randomUUID(),
      totalGames: 0,
      totalWins: 0,
      currentStreak: 0,
      maxStreak: 0,
      totalPoints: 0,
      guessDistribution: '{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0}',
      lastPlayed: null,
      createdAt: new Date(),
    };
  }

  async getGameStats(): Promise<GameStats | undefined> {
    return this.gameStats;
  }

  async createGameStats(insertStats: InsertGameStats): Promise<GameStats> {
    const stats: GameStats = {
      id: randomUUID(),
      totalGames: insertStats.totalGames || 0,
      totalWins: insertStats.totalWins || 0,
      currentStreak: insertStats.currentStreak || 0,
      maxStreak: insertStats.maxStreak || 0,
      totalPoints: insertStats.totalPoints || 0,
      guessDistribution: insertStats.guessDistribution || '{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0}',
      lastPlayed: insertStats.lastPlayed || null,
      createdAt: new Date(),
    };
    this.gameStats = stats;
    return stats;
  }

  async updateGameStats(updateStats: Partial<InsertGameStats>): Promise<GameStats> {
    if (!this.gameStats) {
      throw new Error("Game stats not found");
    }
    
    this.gameStats = {
      ...this.gameStats,
      ...updateStats,
      lastPlayed: new Date(),
    };
    
    return this.gameStats;
  }

  async saveGameResult(insertResult: InsertGameResult): Promise<GameResult> {
    const id = randomUUID();
    const result: GameResult = {
      id,
      word: insertResult.word,
      attempts: insertResult.attempts,
      timeElapsed: insertResult.timeElapsed,
      points: insertResult.points,
      isChallengeMode: insertResult.isChallengeMode || false,
      isWin: insertResult.isWin,
      playedAt: new Date(),
    };
    
    this.gameResults.set(id, result);
    return result;
  }

  async getRecentResults(limit: number): Promise<GameResult[]> {
    const results = Array.from(this.gameResults.values())
      .sort((a, b) => b.playedAt.getTime() - a.playedAt.getTime())
      .slice(0, limit);
    
    return results;
  }
}

export const storage = new MemStorage();
