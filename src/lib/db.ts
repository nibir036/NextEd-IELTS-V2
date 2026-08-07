import initialDbData from '../data/initialDb.json';
import { UserProfile } from '../types';

export interface DbUser extends UserProfile {
  id: string;
  phone: string;
  moduleType?: string;
  createdAt: string;
}

export interface DatabaseSchema {
  users: DbUser[];
  currentSessionPhone: string | null;
}

const STORAGE_KEY = 'ielts_app_db_v1';

// Internal helper to read entire DB state from LocalStorage or initialize with initialDb.json
function loadDatabase(): DatabaseSchema {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.users)) {
        return parsed as DatabaseSchema;
      }
    }
  } catch (err) {
    console.warn('Failed to load DB from localStorage, falling back to initial JSON:', err);
  }

  // Fallback to static initial DB JSON
  const initial = initialDbData as DatabaseSchema;
  saveDatabase(initial);
  return initial;
}

function saveDatabase(db: DatabaseSchema): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.error('Failed to save DB to localStorage:', err);
  }
}

/**
 * Static Database API
 */
export const db = {
  getUsers(): DbUser[] {
    const database = loadDatabase();
    return database.users;
  },

  getUserByPhone(phone: string): DbUser | undefined {
    const database = loadDatabase();
    const cleanPhone = phone.replace(/\s+/g, '');
    return database.users.find(
      (u) => u.phone.replace(/\s+/g, '') === cleanPhone
    );
  },

  registerUser(details: {
    phone: string;
    name: string;
    targetBand?: number;
    currentBand?: number;
    moduleType?: string;
    examDate?: string;
  }): DbUser {
    const database = loadDatabase();
    const cleanPhone = details.phone.trim();

    // Check if phone already exists
    const existing = database.users.find(
      (u) => u.phone.replace(/\s+/g, '') === cleanPhone.replace(/\s+/g, '')
    );
    if (existing) {
      // Update session and return existing
      database.currentSessionPhone = existing.phone;
      saveDatabase(database);
      return existing;
    }

    // Create initials avatar
    const nameParts = details.name.trim().split(' ');
    const avatar =
      nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : details.name.slice(0, 2).toUpperCase();

    const newUser: DbUser = {
      id: `usr-${Date.now()}`,
      phone: cleanPhone,
      name: details.name.trim(),
      avatar,
      targetBand: details.targetBand || 8.0,
      currentBand: details.currentBand || 6.5,
      examDate: details.examDate || '2026-11-14',
      streakDays: 1,
      practiceHours: 0.5,
      testsCompleted: 0,
      moduleType: details.moduleType || 'Academic',
      createdAt: new Date().toISOString(),
    };

    database.users.push(newUser);
    database.currentSessionPhone = newUser.phone;
    saveDatabase(database);
    return newUser;
  },

  loginUserByPhone(phone: string): DbUser | null {
    const database = loadDatabase();
    const user = this.getUserByPhone(phone);
    if (!user) return null;

    database.currentSessionPhone = user.phone;
    saveDatabase(database);
    return user;
  },

  logout(): void {
    const database = loadDatabase();
    database.currentSessionPhone = null;
    saveDatabase(database);
  },

  getCurrentUser(): DbUser | null {
    const database = loadDatabase();
    if (!database.currentSessionPhone) return null;

    return (
      database.users.find(
        (u) =>
          u.phone.replace(/\s+/g, '') ===
          database.currentSessionPhone?.replace(/\s+/g, '')
      ) || null
    );
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
};
