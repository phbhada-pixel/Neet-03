import React, { useState } from 'react';
import { UserAnalytics } from '../types/neet';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertCircle, Award, Brain, CheckCircle2, Clock, Flame, LineChart, Sparkles, Target, TrendingUp, Zap } from 'lucide-react';

interface PerformanceAnalyticsProps {
  analytics: UserAnalytics;
  onDeleteSession?: (sessionId: string) => void;
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ analytics, onDeleteSession }) => {
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

  // Core NEET subjects Radar chart dataset (Physics, Chemistry, Botany, Zoology)
  const radarChartData = [
    { subject: 'Physics', accuracy: analytics.subjectAccuracy.Physics || 0, target: 85, fullMark: 100 },
    { subject: 'Chemistry', accuracy: analytics.subjectAccuracy.Chemistry || 0, target: 85, fullMark: 100 },
    { subject: 'Botany', accuracy: analytics.subjectAccuracy.Botany || 0, target: 90, fullMark: 100 },
    { subject: 'Zoology', accuracy: analytics.subjectAccuracy.Zoology || 0, target: 90, fullMark: 100 },
  ];

  // Deep work study sessions calculations
  const studySessions = analytics.studySessions || [];
  const totalStudyMinutes = analytics.totalStudyMinutes || studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  // Study minutes by subject
  const subjectStudyMap: Record<string, number> = {
    Physics: 0,
    Chemistry: 0,
    Botany: 0,
    Zoology: 0,
    'NCERT Revision': 0,
    'Mock Review': 0,
  };

  studySessions.forEach((s) => {
    if (subjectStudyMap[s.subject] !== undefined) {
      subjectStudyMap[s.subject] += s.durationMinutes;
    } else {
      subjectStudyMap[s.subject] = s.durationMinutes;
    }
  });

  const studySubjectChartData = Object.keys(subjectStudyMap).map((sub) => ({
    subject: sub,
    minutes: subjectStudyMap[sub],
    hours: Number((subjectStudyMap[sub] / 60).toFixed(1)),
  }));

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

      {/* NEET Subject Mastery Radar Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>NEET Subject Mastery Radar Profile</span>
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
                  360° Accuracy Balance
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Performance breakdown across Physics, Chemistry, Botany, and Zoology vs. Target Standard
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold">
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span>Your Score Accuracy (%)</span>
            </div>
            <div className="flex items-center space-x-1.5 text-indigo-400">
              <span className="w-3 h-3 rounded-full bg-indigo-400/50 border border-indigo-400 inline-block"></span>
              <span>Target Benchmark (85-90%)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Radar Chart Component */}
          <div className="lg:col-span-7 bg-slate-950/60 border border-slate-800 rounded-2xl p-4 h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarChartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis
                  dataKey="subject"
                  stroke="#cbd5e1"
                  tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 600 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(val: any, name: any) => [`${val}%`, name === 'accuracy' ? 'Your Accuracy' : 'Target Goal']}
                />
                <Radar
                  name="accuracy"
                  dataKey="accuracy"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.45}
                  strokeWidth={2}
                />
                <Radar
                  name="target"
                  dataKey="target"
                  stroke="#818cf8"
                  fill="#818cf8"
                  fillOpacity={0.15}
                  strokeDasharray="4 4"
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Subject Breakdown Cards */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">NEET Subject Benchmark Breakdown</h3>
            {radarChartData.map((item) => {
              const diff = Math.round(item.accuracy - item.target);
              const statusColor = item.accuracy >= item.target
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

              return (
                <div key={item.subject} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">{item.subject}</div>
                    <div className="text-[10px] text-slate-400">Target Benchmark: {item.target}% Accuracy</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-white">{item.accuracy}%</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColor} inline-block mt-0.5 font-semibold`}>
                      {diff >= 0 ? `+${diff}% Above Target` : `${diff}% Gap`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Pomodoro Deep-Work Session Analytics</h2>
              <p className="text-xs text-slate-400">Study hours logged & subject time allocation</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
              Total Hours: <span className="text-indigo-400 font-extrabold">{(totalStudyMinutes / 60).toFixed(1)} hrs</span>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
              Completed Blocks: <span className="text-emerald-400 font-extrabold">{studySessions.length}</span>
            </div>
          </div>
        </div>

        {/* Recharts Bar Chart: Study Hours per Subject */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Study Time Distribution by Subject (Minutes)</span>
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studySubjectChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(value: any) => [`${value} minutes`, 'Focus Duration']}
                  />
                  <Bar dataKey="minutes" fill="#818cf8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Subject Focus Breakdown */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Subject Allocation Summary</span>
            <div className="space-y-2 text-xs">
              {Object.keys(subjectStudyMap).map((sub) => {
                const mins = subjectStudyMap[sub];
                const pct = totalStudyMinutes > 0 ? Math.round((mins / totalStudyMinutes) * 100) : 0;
                return (
                  <div key={sub} className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-medium">
                      <span>{sub}</span>
                      <span className="text-indigo-400 font-bold">{mins}m ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Study Sessions Log Table */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recent Logged Focus Sessions</h3>
          {studySessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-3.5 py-2.5 rounded-l-xl">Subject</th>
                    <th className="px-3.5 py-2.5">Preset</th>
                    <th className="px-3.5 py-2.5">Duration</th>
                    <th className="px-3.5 py-2.5">Topic / Session Notes</th>
                    <th className="px-3.5 py-2.5">Date & Time</th>
                    {onDeleteSession && <th className="px-3.5 py-2.5 rounded-r-xl text-right">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {studySessions.map((session) => (
                    <tr key={session.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-3.5 py-3 font-bold text-indigo-300">{session.subject}</td>
                      <td className="px-3.5 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-semibold">
                          {session.mode}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 font-semibold text-emerald-400">{session.durationMinutes} mins</td>
                      <td className="px-3.5 py-3 text-slate-300">{session.notes || 'Routine Study Session'}</td>
                      <td className="px-3.5 py-3 text-slate-400">
                        {new Date(session.completedAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      {onDeleteSession && (
                        <td className="px-3.5 py-3 text-right">
                          <button
                            onClick={() => onDeleteSession(session.id)}
                            className="text-rose-400 hover:text-rose-300 font-medium text-[11px]"
                          >
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">No deep-work sessions logged yet. Use the Pomodoro timer on the Dashboard to start tracking!</p>
          )}
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
