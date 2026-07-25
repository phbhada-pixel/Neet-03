import React, { useState } from 'react';
import { ncertFlashcards } from '../data/ncertFlashcards';
import { Subject } from '../types/neet';
import { BookOpen, Check, ChevronLeft, ChevronRight, HelpCircle, RotateCw, Sparkles, Star } from 'lucide-react';

export const NCERTFlashcards: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>('All');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const filteredFlashcards = selectedSubject === 'All'
    ? ncertFlashcards
    : ncertFlashcards.filter((f) => f.subject === selectedSubject);

  const currentCard = filteredFlashcards[currentIndex] || ncertFlashcards[0];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < filteredFlashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(filteredFlashcards.length - 1);
    }
  };

  return (
    <div className="space-y-6 pb-12 text-white max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Rapid Memory Recall Deck</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">NCERT High-Yield Revision Flashcards</h1>
          <p className="text-slate-400 text-sm mt-1">
            Master crucial Physics formulas, Organic named reactions, and Biology pathways.
          </p>
        </div>

        {/* Subject Filter */}
        <div className="flex items-center space-x-1.5 bg-slate-800 p-1.5 rounded-2xl overflow-x-auto">
          {(['All', 'Physics', 'Chemistry', 'Botany', 'Zoology'] as const).map((sub) => (
            <button
              key={sub}
              onClick={() => {
                setSelectedSubject(sub);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedSubject === sub
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Flashcard */}
      {currentCard && (
        <div className="space-y-6">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer perspective-1000 min-h-[320px] bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 hover:border-amber-500/60 rounded-3xl p-8 flex flex-col justify-between shadow-2xl transition-all duration-500 transform hover:-translate-y-1 relative"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  {currentCard.subject}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{currentCard.chapter}</span>
              </div>

              <div className="flex items-center space-x-1 text-xs text-amber-400 font-bold">
                <RotateCw className="w-3.5 h-3.5" />
                <span>{isFlipped ? 'Answer View' : 'Click to Flip'}</span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="py-6 text-center space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {isFlipped ? 'NCERT Explanation / Formula Solution:' : 'High-Yield Concept Question:'}
              </span>

              <p className={`text-lg sm:text-xl font-bold leading-relaxed ${isFlipped ? 'text-amber-200 whitespace-pre-line' : 'text-white'}`}>
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>

            <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Card {currentIndex + 1} of {filteredFlashcards.length}</span>
              <span>{currentCard.ncertReference}</span>
            </div>
          </div>

          {/* Flashcard Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-6 py-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <RotateCw className="w-4 h-4" />
              <span>Flip Card</span>
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all flex items-center space-x-1 shadow-md shadow-amber-500/20"
            >
              <span>Next Card</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
