export type ThemeId =
  | 'metallic-dusk'
  | 'midnight'
  | 'emerald'
  | 'daylight'
  | 'vintage-rust'
  | 'forest-chapel'
  | 'alpine-twilight'
  | 'royal-salon';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  mode: 'dark' | 'light';
  swatches: [string, string, string];
}

export type SkillType = 'reading' | 'listening' | 'writing' | 'speaking' | 'mock';

export interface SkillScore {
  skill: 'Reading' | 'Listening' | 'Writing' | 'Speaking';
  band: number;
  change?: string;
}

export interface StatSummary {
  label: string;
  value: string;
  footnote: string;
  trend?: string;
  icon: string;
}

export interface LearningPathItem {
  id: string;
  title: string;
  level: string;
  skill: SkillType;
  duration: string;
  icon: string;
  status: 'recommended' | 'in-progress' | 'completed';
}

export interface ActivityEntry {
  id: string;
  skill: SkillType;
  title: string;
  date: string;
  band: number;
  summary: string;
}

export interface SkillModule {
  id: SkillType;
  name: string;
  description: string;
  activeModulesCount: number;
  targetTip: string;
  icon: string;
}

export interface SiteStat {
  label: string;
  value: string;
  description: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  phone?: string;
  targetBand: number;
  currentBand: number;
  examDate: string;
  streakDays: number;
  practiceHours: number;
  testsCompleted: number;
}

export interface WritingEvaluation {
  overallBand: number;
  taskResponseScore: number;
  coherenceScore: number;
  lexicalScore: number;
  grammarScore: number;
  taskResponseFeedback: string;
  coherenceFeedback: string;
  lexicalFeedback: string;
  grammarFeedback: string;
  generalSummary: string;
  keyImprovements: string[];
  enhancedVersionSnippet?: string;
}

export interface ReadingQuestion {
  id: number;
  type: 'multiple-choice' | 'true-false-not-given' | 'matching-heading';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ReadingPassage {
  title: string;
  category: string;
  durationMinutes: number;
  paragraphs: { label: string; text: string }[];
  questions: ReadingQuestion[];
}

export interface MockTest {
  id: string;
  title: string;
  category: 'Academic' | 'General Training' | 'Skill Sprint';
  duration: string;
  difficulty: 'Medium' | 'Hard' | 'Exam Simulation';
  questionsCount: number;
  completedCount: number;
  description: string;
}

export interface SubmissionItem {
  id: string;
  type: SkillType;
  title: string;
  submittedAt: string;
  bandScore: number;
  details: {
    prompt: string;
    userResponse: string;
    evaluations: { label: string; score: number; notes: string }[];
    feedback: string;
  };
}
