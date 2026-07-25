import React, { useState } from 'react';
import { AIDoubtSolver } from './components/AIDoubtSolver';
import { DailyMockTestList } from './components/DailyMockTestList';
import { Dashboard } from './components/Dashboard';
import { NCERTFlashcards } from './components/NCERTFlashcards';
import { Navbar } from './components/Navbar';
import { PerformanceAnalytics } from './components/PerformanceAnalytics';
import { TestResultAnalytics } from './components/TestResultAnalytics';
import { TestSimulator } from './components/TestSimulator';
import { initialMockTests } from './data/mockTestsData';
import { MockTest, Question, TestResult, UserAnalytics, UserResponse } from './types/neet';
import { calculateTestResult, loadUserAnalytics, saveTestResultToAnalytics } from './utils/neetAnalytics';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tests' | 'analytics' | 'ai-tutor' | 'flashcards'>('dashboard');
  
  // Test execution state
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [currentTestResult, setCurrentTestResult] = useState<TestResult | null>(null);
  
  // Analytics state
  const [analytics, setAnalytics] = useState<UserAnalytics>(() => loadUserAnalytics());

  const dailyMockTest = initialMockTests.find((t) => t.isDailySpecial) || initialMockTests[0];

  // Handler to launch a test
  const handleStartTest = (test: MockTest) => {
    setActiveTest(test);
  };

  // Handler when test is submitted in simulator
  const handleSubmitTest = (responses: Record<string, UserResponse>, totalTimeSpentSeconds: number) => {
    if (!activeTest) return;

    const result = calculateTestResult(activeTest, responses, totalTimeSpentSeconds);
    const updatedAnalytics = saveTestResultToAnalytics(result);

    setAnalytics(updatedAnalytics);
    setCurrentTestResult(result);
    setActiveTest(null);
  };

  // Handler to cancel/exit active test
  const handleCancelTest = () => {
    if (confirm('Are you sure you want to exit the test? Your progress will not be saved.')) {
      setActiveTest(null);
    }
  };

  // Handler when user asks AI Tutor about a specific question from test result
  const handleAskDoubtAboutQuestion = (_question: Question, _userAnswer: number | null) => {
    setActiveTab('ai-tutor');
    setCurrentTestResult(null);
  };

  // If a test is active, show the Full NTA Test Simulator fullscreen
  if (activeTest) {
    return (
      <TestSimulator
        test={activeTest}
        onSubmitTest={handleSubmitTest}
        onCancelTest={handleCancelTest}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Standardised Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setCurrentTestResult(null);
          setActiveTab(tab);
        }}
        streakDays={analytics.streakDays}
        averageScore={analytics.averageScore}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Post-Test Analysis Overlay */}
        {currentTestResult ? (
          <TestResultAnalytics
            test={initialMockTests.find((t) => t.id === currentTestResult.testId) || initialMockTests[0]}
            result={currentTestResult}
            onRetakeTest={() => {
              const originalTest = initialMockTests.find((t) => t.id === currentTestResult.testId) || initialMockTests[0];
              setCurrentTestResult(null);
              handleStartTest(originalTest);
            }}
            onGoHome={() => {
              setCurrentTestResult(null);
              setActiveTab('dashboard');
            }}
            onAskDoubtAboutQuestion={handleAskDoubtAboutQuestion}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                analytics={analytics}
                dailyMockTest={dailyMockTest}
                onStartTest={handleStartTest}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'tests' && (
              <DailyMockTestList
                mockTests={initialMockTests}
                onStartTest={handleStartTest}
              />
            )}

            {activeTab === 'analytics' && (
              <PerformanceAnalytics analytics={analytics} />
            )}

            {activeTab === 'ai-tutor' && (
              <AIDoubtSolver />
            )}

            {activeTab === 'flashcards' && (
              <NCERTFlashcards />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="font-semibold text-slate-300">
            NEET Prep Master • Standardised NCERT Class 11 & 12 UG Preparation Platform
          </p>
          <p className="text-[11px] text-slate-500">
            Official NTA Test Simulator (+4 / -1 Marking) with AI Doubt Solver & Performance Analytics.
          </p>
        </div>
      </footer>

    </div>
  );
}
