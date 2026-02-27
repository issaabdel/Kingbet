
import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Predictions (Tips)
export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  matchName: text("match_name").notNull(), // e.g. "Real Madrid vs Barcelona"
  matchTime: text("match_time").notNull(), // e.g. "20:45"
  betType: text("bet_type").notNull(),     // e.g. "V1", "Over 2.5"
  odds: text("odds").notNull(),            // e.g. "1.50"
  confidence: text("confidence").notNull(), // e.g. "90%"
  category: text("category").notNull().default("free"), // "free" or "vip"
  status: text("status").notNull().default("pending"), // "pending", "won", "lost"
  score: text("score"), // e.g. "2-1"
  date: text("date").notNull(), // YYYY-MM-DD for grouping
  isLocked: boolean("is_locked").default(false), // Visual lock icon for VIP
  createdAt: timestamp("created_at").defaultNow(),
});

// Public Messages / Announcements
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  link: text("link"), // Optional external link
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertPredictionSchema = createInsertSchema(predictions).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });

// === EXPLICIT API TYPES ===

export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Request Types
export type CreatePredictionRequest = InsertPrediction;
export type UpdatePredictionRequest = Partial<InsertPrediction>;

export type CreateMessageRequest = InsertMessage;

// API Responses
export type PredictionResponse = Prediction;
export type MessageResponse = Message;
