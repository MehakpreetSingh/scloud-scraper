import { type SearchResult, type DownloadResponse } from "@shared/schema";

/**
 * Storage interface for API
 * This is a minimal implementation since our API doesn't require persistent storage
 * We're keeping this file to maintain structure and allow for future expansion
 */
export interface IStorage {
  // Search history could be added here in the future
  getRecentSearches(limit?: number): Promise<string[]>;
  saveSearch(query: string): Promise<void>;
}

/**
 * In-memory storage implementation
 */
export class MemStorage implements IStorage {
  private searchHistory: string[];
  
  constructor() {
    this.searchHistory = [];
  }

  /**
   * Get recent search queries
   */
  async getRecentSearches(limit: number = 10): Promise<string[]> {
    return this.searchHistory.slice(0, limit);
  }

  /**
   * Save a search query to history
   */
  async saveSearch(query: string): Promise<void> {
    // Don't add duplicates
    if (!this.searchHistory.includes(query)) {
      // Add to the beginning
      this.searchHistory.unshift(query);
      
      // Limit history to 100 items
      if (this.searchHistory.length > 100) {
        this.searchHistory.pop();
      }
    }
  }
}

export const storage = new MemStorage();
