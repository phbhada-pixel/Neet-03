import React, { useState } from 'react';
import { MockTest } from '../types/neet';
import { Award, Clock, HelpCircle, Filter, Play, Search, Sparkles, Target, Zap } from 'lucide-react';

interface DailyMockTestListProps {
  mockTests: MockTest[];
  onStartTest: (test: MockTest) => void;
}

export const DailyMockTestList: React.FC<DailyMockTestListProps> = ({
  mockTests,
  onStartTest,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Daily Mock', 'Full NEET 720', 'Subject Speed Test'];

  const filteredTests = mockTests.filter((test) => {
    const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory;
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
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
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

      </div>

      {/* Test Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTests.map((test) => (
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
              <div className="flex items-center space-x-2 pt-1">
                <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-semibold uppercase">
                  {test.category}
                </span>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
                  test.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                  test.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {test.difficulty} Difficulty
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

              {/* Subject Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(Object.entries(test.subjectDistribution) as [string, number][]).map(([sub, count]) => count > 0 && (
                  <span key={sub} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-medium text-slate-300 border border-slate-700/60">
                    {sub}: {count} Qs
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between gap-4">
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
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Test</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
