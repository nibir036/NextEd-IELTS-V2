import { UserProfile } from '../types';

export type ExamType = 'academic' | 'general_training';

export type AcademicBackground =
  | 'ssc_olevels'
  | 'hsc_alevels'
  | 'diploma'
  | 'bachelors'
  | 'masters'
  | 'phd'
  | 'other';

export interface DbUser extends UserProfile {
  id: string;
  phone: string;
  createdAt: string;
  // Extended profile (migration 0004). All optional — older rows may be null.
  email: string;
  legalFullName: string;
  nativeLanguage: string;
  country: string;
  dateOfBirth: string;
  examType: ExamType | '';
  academicBackground: AcademicBackground | '';
  hasTakenIelts: boolean;
  previousIeltsYear: number | null;
  previousIeltsBand: number | null;
}

// Payload accepted by the profile PATCH route (camelCase; server maps to snake_case).
export interface ProfileUpdate {
  name?: string;
  legalFullName?: string;
  email?: string;
  nativeLanguage?: string;
  country?: string;
  dateOfBirth?: string;
  examType?: ExamType | '';
  academicBackground?: AcademicBackground | '';
  hasTakenIelts?: boolean;
  previousIeltsYear?: number | null;
  previousIeltsBand?: number | null;
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    credentials: 'include',
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || 'Request failed.');
  }
  return body;
}

// Raw shape returned by /api/auth/* routes — snake_case, straight from Postgres/Prisma.
interface RawUserRow {
  id: string;
  phone: string | null;
  display_name: string | null;
  avatar: string | null;
  target_band: string | number | null;
  overall_band: string | number | null;
  exam_date: string | null;
  total_practice_time: number;
  created_at: string;
  // Extended profile columns (migration 0004). Optional so responses that
  // predate the migration (or use a narrower select) still map cleanly.
  email?: string | null;
  legal_full_name?: string | null;
  native_language?: string | null;
  country?: string | null;
  date_of_birth?: string | null;
  exam_type?: ExamType | null;
  academic_background?: AcademicBackground | null;
  has_taken_ielts?: boolean | null;
  previous_ielts_year?: number | null;
  previous_ielts_band?: string | number | null;
}

interface DashboardStats {
  testsCompleted: number;
  streakDays: number;
  practiceHours: number;
}

export interface DashboardData extends DashboardStats {
  overallBand: number | null;
  targetBand: number | null;
  skillBands: {
    listening: number | null;
    reading: number | null;
    writing: number | null;
    speaking: number | null;
  };
  weeklyActivity: { date: string; active: boolean }[];
  mockCount: number;
  modularCount: number;
  trend: { startBand: number; latestBand: number; gain: number } | null;
}

export interface SubmissionSummary {
  id: string;
  skill: string;
  kind: string;
  status: string;
  bandScore: number | null;
  submittedAt: string;
  title: string;
  summary: string;
}

export interface SubmissionDetail {
  id: string;
  skill: string;
  kind: string;
  status: string;
  bandScore: number | null;
  submittedAt: string;
  answers: Record<string, unknown>;
  feedback: Record<string, unknown>;
}

// Postgres DATE / TIMESTAMPTZ come back either as 'YYYY-MM-DD' or a full ISO
// string (once JSON-serialized). Normalize to the 'YYYY-MM-DD' a date input wants.
function toDateInput(value: string | null | undefined): string {
  if (!value) return '';
  return value.slice(0, 10);
}

// Single place where Postgres/Prisma's snake_case + Decimal/Date types get
// converted into the camelCase shape every view expects (see types.ts).
function mapUser(row: RawUserRow, stats: DashboardStats): DbUser {
  return {
    id: row.id,
    phone: row.phone ?? '',
    name: row.display_name ?? 'Candidate',
    avatar: row.avatar ?? '??',
    targetBand: row.target_band !== null ? Number(row.target_band) : 0,
    currentBand: row.overall_band !== null ? Number(row.overall_band) : 0,
    examDate: toDateInput(row.exam_date),
    streakDays: stats.streakDays,
    practiceHours: stats.practiceHours,
    testsCompleted: stats.testsCompleted,
    createdAt: row.created_at,
    // Extended profile
    email: row.email ?? '',
    legalFullName: row.legal_full_name ?? '',
    nativeLanguage: row.native_language ?? '',
    country: row.country ?? '',
    dateOfBirth: toDateInput(row.date_of_birth),
    examType: row.exam_type ?? '',
    academicBackground: row.academic_background ?? '',
    hasTakenIelts: Boolean(row.has_taken_ielts),
    previousIeltsYear:
      row.previous_ielts_year !== null && row.previous_ielts_year !== undefined
        ? Number(row.previous_ielts_year)
        : null,
    previousIeltsBand:
      row.previous_ielts_band !== null && row.previous_ielts_band !== undefined
        ? Number(row.previous_ielts_band)
        : null,
  };
}

/**
 * Real Database API — talks to Postgres via Next.js route handlers.
 * Session lives in an httpOnly cookie set by the server, so no token
 * handling is needed client-side.
 */
export const db = {
  async registerUser(details: {
    phone: string;
    password: string;
    name: string;
    email: string;
    targetBand?: number;
    examDate?: string;
  }): Promise<DbUser> {
    const { user } = await api<{ user: RawUserRow }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(details),
    });
    // Brand-new user: no submissions yet, so stats are all zero — skip the
    // extra round trip to /api/dashboard/stats.
    return mapUser(user, { testsCompleted: 0, streakDays: 0, practiceHours: 0 });
  },

  async loginUserByPhone(phone: string, password: string): Promise<DbUser | null> {
    try {
      const { user } = await api<{ user: RawUserRow }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, password }),
      });
      const stats = await api<DashboardStats>('/api/dashboard/stats');
      return mapUser(user, stats);
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    await api('/api/auth/logout', { method: 'POST' });
  },

  async getCurrentUser(): Promise<DbUser | null> {
    const { user } = await api<{ user: RawUserRow | null }>('/api/auth/me');
    if (!user) return null;
    try {
      const stats = await api<DashboardStats>('/api/dashboard/stats');
      return mapUser(user, stats);
    } catch {
      // Stats endpoint failing shouldn't block showing the logged-in user.
      return mapUser(user, { testsCompleted: 0, streakDays: 0, practiceHours: 0 });
    }
  },

  async isAuthenticated(): Promise<boolean> {
    return (await this.getCurrentUser()) !== null;
  },

  // Save profile details (Profile panel in Settings). Returns the refreshed
  // user, re-fetching stats so the returned DbUser stays complete.
  async updateProfile(details: ProfileUpdate): Promise<DbUser> {
    const { user } = await api<{ user: RawUserRow }>('/api/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(details),
    });
    const stats = await this.safeStats();
    return mapUser(user, stats);
  },

  // Save exam goals (target band + exam date) — separate Save action.
  async updateGoals(goals: { targetBand?: number; examDate?: string }): Promise<DbUser> {
    const { user } = await api<{ user: RawUserRow }>('/api/users/goals', {
      method: 'PATCH',
      body: JSON.stringify(goals),
    });
    const stats = await this.safeStats();
    return mapUser(user, stats);
  },

  // Full dashboard payload (bands, streak, hours, weekly activity, trend).
  async getDashboard(): Promise<DashboardData> {
    return api<DashboardData>('/api/dashboard/stats');
  },

  // Submission history (list) for the current user.
  async getSubmissions(): Promise<SubmissionSummary[]> {
    const { submissions } = await api<{ submissions: SubmissionSummary[] }>(
      '/api/submissions',
    );
    return submissions;
  },

  // A single submission with its full stored feedback + answers.
  async getSubmission(id: string): Promise<SubmissionDetail> {
    const { submission } = await api<{ submission: SubmissionDetail }>(
      `/api/submissions/${id}`,
    );
    return submission;
  },

  // Stats endpoint failing shouldn't block a successful profile/goal save.
  async safeStats(): Promise<DashboardStats> {
    try {
      return await api<DashboardStats>('/api/dashboard/stats');
    } catch {
      return { testsCompleted: 0, streakDays: 0, practiceHours: 0 };
    }
  },
};
