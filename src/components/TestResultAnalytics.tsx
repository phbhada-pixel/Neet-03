import React, { useEffect, useState } from 'react';
import { MockTest, Question, TestResult, UserResponse } from '../types/neet';
import confetti from 'canvas-confetti';
import { Award, BookOpen, Brain, CheckCircle2, ChevronDown, ChevronUp, Clock, HelpCircle, Sparkles, Target, XCircle, Zap } from 'lucide-react';

interface TestResultAnalyticsProps {
  test: MockTest;
  result: TestResult;
  onRetakeTest: () => void;
  onGoHome: () => void;
  onAskDoubtAboutQuestion: (question: Question, userAnswer: number | null) => void;
}

export const TestResultAnalytics: React.FC<TestResultAnalyticsProps> = ({
  test,
  result,
  onRetakeTest,
  onGoHome,
  onAskDoubtAboutQuestion,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'incorrect' | 'unattempted' | 'correct'>('all');
  const [selectedAiQuestion, setSelectedAiQuestion] = useState<Question | null>(null);
  const [aiExplanationText, setAiExplanationText] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>('');

  // Confetti celebration on mount
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#14b8a6', '#6366f1', '#f59e0b'],
    });
  }, []);

  // Filter questions
  const filteredQuestions = test.questions.filter((q) => {
    const resp = result.userResponses[q.id];
    const isSelected = resp && resp.selectedOption !== null && resp.selectedOption !== undefined;
    const isCorrect = isSelected && resp.selectedOption === q.correctAnswer;

    if (filterType === 'correct') return isCorrect;
    if (filterType === 'incorrect') return isSelected && !isCorrect;
    if (filterType === 'unattempted') return !isSelected;
    return true;
  });

  // Call AI Endpoint for Detailed Explanation
  const handleFetchAiExplanation = async (q: Question) => {
    setSelectedAiQuestion(q);
    setIsAiLoading(true);
    setAiError('');
    setAiExplanationText('');

    const resp = result.userResponses[q.id];
    const userOption = resp && resp.selectedOption !== null ? ['A', 'B', 'C', 'D'][resp.selectedOption] : 'Unattempted';
    const correctOption = ['A', 'B', 'C', 'D'][q.correctAnswer];

    try {
      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.question,
          options: q.options,
          correctAnswer: correctOption,
          subject: q.subject,
          topic: q.topic,
          userAnswer: userOption,
        }),
      });

      const data = await res.json();
      if (data.explanation) {
        setAiExplanationText(data.explanation);
      } else {
        setAiError(data.error || 'Failed to fetch AI explanation.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Error connecting to AI Explanation service.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 text-white">
      
      {/* Top Banner & Scorecard */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Mock Test Scorecard Generated</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{test.title}</h1>
              <p className="text-slate-300 text-xs mt-1">
                Completed on {new Date(result.completedAt).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onRetakeTest}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
              >
                Retake Test
              </button>

              <button
                onClick={onGoHome}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
              >
                Go to Dashboard
              </button>
            </div>
          </div>

          {/* Core Scorecard Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            
            {/* Total Marks */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-slate-400 text-xs uppercase font-semibold">Total Score</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
                {result.totalScore} <span className="text-xs text-slate-400 font-normal">/ {result.maxMarks}</span>
              </div>
              <p className="text-[11px] text-emerald-400/80 mt-1 font-medium">
                {Math.round((result.totalScore / result.maxMarks) * 100)}% Performance
              </p>
            </div>

            {/* Accuracy */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-slate-400 text-xs uppercase font-semibold">Accuracy</span>
              <div className="text-2xl sm:text-3xl font-black text-teal-300 mt-1">
                {result.accuracy}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {result.correctCount} Correct / {result.incorrectCount} Incorrect
              </p>
            </div>

            {/* Estimated Rank */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-slate-400 text-xs uppercase font-semibold">Projected AIR Tier</span>
              <div className="text-sm sm:text-base font-extrabold text-amber-300 mt-2 truncate">
                {result.estimatedRankTier}
              </div>
              <p className="text-[11px] text-amber-400/80 mt-1 font-semibold">
                Percentile ~{result.estimatedPercentile}%
              </p>
            </div>

            {/* Time Taken */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-slate-400 text-xs uppercase font-semibold">Time Spent</span>
              <div className="text-2xl sm:text-3xl font-black text-indigo-300 mt-1">
                {Math.floor(result.totalTimeSeconds / 60)}m {result.totalTimeSeconds % 60}s
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Avg {Math.round(result.totalTimeSeconds / (test.questions.length || 1))}s / Q
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Subject Wise Performance Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <span>Subject Breakdown (+4 / -1 Scheme)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.entries(result.subjectResults) as [string, any][]).map(([subName, res]) => (
            <div key={subName} className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-200">{subName}</span>
                <span className="text-xs font-extrabold text-emerald-400">{res.score} Marks</span>
              </div>

              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${Math.max(0, Math.min(100, (res.score / (res.maxMarks || 1)) * 100))}%` }}
                />
              </div>

              <div className="grid grid-cols-3 text-[11px] text-slate-400 text-center pt-1">
                <div>
                  <span className="block text-emerald-400 font-bold">{res.correct}</span>
                  <span>Correct</span>
                </div>
                <div>
                  <span className="block text-rose-400 font-bold">{res.incorrect}</span>
                  <span>Wrong</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold">{res.unattempted}</span>
                  <span>Left</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question Solutions & AI Step-by-step Review */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              <span>Question Solutions & NCERT References</span>
            </h2>
            <p className="text-xs text-slate-400">Review answers with step-by-step NCERT explanations</p>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-1.5 bg-slate-800 p-1 rounded-xl">
            {(['all', 'incorrect', 'unattempted', 'correct'] as const).map((ft) => (
              <button
                key={ft}
                onClick={() => setFilterType(ft)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  filterType === ft
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {ft}
              </button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const resp = result.userResponses[q.id];
            const isSelected = resp && resp.selectedOption !== null && resp.selectedOption !== undefined;
            const isCorrect = isSelected && resp.selectedOption === q.correctAnswer;
            const userChoiceText = isSelected ? q.options[resp.selectedOption!] : 'Unattempted';
            const correctChoiceText = q.options[q.correctAnswer];

            return (
              <div
                key={q.id}
                className={`border rounded-2xl p-5 space-y-4 transition-all ${
                  isCorrect
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : isSelected
                    ? 'bg-rose-500/5 border-rose-500/30'
                    : 'bg-slate-800/40 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-bold">
                        Q{idx + 1} • {q.subject} ({q.section})
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{q.topic}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-100 pt-1">{q.question}</p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isCorrect ? (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>+4 Marks</span>
                      </span>
                    ) : isSelected ? (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>-1 Mark</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold border border-slate-700">
                        <span>0 Marks</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Options Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, oIdx) => {
                    const isUserPick = resp && resp.selectedOption === oIdx;
                    const isRightPick = oIdx === q.correctAnswer;

                    let optBg = "bg-slate-800/50 border-slate-700 text-slate-300";
                    if (isRightPick) optBg = "bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-bold";
                    else if (isUserPick) optBg = "bg-rose-500/20 border-rose-500/60 text-rose-200 font-bold";

                    return (
                      <div key={oIdx} className={`p-2.5 rounded-xl border flex items-center justify-between ${optBg}`}>
                        <span>{['A', 'B', 'C', 'D'][oIdx]}. {opt}</span>
                        {isRightPick && <span className="text-[10px] uppercase font-extrabold text-emerald-400">Correct</span>}
                        {isUserPick && !isRightPick && <span className="text-[10px] uppercase font-extrabold text-rose-400">Your Pick</span>}
                      </div>
                    );
                  })}
                </div>

                {/* NCERT Explanation Box */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
                  <div className="font-bold text-emerald-400 flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>NCERT Reference Solution:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">{q.explanation}</p>
                  <p className="text-[11px] text-slate-400 font-mono pt-1">{q.ncertReference}</p>
                </div>

                {/* AI Explanation CTA */}
                <div className="flex items-center space-x-3 pt-1">
                  <button
                    onClick={() => handleFetchAiExplanation(q)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-colors flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Get AI Step-by-Step Explanation</span>
                  </button>

                  <button
                    onClick={() => onAskDoubtAboutQuestion(q, resp ? resp.selectedOption : null)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center space-x-1.5"
                  >
                    <Brain className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ask AI Tutor</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* AI Explanation Modal */}
      {selectedAiQuestion && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-indigo-400 text-sm font-bold">
                <Sparkles className="w-5 h-5" />
                <span>AI NCERT Master Solution</span>
              </div>

              <button
                onClick={() => setSelectedAiQuestion(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            <div className="text-sm font-semibold text-white">
              {selectedAiQuestion.question}
            </div>

            {isAiLoading ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-indigo-300 font-medium">Generating step-by-step NCERT explanation with Gemini AI...</p>
              </div>
            ) : aiError ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {aiError}
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 leading-relaxed space-y-2 whitespace-pre-line">
                {aiExplanationText}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
