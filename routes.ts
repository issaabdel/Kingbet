
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

// Extend session type
declare module "express-session" {
  interface SessionData {
    isAdmin: boolean;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Session setup for Admin
  app.use(
    session({
      secret: "kingbet-secret-key", // In production, use environment variable
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      cookie: { maxAge: 86400000 },
    })
  );

  const isAdmin = (req: any, res: any, next: any) => {
    if (req.session.isAdmin) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  // === ADMIN AUTH ===
  app.post(api.admin.login.path, (req, res) => {
    const { pin } = req.body;
    if (pin === "20077002") {
      req.session.isAdmin = true;
      res.json({ success: true });
    } else {
      res.status(401).json({ message: "Invalid PIN" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/admin/check", (req, res) => {
    res.json({ isAdmin: !!req.session.isAdmin });
  });

  // === PREDICTIONS ===
  app.get(api.predictions.list.path, async (req, res) => {
    const predictions = await storage.getPredictions();
    // Optional filtering by date/category could be done here or in storage
    // For simplicity, returning all and filtering on frontend or adding query param support
    // Simple filter support:
    let filtered = predictions;
    if (req.query.date) {
        filtered = filtered.filter(p => p.date === req.query.date);
    }
    if (req.query.category) {
        filtered = filtered.filter(p => p.category === req.query.category);
    }
    res.json(filtered);
  });

  app.post(api.predictions.create.path, isAdmin, async (req, res) => {
    try {
      const input = api.predictions.create.input.parse(req.body);
      const prediction = await storage.createPrediction(input);
      res.status(201).json(prediction);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.patch(api.predictions.update.path, isAdmin, async (req, res) => {
    const id = Number(req.params.id);
    try {
      const input = api.predictions.update.input.parse(req.body);
      const updated = await storage.updatePrediction(id, input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(404).json({ message: "Prediction not found" });
      }
    }
  });

  app.delete(api.predictions.delete.path, isAdmin, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deletePrediction(id);
    res.status(204).end();
  });

  // === MESSAGES ===
  app.get(api.messages.list.path, async (req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.post(api.messages.create.path, isAdmin, async (req, res) => {
    try {
      const input = api.messages.create.input.parse(req.body);
      const message = await storage.createMessage(input);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.delete(api.messages.delete.path, isAdmin, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteMessage(id);
    res.status(204).end();
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingPredictions = await storage.getPredictions();
  if (existingPredictions.length === 0) {
    const today = new Date().toISOString().split('T')[0];
    
    // Free Predictions
    await storage.createPrediction({
      matchName: "Real Madrid vs Barcelona",
      matchTime: "20:00",
      betType: "Both Teams to Score",
      odds: "1.65",
      confidence: "High",
      category: "free",
      status: "pending",
      date: today,
      isLocked: false,
    });
    
    await storage.createPrediction({
      matchName: "Man City vs Liverpool",
      matchTime: "17:30",
      betType: "Over 2.5 Goals",
      odds: "1.50",
      confidence: "Medium",
      category: "free",
      status: "won",
      date: today,
      isLocked: false,
    });

    // VIP Predictions
    await storage.createPrediction({
      matchName: "Bayern Munich vs Dortmund",
      matchTime: "18:30",
      betType: "Home Win & Over 2.5",
      odds: "2.10",
      confidence: "Very High",
      category: "vip",
      status: "pending",
      date: today,
      isLocked: true,
    });
    
    await storage.createPrediction({
      matchName: "PSG vs Marseille",
      matchTime: "21:00",
      betType: "Exact Score 3-1",
      odds: "11.00",
      confidence: "Risky",
      category: "vip",
      status: "pending",
      date: today,
      isLocked: true,
    });

    // Message
    await storage.createMessage({
      content: "🔥 Bienvenue sur Kingbet ! Profitez de nos pronostics gratuits et passez VIP pour maximiser vos gains.",
      link: "https://t.me/kingbet_channel"
    });
  }
}
