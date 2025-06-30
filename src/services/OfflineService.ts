
export class OfflineService {
  private cacheKey = 'travelsathi_cache';
  private maxCacheSize = 50; // Maximum number of cached responses

  cacheData(query: string, response: string): void {
    try {
      const cache = this.getCache();
      const key = query.toLowerCase().trim();
      
      // Add new data
      cache[key] = {
        response,
        timestamp: Date.now(),
      };

      // Limit cache size
      const keys = Object.keys(cache);
      if (keys.length > this.maxCacheSize) {
        // Remove oldest entries
        const sortedKeys = keys.sort((a, b) => cache[a].timestamp - cache[b].timestamp);
        const keysToRemove = sortedKeys.slice(0, keys.length - this.maxCacheSize);
        keysToRemove.forEach(key => delete cache[key]);
      }

      localStorage.setItem(this.cacheKey, JSON.stringify(cache));
      console.log('Data cached for offline use:', key);
    } catch (error) {
      console.error('Error caching data:', error);
    }
  }

  getCachedData(query: string): string | null {
    try {
      const cache = this.getCache();
      const key = query.toLowerCase().trim();
      
      // Try exact match first
      if (cache[key]) {
        console.log('Found exact cached data for:', key);
        return cache[key].response;
      }

      // Try partial match
      const partialMatch = Object.keys(cache).find(cachedKey => 
        cachedKey.includes(key) || key.includes(cachedKey)
      );
      
      if (partialMatch) {
        console.log('Found partial cached data for:', key);
        return cache[partialMatch].response;
      }

      return null;
    } catch (error) {
      console.error('Error retrieving cached data:', error);
      return null;
    }
  }

  private getCache(): { [key: string]: { response: string; timestamp: number } } {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      return cached ? JSON.parse(cached) : {};
    } catch (error) {
      console.error('Error parsing cache:', error);
      return {};
    }
  }

  clearCache(): void {
    try {
      localStorage.removeItem(this.cacheKey);
      console.log('Cache cleared');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  getCacheInfo(): { size: number; keys: string[] } {
    const cache = this.getCache();
    return {
      size: Object.keys(cache).length,
      keys: Object.keys(cache),
    };
  }
}
