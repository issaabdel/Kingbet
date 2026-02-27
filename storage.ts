
import { db } from "./db";
import {
  predictions,
  messages,
  type Prediction,
  type InsertPrediction,
  type Message,
  type InsertMessage,
  type UpdatePredictionRequest
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Predictions
  getPredictions(): Promise<Prediction[]>;
  getPrediction(id: number): Promise<Prediction | undefined>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  updatePrediction(id: number, updates: UpdatePredictionRequest): Promise<Prediction>;
  deletePrediction(id: number): Promise<void>;

  // Messages
  getMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  deleteMessage(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Predictions
  async getPredictions(): Promise<Prediction[]> {
    return await db.select().from(predictions).orderBy(desc(predictions.date));
  }

  async getPrediction(id: number): Promise<Prediction | undefined> {
    const [prediction] = await db.select().from(predictions).where(eq(predictions.id, id));
    return prediction;
  }

  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const [prediction] = await db.insert(predictions).values(insertPrediction).returning();
    return prediction;
  }

  async updatePrediction(id: number, updates: UpdatePredictionRequest): Promise<Prediction> {
    const [updated] = await db.update(predictions)
      .set(updates)
      .where(eq(predictions.id, id))
      .returning();
    return updated;
  }

  async deletePrediction(id: number): Promise<void> {
    await db.delete(predictions).where(eq(predictions.id, id));
  }

  // Messages
  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async deleteMessage(id: number): Promise<void> {
    await db.delete(messages).where(eq(messages.id, id));
  }
}

export const storage = new DatabaseStorage();
