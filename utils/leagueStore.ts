import { League } from "./League";

// In-memory storage shared across API routes
export const leagues: Map<string, League> = new Map();
