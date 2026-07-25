import React from 'react';
import { MockTest, StudySession, UserAnalytics } from '../types/neet';
import { ArrowRight, Award, BookOpen, Brain, CheckCircle2, Clock, Flame, LineChart, Play, Sparkles, Target, Zap } from 'lucide-react';
import { StudyPomodoroTimer } from './StudyPomodoroTimer';

interface DashboardProps {
  analytics: UserAnalytics;
  dailyMockTest: MockTest;
  onStartTest: (test: MockTest) => void;
  onNavigateTab: (tab: 'dashboard' | 'tests' | 'analytics' | 'ai-tutor' | 'flashcards') => void;
  onSaveStudySession: (session: StudySession) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  analytics,
  dailyMockTest,
  onStartTest,
  onNavigateTab,
  onSaveStudySession,
}) => {
  const projectedAIR = analytics.highestScore >= 650 ? "AIR < 1,500 (AIIMS / Top GMC)"
    : analytics.highestScore >= 600 ? "AIR < 8,000 (Govt Medical College)"
    : analytics.highestScore >= 520 ? "AIR < 35,000 (State Counseling Tier)"
    : "Qualifying Target Tier";

  const todayStr = new Date().toISOString().split('T')[0];
  const allSessions = analytics.studySessions || [];
  const todaySessions = allSessions.filter((s) => s.completedAt.startsWith(todayStr));
  const totalTodayMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalAllTimeMinutes = analytics.totalStudyMinutes || allSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Daily Mock Test Callout */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl text-white">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Today's Standardised Daily Booster</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {dailyMockTest.title}
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed">
              {dailyMockTest.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300 pt-1">
              <span className="flex items-center space-x-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>{dailyMockTest.totalQuestions} Questions</span>
              </span>

              <span className="flex items-center space-x-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>{dailyMockTest.totalMarks} Marks (+4 / -1)</span>
              </span>

              <span className="flex items-center space-x-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{dailyMockTest.durationMinutes} Minutes</span>
              </span>

              <span className="flex items-center space-x-1 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30 text-emerald-300">
                <span>NTA 2026 Pattern</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onStartTest(dailyMockTest)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Daily Mock Test</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Key Metric Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Tests */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-white shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Tests Attempted</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold">{analytics.totalTestsTaken}</div>
          <p className="text-xs text-slate-400 mt-1">Daily & Full Mock Tests</p>
        </div>

        {/* Highest Score */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-white shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Peak Score</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-300">
            {analytics.highestScore} <span className="text-xs text-slate-400 font-normal">/ 720</span>
          </div>
          <p className="text-xs text-amber-400/80 mt-1 font-medium">{projectedAIR}</p>
        </div>

        {/* Accuracy */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-white shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Accuracy Rate</span>
            <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-teal-300">{analytics.overallAccuracy}%</div>
          <p className="text-xs text-slate-400 mt-1">{analytics.totalQuestionsAttempted} Questions Solved</p>
        </div>

        {/* Deep Work Focus Hours */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-white shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Deep Work Focus</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-indigo-300">
            {(totalAllTimeMinutes / 60).toFixed(1)} <span className="text-xs text-slate-400 font-normal">Hrs</span>
          </div>
          <p className="text-xs text-indigo-400/80 mt-1 font-medium">
            {allSessions.length} Focus Sessions Logged
          </p>
        </div>

        {/* Active Streak */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-white shadow-md hover:border-slate-700 transition-all col-span-2 md:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Study Streak</span>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
              <Flame className="w-5 h-5 fill-rose-400/20" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-300">{analytics.streakDays} Days</div>
          <p className="text-xs text-slate-400 mt-1">Consistent Prep Schedule</p>
        </div>
      </div>

      {/* Pomodoro Study Timer Component */}
      <StudyPomodoroTimer
        onSessionComplete={onSaveStudySession}
        totalTodayMinutes={totalTodayMinutes}
        sessionCountToday={todaySessions.length}
      />

      {/* Subject Mastery & NCERT Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Subject Accuracy Breakdown */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>Subject Mastery (NCERT Standard)</span>
              </h2>
              <p className="text-xs text-slate-400">Accuracy breakdown across NEET subjects</p>
            </div>

            <button
              onClick={() => onNavigateTab('analytics')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>View Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Physics */}
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-indigo-300">Physics</span>
                <span className="text-xs font-bold text-indigo-400">{analytics.subjectAccuracy.Physics}% Accuracy</span>
              </div>
              <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.subjectAccuracy.Physics}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Class 11 Mechanics & 12 Electrodynamics</span>
                <span>Target: 160+ Marks</span>
              </div>
            </div>

            {/* Chemistry */}
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-purple-300">Chemistry</span>
                <span className="text-xs font-bold text-purple-400">{analytics.subjectAccuracy.Chemistry}% Accuracy</span>
              </div>
              <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.subjectAccuracy.Chemistry}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Organic, Inorganic & Physical</span>
                <span>Target: 170+ Marks</span>
              </div>
            </div>

            {/* Botany */}
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-emerald-300">Botany (Biology I)</span>
                <span className="text-xs font-bold text-emerald-400">{analytics.subjectAccuracy.Botany}% Accuracy</span>
              </div>
              <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.subjectAccuracy.Botany}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Plant Physiology, Cell & Genetics</span>
                <span>Target: 180 Marks</span>
              </div>
            </div>

            {/* Zoology */}
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-teal-300">Zoology (Biology II)</span>
                <span className="text-xs font-bold text-teal-400">{analytics.subjectAccuracy.Zoology}% Accuracy</span>
              </div>
              <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.subjectAccuracy.Zoology}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Human Physiology & Reproduction</span>
                <span>Target: 180 Marks</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right 1 Col: Quick Action Toolkit */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>NEET Action Hub</span>
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => onNavigateTab('tests')}
              className="w-full text-left p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all flex items-center space-x-3 group"
            >
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">
                  Daily Mock Test Directory
                </h3>
                <p className="text-xs text-slate-400 truncate">Timed tests, chapter speed tests & NTA 720</p>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('ai-tutor')}
              className="w-full text-left p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all flex items-center space-x-3 group"
            >
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
                  AI NEET Doubt Solver
                </h3>
                <p className="text-xs text-slate-400 truncate">Ask doubts, NCERT lines & formula derivations</p>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('flashcards')}
              className="w-full text-left p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all flex items-center space-x-3 group"
            >
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">
                  NCERT Formula & Concept Deck
                </h3>
                <p className="text-xs text-slate-400 truncate">High-yield revision flashcards & diagrams</p>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('analytics')}
              className="w-full text-left p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all flex items-center space-x-3 group"
            >
              <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 group-hover:scale-105 transition-transform">
                <LineChart className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-100 group-hover:text-teal-400 transition-colors">
                  Weak Areas & Score Strategy
                </h3>
                <p className="text-xs text-slate-400 truncate">AI generated 7-day revision plan</p>
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* Recent Mock Test History Table */}
      {analytics.testHistory.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>Recent Mock Test Performance</span>
            </h2>
            <span className="text-xs text-slate-400">{analytics.testHistory.length} Completed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Test Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Accuracy</th>
                  <th className="px-4 py-3">Projected Rank</th>
                  <th className="px-4 py-3 rounded-r-xl">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200 text-xs">
                {analytics.testHistory.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-white">{item.testTitle}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
                        {item.testCategory}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-400">
                      {item.totalScore} / {item.maxMarks}
                    </td>
                    <td className="px-4 py-3 font-semibold">{item.accuracy}%</td>
                    <td className="px-4 py-3 text-amber-300 font-medium">{item.estimatedRankTier}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(item.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
