/**
 * Safe localStorage operations
 */
export const storage = {
  /**
   * Get item from localStorage
   * @param key - Storage key
   * @returns Parsed value or null
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  /**
   * Set item in localStorage
   * @param key - Storage key
   * @param value - Value to store
   */
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  },

  /**
   * Remove item from localStorage
   * @param key - Storage key
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Failed to remove from localStorage:", error);
    }
  },

  /**
   * Clear all localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  },

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    try {
      const test = "__localStorage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },
};

/**
 * Safe sessionStorage operations
 */
export const sessionStorage = {
  /**
   * Get item from sessionStorage
   * @param key - Storage key
   * @returns Parsed value or null
   */
  get<T>(key: string): T | null {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  /**
   * Set item in sessionStorage
   * @param key - Storage key
   * @param value - Value to store
   */
  set<T>(key: string, value: T): void {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to save to sessionStorage:", error);
    }
  },

  /**
   * Remove item from sessionStorage
   * @param key - Storage key
   */
  remove(key: string): void {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error("Failed to remove from sessionStorage:", error);
    }
  },

  /**
   * Clear all sessionStorage
   */
  clear(): void {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error("Failed to clear sessionStorage:", error);
    }
  },
};
