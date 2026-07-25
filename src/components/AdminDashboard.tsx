import React, { useState } from 'react';
import { MockTest, Subject } from '../types/neet';
import {
  Activity,
  AlertCircle,
  Award,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Database,
  Edit3,
  FileText,
  Filter,
  Plus,
  PlusCircle,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Sliders,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

interface AdminDashboardProps {
  mockTests: MockTest[];
  onAddMockTest?: (newTest: MockTest) => void;
  onNavigateTab: (tab: 'dashboard' | 'tests' | 'analytics' | 'ai-tutor' | 'flashcards' | 'admin') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  mockTests,
  onAddMockTest,
  onNavigateTab,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'tests' | 'questions' | 'settings'>('overview');
  
  // Test creation modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'Daily Mock' | 'Full NEET 720' | 'Subject Speed Test'>('Daily Mock');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [newDuration, setNewDuration] = useState<number>(180);
  const [newDescription, setNewDescription] = useState<string>('');

  // Search & filter for questions / tests
  const [testSearch, setTestSearch] = useState<string>('');
  const [questionSubject, setQuestionSubject] = useState<string>('All');

  // Platform setting states
  const [aiTutorStatus, setAiTutorStatus] = useState<boolean>(true);
  const [dailyAutoRelease, setDailyAutoRelease] = useState<boolean>(true);
  const [physicsWeight, setPhysicsWeight] = useState<number>(25);
  const [chemistryWeight, setChemistryWeight] = useState<number>(25);
  const [botanyWeight, setBotanyWeight] = useState<number>(25);
  const [zoologyWeight, setZoologyWeight] = useState<number>(25);

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const createdTest: MockTest = {
      id: `custom-test-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim() || 'Custom administrator-curated NEET 2026 practice paper.',
      category: newCategory,
      difficulty: newDifficulty,
      date: new Date().toISOString().split('T')[0],
      durationMinutes: Number(newDuration),
      totalQuestions: 180,
      totalMarks: 720,
      subjectDistribution: {
        Physics: 45,
        Chemistry: 45,
        Botany: 45,
        Zoology: 45,
      },
      isDailySpecial: false,
      questions: [],
    };

    if (onAddMockTest) {
      onAddMockTest(createdTest);
    }

    setNewTitle('');
    setNewDescription('');
    setShowAddModal(false);
  };

  const filteredTestsList = mockTests.filter(
    (t) =>
      t.title.toLowerCase().includes(testSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(testSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 text-white">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>NTA Control Console</span>
              </span>
              <span className="text-xs text-slate-400">NEET Prep Master Admin v2.6</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Administrator Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Manage NTA 2026 mock test papers, monitor cohort performance metrics, configure question taxonomy algorithms, and manage platform settings.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create NTA Mock Test</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex items-center space-x-2 pt-6 mt-6 border-t border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeAdminTab === 'overview'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Cohort Overview</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('tests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeAdminTab === 'tests'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Test Papers ({mockTests.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('questions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeAdminTab === 'questions'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>NCERT Question Bank</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeAdminTab === 'settings'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Platform Controls</span>
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Admin Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                <span>Active Aspirants</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">14,280</div>
              <p className="text-[11px] text-emerald-400 font-medium">+12.4% active study cohort</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                <span>Tests Conducted</span>
                <FileText className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white">82,450</div>
              <p className="text-[11px] text-indigo-400 font-medium">{mockTests.length} Live NTA Mocks</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                <span>Platform Avg Score</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-300">542 / 720</div>
              <p className="text-[11px] text-slate-400">Cutoff target: 615+ Marks</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                <span>Logged Deep Work</span>
                <Clock className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-black text-white">24,190 <span className="text-xs font-normal text-slate-400">hrs</span></div>
              <p className="text-[11px] text-rose-400 font-medium">Pomodoro Timer sessions</p>
            </div>
          </div>

          {/* System Health & Release Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span>Platform Operations & System Health</span>
                </h3>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/40">
                  All Systems Operational
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="font-bold text-white">Gemini 1.5 Flash AI Doubt Solver Endpoint</div>
                      <div className="text-slate-400">Average response latency: 420ms • 99.98% uptime</div>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-bold">Active</span>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="font-bold text-white">NTA 720 Standard Marking Engine</div>
                      <div className="text-slate-400">+4 Correct / -1 Incorrect answer evaluation pipeline</div>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-bold">Active</span>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="font-bold text-white">Pomodoro Deep-Work Analytics Sync</div>
                      <div className="text-slate-400">LocalStorage persistence & session logging engine</div>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-bold">Active</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>Admin Quick Actions</span>
              </h3>

              <div className="space-y-2.5">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-between transition-all"
                >
                  <span className="flex items-center space-x-2">
                    <PlusCircle className="w-4 h-4 text-emerald-400" />
                    <span>Publish Daily NTA Paper</span>
                  </span>
                  <span className="text-slate-400">→</span>
                </button>

                <button
                  onClick={() => setActiveAdminTab('questions')}
                  className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-between transition-all"
                >
                  <span className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-indigo-400" />
                    <span>Manage NCERT Database</span>
                  </span>
                  <span className="text-slate-400">→</span>
                </button>

                <button
                  onClick={() => onNavigateTab('analytics')}
                  className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-between transition-all"
                >
                  <span className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    <span>View Student Radar Profiles</span>
                  </span>
                  <span className="text-slate-400">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TESTS TAB */}
      {activeAdminTab === 'tests' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">NTA Mock Test Management</h2>
              <p className="text-xs text-slate-400">Curate papers, adjust time limits, and publish daily special tests</p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter test papers..."
                  value={testSearch}
                  onChange={(e) => setTestSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>New Test</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Test Paper Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3">Questions</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filteredTestsList.map((test) => (
                  <tr key={test.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-white">
                      <div>{test.title}</div>
                      <div className="text-[10px] text-slate-400 font-normal line-clamp-1">{test.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-semibold">
                        {test.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        test.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        test.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {test.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold">{test.totalQuestions} Qs</td>
                    <td className="px-4 py-3 font-semibold text-emerald-400">{test.durationMinutes} mins</td>
                    <td className="px-4 py-3">
                      {test.isDailySpecial ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                          Daily Special
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-medium">
                          Published
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => onNavigateTab('tests')}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] font-medium border border-slate-700"
                      >
                        Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUESTIONS TAB */}
      {activeAdminTab === 'questions' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">NCERT Question Bank Repository</h2>
              <p className="text-xs text-slate-400">Class 11 & Class 12 NCERT line-by-line questions with Assertion-Reason taxonomy</p>
            </div>

            <div className="flex items-center space-x-2">
              {['All', 'Physics', 'Chemistry', 'Botany', 'Zoology'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setQuestionSubject(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    questionSubject === sub
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 uppercase">
                  Physics • High Yield
                </span>
                <span className="text-[10px] text-slate-400">NCERT Vol I - Ch 7</span>
              </div>
              <h4 className="text-xs font-bold text-white">
                What is the moment of inertia of a uniform solid sphere of mass M and radius R about its tangent?
              </h4>
              <p className="text-[11px] text-slate-400">Options: (A) 2/5 MR² (B) 7/5 MR² (C) 3/5 MR² (D) 5/3 MR²</p>
              <div className="pt-2 flex items-center justify-between text-[10px] text-emerald-400 font-semibold border-t border-slate-800/80">
                <span>Correct: Option B (7/5 MR²)</span>
                <span className="text-slate-500">Assertion-Reason Tagged</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase">
                  Botany • NCERT Line
                </span>
                <span className="text-[10px] text-slate-400">NCERT Vol I - Ch 13</span>
              </div>
              <h4 className="text-xs font-bold text-white">
                In C4 plants, the primary CO2 acceptor molecule present in bundle sheath cells is PEP Case or RuBisCO?
              </h4>
              <p className="text-[11px] text-slate-400">Options: (A) RuBisCO (B) PEP Case (C) OAA (D) RuBP</p>
              <div className="pt-2 flex items-center justify-between text-[10px] text-emerald-400 font-semibold border-t border-slate-800/80">
                <span>Correct: Option A (RuBisCO)</span>
                <span className="text-slate-500">NCERT Diagram Tagged</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 uppercase">
                  Chemistry • Organic Mechanism
                </span>
                <span className="text-[10px] text-slate-400">NCERT Vol II - Ch 10</span>
              </div>
              <h4 className="text-xs font-bold text-white">
                Which among the following alkyl halides undergoes nucleophilic substitution via SN1 mechanism fastest?
              </h4>
              <p className="text-[11px] text-slate-400">Options: (A) CH3Cl (B) (CH3)3CCl (C) CH3CH2Cl (D) (CH3)2CHCl</p>
              <div className="pt-2 flex items-center justify-between text-[10px] text-emerald-400 font-semibold border-t border-slate-800/80">
                <span>Correct: Option B ((CH3)3CCl)</span>
                <span className="text-slate-500">High-Yield NTA Drills</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/30 uppercase">
                  Zoology • Human Physiology
                </span>
                <span className="text-[10px] text-slate-400">NCERT Vol I - Ch 18</span>
              </div>
              <h4 className="text-xs font-bold text-white">
                During cardiac cycle, the P-wave in standard ECG represents which mechanical event?
              </h4>
              <p className="text-[11px] text-slate-400">Options: (A) Atrial Repolarisation (B) Depolarisation of Atria (C) Ventricular Systole (D) Joint Diastole</p>
              <div className="pt-2 flex items-center justify-between text-[10px] text-emerald-400 font-semibold border-t border-slate-800/80">
                <span>Correct: Option B (Depolarisation of Atria)</span>
                <span className="text-slate-500">ECG Diagram Question</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeAdminTab === 'settings' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">NTA Syllabus Weighting & Feature Controls</h2>
            <p className="text-xs text-slate-400">Adjust NTA mock test generation weighting and platform system settings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature Toggles */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Feature Services Status</span>
              </h3>

              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">AI Doubt Solver (Gemini 1.5)</div>
                  <div className="text-[11px] text-slate-400">Allow instant student doubt resolution</div>
                </div>
                <button
                  onClick={() => setAiTutorStatus(!aiTutorStatus)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${aiTutorStatus ? 'bg-emerald-500' : 'bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${aiTutorStatus ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-xs font-bold text-white">Daily Auto Release Paper at 06:00 IST</div>
                  <div className="text-[11px] text-slate-400">Schedule automatic daily special NTA mock tests</div>
                </div>
                <button
                  onClick={() => setDailyAutoRelease(!dailyAutoRelease)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${dailyAutoRelease ? 'bg-emerald-500' : 'bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${dailyAutoRelease ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* Subject Distribution Sliders */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>NTA Subject Mark Weighting Ratio</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-medium text-slate-300 mb-1">
                    <span>Physics (180 Marks)</span>
                    <span className="text-emerald-400 font-bold">{physicsWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    value={physicsWeight}
                    onChange={(e) => setPhysicsWeight(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-medium text-slate-300 mb-1">
                    <span>Chemistry (180 Marks)</span>
                    <span className="text-emerald-400 font-bold">{chemistryWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    value={chemistryWeight}
                    onChange={(e) => setChemistryWeight(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-medium text-slate-300 mb-1">
                    <span>Botany (180 Marks)</span>
                    <span className="text-emerald-400 font-bold">{botanyWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    value={botanyWeight}
                    onChange={(e) => setBotanyWeight(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-medium text-slate-300 mb-1">
                    <span>Zoology (180 Marks)</span>
                    <span className="text-emerald-400 font-bold">{zoologyWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    value={zoologyWeight}
                    onChange={(e) => setZoologyWeight(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE TEST MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                <span>Create New NTA Mock Test</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Test Paper Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., NTA Grand Test #12 - Full 720 Marks"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Daily Mock">Daily Mock</option>
                    <option value="Full NEET 720">Full NEET 720</option>
                    <option value="Subject Speed Test">Subject Speed Test</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e: any) => setNewDifficulty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Easy">Easy (Beginner)</option>
                    <option value="Medium">Medium (Intermediate)</option>
                    <option value="Hard">Hard (Advanced)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Duration (Minutes)</label>
                <input
                  type="number"
                  min="30"
                  max="200"
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Description / Coverage Notes</label>
                <textarea
                  rows={3}
                  placeholder="Comprehensive coverage of NCERT Class 11 & Class 12 high-yield NEET syllabus..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                >
                  Publish Test Paper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
