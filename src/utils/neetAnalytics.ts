import { MockTest, Question, StudySession, Subject, SubjectResult, TestResult, UserAnalytics, UserResponse } from '../types/neet';
import { neetQuestionBank } from '../data/neetQuestions';

const STORAGE_KEY = 'neet_prep_master_analytics_v2';
const BOOKMARKS_KEY = 'neet_prep_master_bookmarks_v2';

export function calculateTestResult(
  test: MockTest,
  responses: Record<string, UserResponse>,
  totalTimeSeconds: number
): TestResult {
  let totalScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;

  const subjects: Subject[] = ['Physics', 'Chemistry', 'Botany', 'Zoology'];
  const subjectResults: Record<Subject, SubjectResult> = {
    Physics: { subject: 'Physics', score: 0, maxMarks: 0, correct: 0, incorrect: 0, unattempted: 0, accuracy: 0, timeSpentSeconds: 0 },
    Chemistry: { subject: 'Chemistry', score: 0, maxMarks: 0, correct: 0, incorrect: 0, unattempted: 0, accuracy: 0, timeSpentSeconds: 0 },
    Botany: { subject: 'Botany', score: 0, maxMarks: 0, correct: 0, incorrect: 0, unattempted: 0, accuracy: 0, timeSpentSeconds: 0 },
    Zoology: { subject: 'Zoology', score: 0, maxMarks: 0, correct: 0, incorrect: 0, unattempted: 0, accuracy: 0, timeSpentSeconds: 0 },
  };

  const topicAccuracy: Record<string, { correct: number; total: number; accuracy: number; subject: Subject }> = {};

  const testQuestions = (test.questions && test.questions.length > 0) ? test.questions : neetQuestionBank;

  testQuestions.forEach((q) => {
    const resp = responses[q.id];
    const sub = q.subject;

    subjectResults[sub].maxMarks += 4;

    if (!topicAccuracy[q.topic]) {
      topicAccuracy[q.topic] = { correct: 0, total: 0, accuracy: 0, subject: sub };
    }
    topicAccuracy[q.topic].total += 1;

    if (resp && resp.selectedOption !== null && resp.selectedOption !== undefined) {
      const timeSpent = resp.timeSpentSeconds || 0;
      subjectResults[sub].timeSpentSeconds += timeSpent;

      if (resp.selectedOption === q.correctAnswer) {
        // Correct (+4)
        totalScore += 4;
        correctCount += 1;
        subjectResults[sub].score += 4;
        subjectResults[sub].correct += 1;
        topicAccuracy[q.topic].correct += 1;
      } else {
        // Incorrect (-1)
        totalScore -= 1;
        incorrectCount += 1;
        subjectResults[sub].score -= 1;
        subjectResults[sub].incorrect += 1;
      }
    } else {
      // Unattempted (0)
      unattemptedCount += 1;
      subjectResults[sub].unattempted += 1;
    }
  });

  // Calculate accuracies
  const totalAttempted = correctCount + incorrectCount;
  const overallAccuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

  subjects.forEach((sub) => {
    const attempted = subjectResults[sub].correct + subjectResults[sub].incorrect;
    subjectResults[sub].accuracy = attempted > 0 ? Math.round((subjectResults[sub].correct / attempted) * 100) : 0;
  });

  // Weak topics extraction (accuracy < 60% or unattempted high)
  const weakTopics: string[] = [];
  Object.keys(topicAccuracy).forEach((topic) => {
    const item = topicAccuracy[topic];
    item.accuracy = Math.round((item.correct / item.total) * 100);
    if (item.accuracy < 60 || item.correct === 0) {
      weakTopics.push(topic);
    }
  });

  // Scale total score to estimated 720 equivalent if small test
  const normalized720Score = Math.round((totalScore / test.totalMarks) * 720);
  const { rankTier, percentile } = estimateRankAndPercentile(normalized720Score);

  return {
    id: `result-${Date.now()}`,
    testId: test.id,
    testTitle: test.title,
    testCategory: test.category,
    completedAt: new Date().toISOString(),
    totalScore,
    maxMarks: test.totalMarks,
    correctCount,
    incorrectCount,
    unattemptedCount,
    accuracy: overallAccuracy,
    totalTimeSeconds,
    estimatedRankTier: rankTier,
    estimatedPercentile: percentile,
    subjectResults,
    topicAccuracy,
    weakTopics,
    userResponses: responses,
  };
}

export function estimateRankAndPercentile(scoreOutof720: number): { rankTier: string; percentile: number } {
  if (scoreOutof720 >= 700) return { rankTier: 'AIR 1 - 100 (Top AIIMS Delhi)', percentile: 99.99 };
  if (scoreOutof720 >= 660) return { rankTier: 'AIR 100 - 1,500 (Top GMCs - MAMC/VMMC)', percentile: 99.85 };
  if (scoreOutof720 >= 620) return { rankTier: 'AIR 1,500 - 8,000 (Premier State GMC MBBS)', percentile: 99.1 };
  if (scoreOutof720 >= 580) return { rankTier: 'AIR 8,000 - 25,000 (Govt Medical College)', percentile: 97.5 };
  if (scoreOutof720 >= 520) return { rankTier: 'AIR 25,000 - 65,000 (Semi-Govt / Private MBBS)', percentile: 94.0 };
  if (scoreOutof720 >= 450) return { rankTier: 'AIR 65,000 - 130,000 (BDS / BAMS Govt)', percentile: 88.0 };
  return { rankTier: 'Qualifying Cutoff Tier (> 130,000)', percentile: 75.0 };
}

export function loadUserAnalytics(): UserAnalytics {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading analytics from localStorage:', e);
  }

  const initialSessions: StudySession[] = [
    {
      id: 'session-demo-1',
      subject: 'Physics',
      durationMinutes: 45,
      completedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      notes: 'Rotational Motion Formulas & Moment of Inertia Questions',
      mode: '45/10',
    },
    {
      id: 'session-demo-2',
      subject: 'Botany',
      durationMinutes: 50,
      completedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      notes: 'NCERT Photosynthesis C4 Cycle Line-by-Line Diagram Review',
      mode: '50/10',
    },
  ];

  return {
    totalTestsTaken: 0,
    averageScore: 0,
    highestScore: 0,
    totalQuestionsAttempted: 0,
    overallAccuracy: 0,
    streakDays: 3, // Initial motivation streak
    lastActiveDate: new Date().toISOString().split('T')[0],
    testHistory: [],
    bookmarks: [],
    topicStats: {},
    subjectAccuracy: {
      Physics: 68,
      Chemistry: 75,
      Botany: 85,
      Zoology: 88,
    },
    studySessions: initialSessions,
    totalStudyMinutes: 95,
  };
}

export function saveStudySessionToAnalytics(newSession: StudySession): UserAnalytics {
  const current = loadUserAnalytics();
  const existingSessions = current.studySessions || [];
  const updatedSessions = [newSession, ...existingSessions];
  const totalMinutes = updatedSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  // Update streak if needed
  const today = new Date().toISOString().split('T')[0];
  let streak = current.streakDays;
  if (current.lastActiveDate !== today) {
    streak += 1;
  }

  const updatedAnalytics: UserAnalytics = {
    ...current,
    studySessions: updatedSessions,
    totalStudyMinutes: totalMinutes,
    streakDays: streak,
    lastActiveDate: today,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalytics));
  } catch (e) {
    console.error('Failed to save study session to localStorage:', e);
  }

  return updatedAnalytics;
}

export function deleteStudySessionFromAnalytics(sessionId: string): UserAnalytics {
  const current = loadUserAnalytics();
  const existingSessions = current.studySessions || [];
  const updatedSessions = existingSessions.filter((s) => s.id !== sessionId);
  const totalMinutes = updatedSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  const updatedAnalytics: UserAnalytics = {
    ...current,
    studySessions: updatedSessions,
    totalStudyMinutes: totalMinutes,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalytics));
  } catch (e) {
    console.error('Failed to delete study session:', e);
  }

  return updatedAnalytics;
}

export function saveTestResultToAnalytics(newResult: TestResult): UserAnalytics {
  const current = loadUserAnalytics();

  const updatedHistory = [newResult, ...current.testHistory];
  const totalTests = updatedHistory.length;

  let scoreSum = 0;
  let highest = 0;
  let totalAttempted = 0;
  let totalCorrect = 0;

  updatedHistory.forEach((res) => {
    scoreSum += res.totalScore;
    if (res.totalScore > highest) highest = res.totalScore;
    totalAttempted += res.correctCount + res.incorrectCount;
    totalCorrect += res.correctCount;
  });

  const avgScore = totalTests > 0 ? Math.round(scoreSum / totalTests) : 0;
  const overallAcc = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  // Update streak
  const today = new Date().toISOString().split('T')[0];
  let streak = current.streakDays;
  if (current.lastActiveDate !== today) {
    streak += 1;
  }

  // Update subject accuracies
  const subjectAcc: Record<Subject, number> = { ...current.subjectAccuracy };
  const subjects: Subject[] = ['Physics', 'Chemistry', 'Botany', 'Zoology'];
  subjects.forEach((sub) => {
    if (newResult.subjectResults[sub]) {
      const subRes = newResult.subjectResults[sub];
      if (subRes.correct + subRes.incorrect > 0) {
        subjectAcc[sub] = Math.round((subjectAcc[sub] + subRes.accuracy) / 2);
      }
    }
  });

  const updatedAnalytics: UserAnalytics = {
    ...current,
    totalTestsTaken: totalTests,
    averageScore: avgScore,
    highestScore: highest,
    totalQuestionsAttempted: totalAttempted,
    overallAccuracy: overallAcc,
    streakDays: streak,
    lastActiveDate: today,
    testHistory: updatedHistory,
    subjectAccuracy: subjectAcc,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalytics));
  } catch (e) {
    console.error('Failed to save analytics to localStorage:', e);
  }

  return updatedAnalytics;
}

export function getBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function toggleBookmark(questionId: string): string[] {
  const current = getBookmarks();
  let updated: string[];
  if (current.includes(questionId)) {
    updated = current.filter((id) => id !== questionId);
  } else {
    updated = [...current, questionId];
  }
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update bookmarks:', e);
  }
  return updated;
}
