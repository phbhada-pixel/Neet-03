import React, { useState } from 'react';
import { MockTest, Question } from '../types/neet';
import { Award, Layers, Clock, HelpCircle, Filter, Play, Search, Sparkles, Target, Zap, BarChart2 } from 'lucide-react';

interface DailyMockTestListProps {
  mockTests: MockTest[];
  onStartTest: (test: MockTest) => void;
}

export type TaxonomyLevel = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';

// Helper to map difficulty rating to Taxonomy Level
export function getTestTaxonomyLevel(test: MockTest): 'Beginner' | 'Intermediate' | 'Advanced' {
  if (test.difficulty === 'Easy') return 'Beginner';
  if (test.difficulty === 'Hard') return 'Advanced';
  return 'Intermediate';
}

// Analyze question set taxonomy composition
export function getQuestionTaxonomyBreakdown(questions: Question[]) {
  if (!questions || questions.length === 0) {
    return { beginnerPct: 40, intermediatePct: 40, advancedPct: 20 };
  }
  let beginnerCount = 0;
  let intermediateCount = 0;
  let advancedCount = 0;

  questions.forEach((q) => {
    const len = q.question.length + (q.explanation?.length || 0);
    const isAssertion = q.isAssertionReason || q.question.toLowerCase().includes('assertion') || q.question.toLowerCase().includes('reason');
    const isNumerical = q.question.includes('=') || Boolean(q.question.match(/\d+\s*(m\/s|J|M|S cm|K|Hz|mV|%)/));

    if (isAssertion || (isNumerical && len > 200)) {
      advancedCount++;
    } else if (isNumerical || len > 140) {
      intermediateCount++;
    } else {
      beginnerCount++;
    }
  });

  const total = questions.length;
  return {
    beginnerPct: Math.round((beginnerCount / total) * 100),
    intermediatePct: Math.round((intermediateCount / total) * 100),
    advancedPct: Math.round((advancedCount / total) * 100),
  };
}

export const DailyMockTestList: React.FC<DailyMockTestListProps> = ({
  mockTests,
  onStartTest,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<TaxonomyLevel>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Daily Mock', 'Full NEET 720', 'Subject Speed Test'];

  const taxonomyLevels: Array<{ key: TaxonomyLevel; label: string; desc: string; badgeColor: string }> = [
    { key: 'All', label: 'All Levels', desc: 'All NEET test papers', badgeColor: 'border-slate-700 bg-slate-800 text-slate-300' },
    { key: 'Beginner', label: 'Beginner', desc: 'Direct NCERT line-by-line recall', badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
    { key: 'Intermediate', label: 'Intermediate', desc: 'Single-step numericals & formulas', badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
    { key: 'Advanced', label: 'Advanced', desc: 'Multi-concept NTA grand mocks', badgeColor: 'border-rose-500/40 bg-rose-500/10 text-rose-300' },
  ];

  const filteredTests = mockTests.filter((test) => {
    const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory;
    const testTaxonomy = getTestTaxonomyLevel(test);
    const matchesDifficulty = selectedDifficulty === 'All' || testTaxonomy === selectedDifficulty;
    const matchesSearch =
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 text-white">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Target className="w-4 h-4" />
            <span>NTA NEET UG Exam Series</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Daily Mock Tests & NTA Simulators</h1>
          <p className="text-slate-400 text-sm mt-1">
            Standardised timed practice tests mapped to NCERT Class 11 & 12 Syllabus with +4/-1 marking.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-2xl">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Fresh Daily Tests Released</span>
        </div>
      </div>

      {/* Main Filter Control Panel */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-4">
        
        {/* Category & Search Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search mock tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

        </div>

        {/* Difficulty Level Taxonomy Filter Toggle */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Question Taxonomy Level:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {taxonomyLevels.map((lvl) => {
              const isSelected = selectedDifficulty === lvl.key;
              const count = mockTests.filter((t) => {
                const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
                const matchLvl = lvl.key === 'All' || getTestTaxonomyLevel(t) === lvl.key;
                return matchCat && matchLvl;
              }).length;

              return (
                <button
                  key={lvl.key}
                  onClick={() => setSelectedDifficulty(lvl.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                    isSelected
                      ? `${lvl.badgeColor} shadow-md ring-1 ring-emerald-500/50`
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span>{lvl.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-black/30' : 'bg-slate-800 text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Test Cards Grid */}
      {filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTests.map((test) => {
            const taxonomyLevel = getTestTaxonomyLevel(test);
            const breakdown = getQuestionTaxonomyBreakdown(test.questions);

            return (
              <div
                key={test.id}
                className={`relative overflow-hidden bg-slate-900/90 border transition-all duration-300 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-xl ${
                  test.isDailySpecial ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5' : 'border-slate-800'
                }`}
              >
                {test.isDailySpecial && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-600 text-white text-[10px] font-extrabold px-4 py-1 rounded-bl-2xl uppercase tracking-wider flex items-center space-x-1">
                    <Zap className="w-3 h-3 fill-white" />
                    <span>Today's Daily Special</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Category & Taxonomy Level Badges */}
                  <div className="flex items-center space-x-2 pt-1 flex-wrap gap-y-1">
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-semibold uppercase">
                      {test.category}
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        taxonomyLevel === 'Beginner'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : taxonomyLevel === 'Intermediate'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {taxonomyLevel} Level Taxonomy
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white hover:text-emerald-400 transition-colors">
                      {test.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed mt-1 line-clamp-2">
                      {test.description}
                    </p>
                  </div>

                  {/* Taxonomy Composition Progress Indicator */}
                  <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      <span className="flex items-center space-x-1">
                        <BarChart2 className="w-3 h-3 text-indigo-400" />
                        <span>Question Taxonomy Mix</span>
                      </span>
                      <span className="text-slate-300">
                        {breakdown.beginnerPct}% Beg • {breakdown.intermediatePct}% Int • {breakdown.advancedPct}% Adv
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full" style={{ width: `${breakdown.beginnerPct}%` }} title="Beginner Questions" />
                      <div className="bg-amber-400 h-full" style={{ width: `${breakdown.intermediatePct}%` }} title="Intermediate Questions" />
                      <div className="bg-rose-500 h-full" style={{ width: `${breakdown.advancedPct}%` }} title="Advanced Questions" />
                    </div>
                  </div>

                  {/* Subject Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(Object.entries(test.subjectDistribution) as [string, number][]).map(
                      ([sub, count]) =>
                        count > 0 && (
                          <span
                            key={sub}
                            className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-medium text-slate-300 border border-slate-700/60"
                          >
                            {sub}: {count} Qs
                          </span>
                        )
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{test.durationMinutes} mins</span>
                    </span>

                    <span className="flex items-center space-x-1">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>{test.totalQuestions} Qs</span>
                    </span>

                    <span className="flex items-center space-x-1 font-bold text-emerald-400">
                      <Award className="w-3.5 h-3.5" />
                      <span>{test.totalMarks} M</span>
                    </span>
                  </div>

                  <button
                    onClick={() => onStartTest(test)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Start Test</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="p-3 bg-slate-800 w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-slate-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Mock Tests Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No mock tests matched your current filter criteria for "{selectedCategory}" and taxonomy level "{selectedDifficulty}".
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedDifficulty('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-slate-700 transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </div>
  );
};

