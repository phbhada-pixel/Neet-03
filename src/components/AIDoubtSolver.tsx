import React, { useState } from 'react';
import { Subject } from '../types/neet';
import { Bot, Brain, ChevronRight, MessageSquareCode, Send, Sparkles, User, Zap } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  subject?: string;
  timestamp: string;
}

export const AIDoubtSolver: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'practice-generator'>('chat');
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Physics');
  const [inputDoubt, setInputDoubt] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  // Chat message history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "Namaste! I am **NEET Guru**, your dedicated AI Tutor. I am trained on NCERT Class 11 and Class 12 Physics, Chemistry, Botany, and Zoology.\n\nAsk me any doubt, formula derivation, reaction mechanism, or NCERT line concept!",
      timestamp: 'Just now',
    },
  ]);

  // Practice generator state
  const [genTopic, setGenTopic] = useState<string>('');
  const [genDifficulty, setGenDifficulty] = useState<string>('Medium');
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [isGenLoading, setIsGenLoading] = useState<boolean>(false);

  // Quick Doubt Prompts
  const quickDoubts = [
    { label: "Explain Sn1 vs Sn2 Mechanism", subject: "Chemistry" as Subject },
    { label: "Derive Lens Maker Formula", subject: "Physics" as Subject },
    { label: "Summarize Calvin Cycle in C3 Plants", subject: "Botany" as Subject },
    { label: "Cardiac Cycle & ECG Waves", subject: "Zoology" as Subject },
  ];

  const handleSendDoubt = async (textToSend?: string) => {
    const doubtText = textToSend || inputDoubt;
    if (!doubtText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: doubtText,
      subject: selectedSubject,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputDoubt('');
    setIsSending(true);

    try {
      const historyContext = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/gemini/ask-doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doubt: doubtText,
          subject: selectedSubject,
          contextHistory: historyContext,
        }),
      });

      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || 'Sorry, I could not resolve this doubt right now.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: 'Error connecting to NEET Guru AI Tutor. Please try again.',
          timestamp: 'Now',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleGeneratePractice = async () => {
    if (!genTopic.trim()) return;
    setIsGenLoading(true);
    setGeneratedQuestions([]);

    try {
      const res = await fetch('/api/gemini/generate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          topic: genTopic,
          difficulty: genDifficulty,
          count: 3,
        }),
      });

      const data = await res.json();
      if (data.questions && Array.isArray(data.questions)) {
        setGeneratedQuestions(data.questions);
      }
    } catch (err) {
      console.error('Error generating practice:', err);
    } finally {
      setIsGenLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 text-white">
      
      {/* Title & Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <MessageSquareCode className="w-4 h-4" />
            <span>24/7 AI NEET Tutor</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">NEET AI Doubt Solver & Practice Generator</h1>
          <p className="text-slate-400 text-sm mt-1">
            Get instant NCERT-aligned solutions, reaction mechanisms, or AI custom practice sets.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'chat'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>AI Tutor Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('practice-generator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'practice-generator'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Practice Generator</span>
          </button>
        </div>
      </div>

      {activeTab === 'chat' ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col h-[600px] shadow-2xl">
          
          {/* Subject Tag Selector & Quick Chips */}
          <div className="space-y-3 pb-4 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Select Doubt Subject:</span>
              <div className="flex space-x-1.5">
                {(['Physics', 'Chemistry', 'Botany', 'Zoology'] as Subject[]).map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedSubject === sub
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400 font-semibold">Quick Doubts:</span>
              {quickDoubts.map((qd) => (
                <button
                  key={qd.label}
                  onClick={() => {
                    setSelectedSubject(qd.subject);
                    handleSendDoubt(qd.label);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 text-xs transition-all"
                >
                  {qd.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Feed */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start space-x-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed space-y-1 ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className="block text-[9px] opacity-60 text-right">{m.timestamp}</span>
                </div>

                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isSending && (
              <div className="flex items-center space-x-2 text-indigo-400 text-xs py-2">
                <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <span>NEET Guru is thinking & consulting NCERT...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="pt-4 border-t border-slate-800 flex items-center space-x-3">
            <input
              type="text"
              placeholder={`Ask your ${selectedSubject} doubt or formula question...`}
              value={inputDoubt}
              onChange={(e) => setInputDoubt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendDoubt()}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />

            <button
              onClick={() => handleSendDoubt()}
              disabled={isSending || !inputDoubt.trim()}
              className="px-5 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-white font-bold text-xs transition-colors flex items-center space-x-1.5 shadow-md shadow-indigo-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Ask</span>
            </button>
          </div>

        </div>
      ) : (
        /* AI Practice Generator Tab */
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Generate Custom AI Practice Questions</span>
            </h2>
            <p className="text-xs text-slate-400">Generate fresh NCERT MCQs for any weak topic or chapter.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as Subject)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Botany">Botany</option>
                <option value="Zoology">Zoology</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">NCERT Chapter / Topic</label>
              <input
                type="text"
                placeholder="e.g., Rotational Motion, Photosynthesis, Genetics"
                value={genTopic}
                onChange={(e) => setGenTopic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Difficulty Level</label>
              <select
                value={genDifficulty}
                onChange={(e) => setGenDifficulty(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
              >
                <option value="Easy">Easy (Factual NCERT)</option>
                <option value="Medium">Medium (Standard NEET)</option>
                <option value="Hard">Hard (Assertion-Reason / Calculation)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGeneratePractice}
            disabled={isGenLoading || !genTopic.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>{isGenLoading ? 'Generating Questions with Gemini AI...' : 'Generate 3 High-Yield Questions'}</span>
          </button>

          {/* Generated Questions List */}
          {generatedQuestions.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-indigo-300">Generated Practice Questions:</h3>
              {generatedQuestions.map((q, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                  <p className="font-bold text-white">Q{idx + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt: string, oIdx: number) => (
                      <div
                        key={oIdx}
                        className={`p-2.5 rounded-xl border ${
                          oIdx === q.correctAnswer
                            ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        {['A', 'B', 'C', 'D'][oIdx]}. {opt}
                      </div>
                    ))}
                  </div>
                  <p className="text-slate-400 text-[11px] pt-1">
                    <span className="font-bold text-indigo-400">NCERT Solution:</span> {q.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
