import React, { useEffect, useState } from 'react';
import { MockTest, Question, Subject, TestSection, UserResponse } from '../types/neet';
import { neetQuestionBank } from '../data/neetQuestions';
import { AlertCircle, Bookmark, Check, ChevronLeft, ChevronRight, Clock, HelpCircle, LayoutGrid, RotateCcw, Save, Send, X } from 'lucide-react';

interface TestSimulatorProps {
  test: MockTest;
  onSubmitTest: (responses: Record<string, UserResponse>, totalTimeSpentSeconds: number) => void;
  onCancelTest: () => void;
}

export const TestSimulator: React.FC<TestSimulatorProps> = ({
  test,
  onSubmitTest,
  onCancelTest,
}) => {
  // Ensure test.questions is populated even if passed an empty test paper
  const activeQuestions = (test.questions && test.questions.length > 0) ? test.questions : neetQuestionBank;

  const [activeSubject, setActiveSubject] = useState<Subject>('Physics');
  const [activeSection, setActiveSection] = useState<TestSection>('Section A');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // Time remaining in seconds
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(test.durationMinutes * 60);
  const [totalTimeSpentSeconds, setTotalTimeSpentSeconds] = useState<number>(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  // Map of questionId -> UserResponse
  const [responses, setResponses] = useState<Record<string, UserResponse>>({});

  // Questions grouped by subject
  const subjects: Subject[] = ['Physics', 'Chemistry', 'Botany', 'Zoology'];
  
  // Filter questions for current active subject & section
  const currentSubjectQuestions = activeQuestions.filter((q) => q.subject === activeSubject);
  const filteredQuestions = currentSubjectQuestions.filter((q) => q.section === activeSection);
  
  // Safety check if active section has no questions, fallback to all subject questions or activeQuestions
  const currentQuestionsList = filteredQuestions.length > 0 ? filteredQuestions : (currentSubjectQuestions.length > 0 ? currentSubjectQuestions : activeQuestions);
  const currentQuestion: Question | undefined = currentQuestionsList[currentQuestionIndex] || currentQuestionsList[0] || activeQuestions[0];

  // Initialize response state on load
  useEffect(() => {
    const initialResponses: Record<string, UserResponse> = {};
    activeQuestions.forEach((q) => {
      initialResponses[q.id] = {
        questionId: q.id,
        selectedOption: null,
        isMarkedForReview: false,
        timeSpentSeconds: 0,
      };
    });
    setResponses(initialResponses);
  }, [test, activeQuestions]);

  // Timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitFinal();
          return 0;
        }
        return prev - 1;
      });

      setTotalTimeSpentSeconds((prev) => prev + 1);

      // Increment time spent on current question
      if (currentQuestion) {
        setResponses((prev) => ({
          ...prev,
          [currentQuestion.id]: {
            ...prev[currentQuestion.id],
            timeSpentSeconds: (prev[currentQuestion.id]?.timeSpentSeconds || 0) + 1,
          },
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion]);

  // Handlers for option selection
  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;

    // Check Section B constraint (Max 10 questions in Section B)
    if (currentQuestion.section === 'Section B' && responses[currentQuestion.id]?.selectedOption === null) {
      const sectionBAttempted = currentSubjectQuestions
        .filter((q) => q.section === 'Section B')
        .filter((q) => responses[q.id]?.selectedOption !== null && responses[q.id]?.selectedOption !== undefined)
        .length;

      if (sectionBAttempted >= 10) {
        alert('NTA NEET Section B Rule: You can attempt a maximum of 10 questions in Section B for each subject!');
        return;
      }
    }

    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        selectedOption: optionIndex,
      },
    }));
  };

  const handleClearResponse = () => {
    if (!currentQuestion) return;
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        selectedOption: null,
      },
    }));
  };

  const handleToggleMarkForReview = () => {
    if (!currentQuestion) return;
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        isMarkedForReview: !prev[currentQuestion.id]?.isMarkedForReview,
      },
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestionsList.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitFinal = () => {
    onSubmitTest(responses, totalTimeSpentSeconds);
  };

  // Format Timer
  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate NTA Palette Counts
  let totalAnswered = 0;
  let totalNotAnswered = 0;
  let totalMarked = 0;
  let totalAnsweredAndMarked = 0;
  let totalNotVisited = 0;

  activeQuestions.forEach((q) => {
    const resp = responses[q.id];
    const isAnswered = resp && resp.selectedOption !== null && resp.selectedOption !== undefined;
    const isMarked = resp && resp.isMarkedForReview;

    if (isAnswered && isMarked) totalAnsweredAndMarked++;
    else if (isAnswered) totalAnswered++;
    else if (isMarked) totalMarked++;
    else if (resp && resp.timeSpentSeconds > 0) totalNotAnswered++;
    else totalNotVisited++;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      
      {/* Top Header Timer & NTA Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onCancelTest}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Exit Test"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide truncate max-w-xs sm:max-w-md">
                {test.title}
              </h1>
              <p className="text-[11px] text-slate-400">Official NTA Pattern (+4 / -1 Marking)</p>
            </div>
          </div>

          {/* Time Remaining Badge */}
          <div className={`flex items-center space-x-2 px-4 py-1.5 rounded-xl border text-sm font-bold tracking-mono ${
            timeRemainingSeconds < 300
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}>
            <Clock className="w-4 h-4" />
            <span>Time Left: {formatTime(timeRemainingSeconds)}</span>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>

        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left 3 Columns: Question View Pane */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          
          {/* Subject Navigation Tabs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex items-center space-x-2 overflow-x-auto">
            {subjects.map((sub) => {
              const subQuestions = activeQuestions.filter((q) => q.subject === sub);
              if (subQuestions.length === 0) return null;

              return (
                <button
                  key={sub}
                  onClick={() => {
                    setActiveSubject(sub);
                    setCurrentQuestionIndex(0);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-2 ${
                    activeSubject === sub
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{sub}</span>
                  <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-md">
                    {subQuestions.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Section A / B Toggle Bar */}
          <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setActiveSection('Section A');
                  setCurrentQuestionIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeSection === 'Section A'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Section A (Mandatory 35 Qs)
              </button>

              <button
                onClick={() => {
                  setActiveSection('Section B');
                  setCurrentQuestionIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeSection === 'Section B'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Section B (Attempt Any 10 of 15)
              </button>
            </div>

            {activeSection === 'Section B' && (
              <span className="text-[11px] text-amber-400 font-semibold flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>NTA Rule: Max 10 Questions</span>
              </span>
            )}
          </div>

          {/* Question Card */}
          {currentQuestion && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex-1 flex flex-col justify-between shadow-xl space-y-6">
              
              {/* Question Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                      Question {currentQuestionIndex + 1} of {currentQuestionsList.length}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold">
                      {currentQuestion.chapter}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 font-medium">
                    Marks: <span className="text-emerald-400 font-bold">+4</span> / <span className="text-rose-400 font-bold">-1</span>
                  </div>
                </div>

                {/* Question Body Text */}
                <div className="text-slate-100 text-base leading-relaxed font-medium pt-2">
                  {currentQuestion.question}
                </div>
              </div>

              {/* Options Selection List */}
              <div className="space-y-3 pt-2">
                {currentQuestion.options.map((optText, idx) => {
                  const isSelected = responses[currentQuestion.id]?.selectedOption === idx;
                  const optionLabel = ['A', 'B', 'C', 'D'][idx];

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center space-x-3 group ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md'
                          : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                        isSelected
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'
                      }`}>
                        {optionLabel}
                      </div>

                      <span className="text-sm font-medium flex-1">{optText}</span>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action Controls Bar */}
              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleClearResponse}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Response</span>
                  </button>

                  <button
                    onClick={handleToggleMarkForReview}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      responses[currentQuestion.id]?.isMarkedForReview
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>
                      {responses[currentQuestion.id]?.isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}
                    </span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-bold transition-colors flex items-center space-x-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-colors flex items-center space-x-1 shadow-md shadow-emerald-500/20"
                  >
                    <span>Save & Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right 1 Column: NTA Question Palette Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <LayoutGrid className="w-4 h-4 text-emerald-400" />
                <span>Question Palette</span>
              </h2>
              <span className="text-xs text-slate-400 font-semibold">{activeQuestions.length} Qs</span>
            </div>

            {/* NTA Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-medium">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" />
                <span>Answered ({totalAnswered})</span>
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-md bg-rose-500 inline-block" />
                <span>Not Answered ({totalNotAnswered})</span>
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-md bg-purple-600 inline-block" />
                <span>Marked Review ({totalMarked})</span>
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-md bg-slate-700 inline-block" />
                <span>Not Visited ({totalNotVisited})</span>
              </div>
            </div>

            {/* Question Buttons Palette Grid */}
            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {activeSubject} ({activeSection})
              </p>

              <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
                {currentQuestionsList.map((q, idx) => {
                  const resp = responses[q.id];
                  const isAnswered = resp && resp.selectedOption !== null && resp.selectedOption !== undefined;
                  const isMarked = resp && resp.isMarkedForReview;
                  const isCurrent = idx === currentQuestionIndex;

                  let btnBg = "bg-slate-800 text-slate-300 border-slate-700";
                  if (isAnswered && isMarked) btnBg = "bg-purple-600 text-white border-emerald-400 border-2";
                  else if (isAnswered) btnBg = "bg-emerald-500 text-white border-emerald-400";
                  else if (isMarked) btnBg = "bg-purple-600 text-white border-purple-400";
                  else if (resp && resp.timeSpentSeconds > 0) btnBg = "bg-rose-500 text-white border-rose-400";

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${btnBg} ${
                        isCurrent ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-105' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Submit Test Button */}
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Finish & Submit Test</span>
          </button>

        </div>

      </div>

      {/* Submit Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Submit Mock Test?</h3>
              <p className="text-xs text-slate-400">Review your question summary before submitting your NEET test paper.</p>
            </div>

            <div className="bg-slate-800/60 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Total Questions:</span>
                <span className="font-bold text-white">{activeQuestions.length}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-emerald-400 font-semibold">Answered Questions:</span>
                <span className="font-bold text-emerald-400">{totalAnswered + totalAnsweredAndMarked}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-rose-400 font-semibold">Unanswered:</span>
                <span className="font-bold text-rose-400">{totalNotAnswered}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-purple-400 font-semibold">Marked for Review:</span>
                <span className="font-bold text-purple-400">{totalMarked}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                Resume Test
              </button>

              <button
                onClick={handleSubmitFinal}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
