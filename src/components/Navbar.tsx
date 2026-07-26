import React from 'react';
import { Award, BookOpen, Database, Flame, LayoutDashboard, LineChart, MessageSquareCode, ShieldCheck, Target, Zap } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'tests' | 'question-bank' | 'analytics' | 'ai-tutor' | 'flashcards' | 'admin';
  setActiveTab: (tab: 'dashboard' | 'tests' | 'question-bank' | 'analytics' | 'ai-tutor' | 'flashcards' | 'admin') => void;
  streakDays: number;
  averageScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  streakDays,
  averageScore,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  NEET Prep Master
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                  NTA 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Standardised Prep & Daily Mock Tests</p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'tests'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Mock Tests</span>
            </button>

            <button
              onClick={() => setActiveTab('question-bank')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'question-bank'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-4 h-4 text-teal-400" />
              <span>NTA Question Bank</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LineChart className="w-4 h-4" />
              <span>Performance Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-tutor')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'ai-tutor'
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MessageSquareCode className="w-4 h-4 text-indigo-400" />
              <span>AI Doubt Solver</span>
            </button>

            <button
              onClick={() => setActiveTab('flashcards')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'flashcards'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>NCERT Revision</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Right Badges & Stats */}
          <div className="flex items-center space-x-3">
            {/* Streak Badge */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{streakDays} Day Streak</span>
            </div>

            {/* Average Score Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Award className="w-4 h-4" />
              <span>Avg: {averageScore} / 720</span>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Tab Navigation bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-900 border-t border-slate-800 px-2 py-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 text-xs font-medium ${
            activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-1" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`flex flex-col items-center py-1 px-2 text-xs font-medium ${
            activeTab === 'tests' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Target className="w-4 h-4 mb-1" />
          <span>Mock Tests</span>
        </button>

        <button
          onClick={() => setActiveTab('question-bank')}
          className={`flex flex-col items-center py-1 px-2 text-xs font-medium ${
            activeTab === 'question-bank' ? 'text-teal-400' : 'text-slate-400'
          }`}
        >
          <Database className="w-4 h-4 mb-1" />
          <span>Q-Bank</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center py-1 px-2 text-xs font-medium ${
            activeTab === 'analytics' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <LineChart className="w-4 h-4 mb-1" />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-tutor')}
          className={`flex flex-col items-center py-1 px-2 text-xs font-medium ${
            activeTab === 'ai-tutor' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <MessageSquareCode className="w-4 h-4 mb-1" />
          <span>AI Doubt</span>
        </button>

        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex flex-col items-center py-1 px-2 text-xs font-medium ${
            activeTab === 'flashcards' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-1" />
          <span>NCERT</span>
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center py-1 px-2 text-xs font-medium ${
            activeTab === 'admin' ? 'text-purple-400' : 'text-slate-400'
          }`}
        >
          <ShieldCheck className="w-4 h-4 mb-1" />
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
};
