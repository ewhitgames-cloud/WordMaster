import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameStats = pgTable("game_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalGames: integer("total_games").notNull().default(0),
  totalWins: integer("total_wins").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  maxStreak: integer("max_streak").notNull().default(0),
  totalPoints: integer("total_points").notNull().default(0),
  guessDistribution: text("guess_distribution").notNull().default('{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0}'),
  lastPlayed: timestamp("last_played"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const gameResults = pgTable("game_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  word: text("word").notNull(),
  attempts: integer("attempts").notNull(),
  timeElapsed: integer("time_elapsed").notNull(),
  points: integer("points").notNull(),
  isChallengeMode: boolean("is_challenge_mode").notNull().default(false),
  isWin: boolean("is_win").notNull(),
  playedAt: timestamp("played_at").notNull().default(sql`now()`),
});

export const insertGameStatsSchema = createInsertSchema(gameStats).omit({
  id: true,
  createdAt: true,
});

export const insertGameResultSchema = createInsertSchema(gameResults).omit({
  id: true,
  playedAt: true,
});

export type InsertGameStats = z.infer<typeof insertGameStatsSchema>;
export type GameStats = typeof gameStats.$inferSelect;
export type InsertGameResult = z.infer<typeof insertGameResultSchema>;
export type GameResult = typeof gameResults.$inferSelect;
