export type Subject = 'Physics' | 'Chemistry' | 'Botany' | 'Zoology';

export type TestSection = 'Section A' | 'Section B';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface QuestionOption {
  id: number;
  text: string;
}

export interface Question {
  id: string;
  subject: Subject;
  section: TestSection; // Section A (35 mandatory) or Section B (15 - attempt 10)
  topic: string;
  chapter: string;
  ncertClass: 11 | 12;
  question: string;
  codeSnippet?: string;
  diagramUrl?: string;
  options: string[];
  correctAnswer: number; // 0, 1, 2, or 3
  explanation: string;
  ncertReference: string;
  isAssertionReason?: boolean;
}

export interface MockTest {
  id: string;
  title: string;
  description: string;
  category: 'Daily Mock' | 'Full NEET 720' | 'Subject Speed Test' | 'Chapter Test' | 'PYQ Paper';
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  questions: Question[];
  subjectDistribution: Record<Subject, number>;
  difficulty: Difficulty;
  date: string;
  isDailySpecial?: boolean;
}

export interface UserResponse {
  questionId: string;
  selectedOption: number | null; // index 0-3 or null if unattempted
  isMarkedForReview: boolean;
  timeSpentSeconds: number;
  isBookmarked?: boolean;
}

export interface SubjectResult {
  subject: Subject;
  score: number;
  maxMarks: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  accuracy: number; // percentage 0-100
  timeSpentSeconds: number;
}

export interface TestResult {
  id: string;
  testId: string;
  testTitle: string;
  testCategory: string;
  completedAt: string;
  totalScore: number;
  maxMarks: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  accuracy: number; // 0-100
  totalTimeSeconds: number;
  estimatedRankTier: string;
  estimatedPercentile: number;
  subjectResults: Record<Subject, SubjectResult>;
  topicAccuracy: Record<string, { correct: number; total: number; accuracy: number; subject: Subject }>;
  weakTopics: string[];
  userResponses: Record<string, UserResponse>;
}

export interface StudySession {
  id: string;
  subject: Subject | 'NCERT Revision' | 'Mock Review';
  durationMinutes: number;
  completedAt: string;
  notes?: string;
  mode: '25/5' | '45/10' | '50/10' | '90/15' | 'Custom';
}

export interface UserAnalytics {
  totalTestsTaken: number;
  averageScore: number;
  highestScore: number;
  totalQuestionsAttempted: number;
  overallAccuracy: number;
  streakDays: number;
  lastActiveDate: string;
  testHistory: TestResult[];
  bookmarks: string[]; // Question IDs
  topicStats: Record<string, { correct: number; total: number; accuracy: number; subject: Subject }>;
  subjectAccuracy: Record<Subject, number>;
  studySessions?: StudySession[];
  totalStudyMinutes?: number;
}

export interface Flashcard {
  id: string;
  subject: Subject;
  topic: string;
  chapter: string;
  front: string; // Question or concept
  back: string;  // Key NCERT explanation / formula
  ncertReference: string;
  isHighYield: boolean;
}
