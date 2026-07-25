import React, { useState } from 'react';
import { UserAnalytics } from '../types/neet';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertCircle, Award, Brain, CheckCircle2, LineChart, Sparkles, Target, TrendingUp, Zap } from 'lucide-react';

interface PerformanceAnalyticsProps {
  analytics: UserAnalytics;
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ analytics }) => {
  const [aiAdviceText, setAiAdviceText] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Prepare chart data for history
  const historyChartData = analytics.testHistory.slice(0, 10).reverse().map((item, idx) => ({
    name: `Test #${idx + 1}`,
    score: item.totalScore,
    accuracy: item.accuracy,
    title: item.testTitle,
  }));

  // Subject accuracy chart data
  const subjectChartData = [
    { subject: 'Physics', accuracy: analytics.subjectAccuracy.Physics, fill: '#6366f1' },
    { subject: 'Chemistry', accuracy: analytics.subjectAccuracy.Chemistry, fill: '#a855f7' },
    { subject: 'Botany', accuracy: analytics.subjectAccuracy.Botany, fill: '#10b981' },
    { subject: 'Zoology', accuracy: analytics.subjectAccuracy.Zoology, fill: '#14b8a6' },
  ];

  // Request AI Strategy Advice
  const handleFetchAiStrategy = async () => {
    setIsAiLoading(true);
    setAiError('');
    setIsModalOpen(true);

    const latestTest = analytics.testHistory[0];

    try {
      const res = await fetch('/api/gemini/analyze-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testSummary: {
            score: analytics.averageScore,
            totalMarks: 720,
            accuracy: analytics.overallAccuracy,
          },
          subjectScores: {
            Physics: { score: 120, accuracy: analytics.subjectAccuracy.Physics },
            Chemistry: { score: 140, accuracy: analytics.subjectAccuracy.Chemistry },
            Botany: { score: 160, accuracy: analytics.subjectAccuracy.Botany },
            Zoology: { score: 165, accuracy: analytics.subjectAccuracy.Zoology },
          },
          accuracyMap: analytics.subjectAccuracy,
          weakTopics: ['Rotational Motion in Physics', 'Organic Reaction Mechanisms', 'Genetics & Inheritance in Botany'],
        }),
      });

      const data = await res.json();
      if (data.advice) {
        setAiAdviceText(data.advice);
      } else {
        setAiError(data.error || 'Failed to generate strategic plan.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Error connecting to AI Strategy Advisor.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 text-white">
      
      {/* Title & AI Advisor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <LineChart className="w-4 h-4" />
            <span>NEET Analytics & Trend Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Comprehensive Performance Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">
            Track mock test score progression, subject accuracy, and NCERT weak area analysis.
          </p>
        </div>

        <button
          onClick={handleFetchAiStrategy}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center space-x-2"
        >
          <Brain className="w-4 h-4 text-white" />
          <span>Generate AI 7-Day Strategy</span>
        </button>
      </div>

      {/* Analytics Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <span className="text-slate-400 text-xs font-semibold uppercase">Total Tests</span>
          <div className="text-2xl font-extrabold text-white mt-1">{analytics.totalTestsTaken}</div>
          <p className="text-[11px] text-slate-400 mt-1">Completed Sessions</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <span className="text-slate-400 text-xs font-semibold uppercase">Average Score</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{analytics.averageScore} / 720</div>
          <p className="text-[11px] text-emerald-400/80 mt-1">Consistency Metric</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <span className="text-slate-400 text-xs font-semibold uppercase">Overall Accuracy</span>
          <div className="text-2xl font-extrabold text-teal-300 mt-1">{analytics.overallAccuracy}%</div>
          <p className="text-[11px] text-slate-400 mt-1">{analytics.totalQuestionsAttempted} Questions</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <span className="text-slate-400 text-xs font-semibold uppercase">Highest Score</span>
          <div className="text-2xl font-extrabold text-amber-300 mt-1">{analytics.highestScore} / 720</div>
          <p className="text-[11px] text-amber-400/80 mt-1 font-semibold">Personal Best</p>
        </div>
      </div>

      {/* Recharts Progress Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Score Progression Trend Chart */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Score Progression Over Time</span>
            </h2>
            <span className="text-xs text-slate-400">Last 10 Tests</span>
          </div>

          {historyChartData.length > 0 ? (
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyChartData}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 720]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    labelStyle={{ color: '#10b981', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#scoreGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-500 text-xs">
              Complete mock tests to visualize score trend graphs.
            </div>
          )}
        </div>

        {/* Subject Accuracy Bar Chart */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <span>Subject Accuracy Bar</span>
          </h2>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="accuracy" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* High-Yield Weak Area Analysis */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <span>NCERT Focus Areas & High-Yield Weak Topics</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 space-y-2">
            <span className="font-bold text-indigo-300">Physics Priorities</span>
            <ul className="space-y-1.5 text-slate-300">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Rotational Motion & Moment of Inertia</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Ray Optics - Lens & Prism Formulas</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Modern Physics - Photoelectric Effect</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 space-y-2">
            <span className="font-bold text-purple-300">Chemistry Priorities</span>
            <ul className="space-y-1.5 text-slate-300">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>General Organic Chemistry (GOC) & Carbocations</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>Coordination Chemistry - Hybridization</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>Electrochemistry - Nernst Equation</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 space-y-2">
            <span className="font-bold text-emerald-300">Biology Priorities</span>
            <ul className="space-y-1.5 text-slate-300">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Photosynthesis C₄ Pathway & Kranz Anatomy</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Human Cardiac Cycle & ECG Waves</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Molecular Genetics & Chargaff's Rules</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* AI Strategy Advisor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-indigo-400 text-sm font-bold">
                <Brain className="w-5 h-5" />
                <span>AI NEET AIR 1 Mentor Strategy</span>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            {isAiLoading ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-indigo-300 font-medium">Analyzing test accuracy & generating 7-day revision strategy...</p>
              </div>
            ) : aiError ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {aiError}
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 leading-relaxed space-y-2 whitespace-pre-line">
                {aiAdviceText}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
