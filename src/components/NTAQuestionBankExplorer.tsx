import React, { useState, useEffect } from 'react';
import { Question, MockTest } from '../types/neet';
import {
  BookOpen,
  Database,
  Filter,
  Play,
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Layers,
  Award
} from 'lucide-react';

interface NTAQuestionBankExplorerProps {
  onStartTest: (test: MockTest) => void;
}

export const NTAQuestionBankExplorer: React.FC<NTAQuestionBankExplorerProps> = ({ onStartTest }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Filters
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // State for expanded answer reveals
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  // Generating custom test state
  const [isGeneratingTest, setIsGeneratingTest] = useState<boolean>(false);

  // Fetch NTA questions from backend API
  const fetchNTAQuestions = async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (selectedSubject !== 'All') params.append('subject', selectedSubject);
      if (selectedDifficulty !== 'All') params.append('difficulty', selectedDifficulty);
      if (selectedYear !== 'All') params.append('pyqYear', selectedYear);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      params.append('limit', '30');

      const res = await fetch(`/api/nta-neet/questions?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch from NTA Question Bank API.');
      }
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err: any) {
      console.error('Error loading NTA Question Bank:', err);
      setError(err.message || 'Error connecting to NTA Question Bank API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNTAQuestions();
  }, [selectedSubject, selectedDifficulty, selectedYear]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNTAQuestions();
  };

  const toggleRevealAnswer = (qId: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Generate Custom NTA Test via API
  const handleCreateApiTest = async () => {
    setIsGeneratingTest(true);
    try {
      const res = await fetch('/api/nta-neet/generate-mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          questionCount: 10,
          durationMinutes: 15,
          title: `NTA NEET ${selectedSubject === 'All' ? 'UG Full' : selectedSubject} Speed Test`,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate test from NTA API.');
      }

      const data = await res.json();
      if (data.test) {
        onStartTest(data.test);
      }
    } catch (err: any) {
      alert('Error creating test paper from NTA API: ' + err.message);
    } finally {
      setIsGeneratingTest(false);
    }
  };

  return (
    <div className="space-y-6 text-white pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>NTA NEET Official Question Bank API</span>
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Live Sync Ready</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            NTA NEET Question Bank Explorer
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Direct access to official NTA NEET UG question patterns, NCERT textbook references, previous year question (PYQ) trends, and AI-augmented practice problem sets.
          </p>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCreateApiTest}
            disabled={isGeneratingTest}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 border border-emerald-400/40"
          >
            {isGeneratingTest ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Play className="w-4 h-4 text-white fill-white" />
            )}
            <span>{isGeneratingTest ? 'Building Test Paper...' : 'Launch NTA Test from API'}</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Keyword Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NCERT concepts, topics (e.g., Kinematics, Iodoform, SER)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-20 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition-all"
            >
              Search
            </button>
          </form>

          {/* Select Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Subject Select */}
            <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
              <span className="text-slate-400 font-medium">Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900 text-white">All Subjects</option>
                <option value="Physics" className="bg-slate-900 text-white">Physics</option>
                <option value="Chemistry" className="bg-slate-900 text-white">Chemistry</option>
                <option value="Botany" className="bg-slate-900 text-white">Botany</option>
                <option value="Zoology" className="bg-slate-900 text-white">Zoology</option>
              </select>
            </div>

            {/* PYQ Year Select */}
            <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
              <span className="text-slate-400 font-medium">PYQ Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent text-indigo-400 font-bold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900 text-white">All Years</option>
                <option value="2024" className="bg-slate-900 text-white">2024 PYQ</option>
                <option value="2023" className="bg-slate-900 text-white">2023 PYQ</option>
                <option value="2022" className="bg-slate-900 text-white">2022 PYQ</option>
                <option value="2021" className="bg-slate-900 text-white">2021 PYQ</option>
              </select>
            </div>

            {/* Difficulty Select */}
            <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
              <span className="text-slate-400 font-medium">Level:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-transparent text-amber-400 font-bold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900 text-white">All Levels</option>
                <option value="Easy" className="bg-slate-900 text-white">Easy (NCERT Recall)</option>
                <option value="Medium" className="bg-slate-900 text-white">Medium (Formula Application)</option>
                <option value="Hard" className="bg-slate-900 text-white">Hard (Assertion-Reason)</option>
              </select>
            </div>

            <button
              onClick={fetchNTAQuestions}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              title="Refresh questions from NTA API"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Questions Feed */}
      {isLoading ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
          <p className="text-slate-300 text-sm font-semibold">
            Querying NTA NEET Question Bank API...
          </p>
        </div>
      ) : error ? (
        <div className="bg-rose-950/40 border border-rose-800/60 rounded-3xl p-6 text-center text-rose-300 text-xs">
          {error}
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-2">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-white font-bold text-sm">No questions matched the selected filters.</p>
          <p className="text-slate-400 text-xs">Try selecting 'All Subjects' or clearing your search term.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
            <span>Showing {questions.length} NTA Question Bank items</span>
            <span className="text-emerald-400 flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Standard +4 / -1 NTA Marking Scheme</span>
            </span>
          </div>

          {questions.map((q, idx) => {
            const isRevealed = revealedAnswers[q.id];

            return (
              <div
                key={q.id || idx}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 transition-all shadow-md"
              >
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-extrabold uppercase">
                      Q{idx + 1} • {q.subject}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold">
                      {q.chapter || q.topic}
                    </span>
                    {q.pyqYear && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        NEET {q.pyqYear} PYQ
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                    {q.difficulty || 'Medium'}
                  </span>
                </div>

                {/* Question Text */}
                <h3 className="text-sm font-bold text-white leading-relaxed">
                  {q.question}
                </h3>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, oIdx) => {
                    const isCorrect = isRevealed && oIdx === q.correctAnswer;

                    return (
                      <div
                        key={oIdx}
                        className={`p-3 rounded-xl border transition-all flex items-start space-x-2.5 ${
                          isCorrect
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold shadow-sm'
                            : 'bg-slate-950/80 border-slate-800/80 text-slate-300'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-[10px] font-black text-slate-300">
                          {['A', 'B', 'C', 'D'][oIdx]}
                        </span>
                        <span className="leading-snug pt-0.5">{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Controls / NCERT Explanation */}
                <div className="pt-2 border-t border-slate-800/60 flex flex-col space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px] italic">
                      {q.ncertReference || 'NCERT Class 11/12 Alignment'}
                    </span>

                    <button
                      onClick={() => toggleRevealAnswer(q.id)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-[11px] font-bold transition-all flex items-center space-x-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{isRevealed ? 'Hide Solution' : 'Reveal Solution & NCERT Note'}</span>
                    </button>
                  </div>

                  {isRevealed && (
                    <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 space-y-2 text-emerald-100 animate-fadeIn">
                      <div className="flex items-center space-x-1.5 font-bold text-emerald-400 text-[11px] uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Correct Option: Option {['A', 'B', 'C', 'D'][q.correctAnswer]}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-200">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
