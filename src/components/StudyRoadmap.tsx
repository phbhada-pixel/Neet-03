import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Compass,
  Filter,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';

export interface WeekPlan {
  weekNumber: number;
  title: string;
  phase: 'Class 11 Core' | 'Class 12 Advanced' | 'Grand Revision & Mocks';
  estimatedHours: number;
  highYieldWeightage: string;
  physicsTopics: string[];
  chemistryTopics: string[];
  biologyTopics: string[];
}

export const initialRoadmapData: WeekPlan[] = [
  {
    weekNumber: 1,
    title: 'Physical World, Cell Structure & Chemical Basics',
    phase: 'Class 11 Core',
    estimatedHours: 24,
    highYieldWeightage: '12 Qs (~48 Marks)',
    physicsTopics: ['Units & Measurements', 'Dimensional Analysis', 'Motion in a Straight Line'],
    chemistryTopics: ['Some Basic Concepts of Chemistry (Mole Concept)', 'Structure of Atom'],
    biologyTopics: ['Cell: The Unit of Life', 'Cell Cycle and Cell Division', 'The Living World'],
  },
  {
    weekNumber: 2,
    title: 'Vectors, Kinematics & Periodicity in Elements',
    phase: 'Class 11 Core',
    estimatedHours: 26,
    highYieldWeightage: '14 Qs (~56 Marks)',
    physicsTopics: ['Vectors & Relative Motion', 'Motion in a Plane (Projectile & Circular)'],
    chemistryTopics: ['Classification of Elements & Periodicity in Properties', 'Chemical Bonding (VSEPR, MOT)'],
    biologyTopics: ['Biological Classification', 'Plant Kingdom', 'Animal Kingdom'],
  },
  {
    weekNumber: 3,
    title: 'Laws of Motion, Thermodynamics & Biomolecules',
    phase: 'Class 11 Core',
    estimatedHours: 28,
    highYieldWeightage: '16 Qs (~64 Marks)',
    physicsTopics: ['Newton’s Laws of Motion & Friction', 'Work, Energy & Power'],
    chemistryTopics: ['Thermodynamics & Thermochemistry', 'Equilibrium (Physical & Ionic)'],
    biologyTopics: ['Biomolecules', 'Morphology of Flowering Plants', 'Anatomy of Flowering Plants'],
  },
  {
    weekNumber: 4,
    title: 'Rotational Motion, Redox & Plant Physiology I',
    phase: 'Class 11 Core',
    estimatedHours: 30,
    highYieldWeightage: '18 Qs (~72 Marks)',
    physicsTopics: ['System of Particles & Rotational Motion (Moment of Inertia)'],
    chemistryTopics: ['Redox Reactions', 'Organic Chemistry: Basic Principles & Techniques'],
    biologyTopics: ['Photosynthesis in Higher Plants', 'Respiration in Plants'],
  },
  {
    weekNumber: 5,
    title: 'Gravitation, Hydrocarbons & Plant Growth',
    phase: 'Class 11 Core',
    estimatedHours: 26,
    highYieldWeightage: '15 Qs (~60 Marks)',
    physicsTopics: ['Gravitation (Kepler’s Laws, Orbital Velocity)', 'Mechanical Properties of Solids & Fluids'],
    chemistryTopics: ['Hydrocarbons (Alkanes, Alkenes, Alkynes, Aromatic)'],
    biologyTopics: ['Plant Growth and Development', 'Structural Organisation in Animals'],
  },
  {
    weekNumber: 6,
    title: 'Thermal Physics, SHM, Waves & Human Digestion/Breathing',
    phase: 'Class 11 Core',
    estimatedHours: 28,
    highYieldWeightage: '16 Qs (~64 Marks)',
    physicsTopics: ['Thermal Properties of Matter', 'Oscillations (Simple Harmonic Motion)', 'Waves & Doppler Effect'],
    chemistryTopics: ['Solutions & Colligative Properties', 'Electrochemistry'],
    biologyTopics: ['Breathing and Exchange of Gases', 'Body Fluids and Circulation'],
  },
  {
    weekNumber: 7,
    title: 'Electrostatics, Coordination Compounds & Human Excretion/Locomotion',
    phase: 'Class 12 Advanced',
    estimatedHours: 30,
    highYieldWeightage: '20 Qs (~80 Marks)',
    physicsTopics: ['Electric Charges and Fields', 'Electrostatic Potential and Capacitance'],
    chemistryTopics: ['Chemical Kinetics', 'Coordination Compounds'],
    biologyTopics: ['Excretory Products and Elimination', 'Locomotion and Movement'],
  },
  {
    weekNumber: 8,
    title: 'Current Electricity, d- & f-Block & Neural/Chemical Control',
    phase: 'Class 12 Advanced',
    estimatedHours: 30,
    highYieldWeightage: '22 Qs (~88 Marks)',
    physicsTopics: ['Current Electricity (Kirchhoff’s Laws, Potentiometer)', 'Moving Charges and Magnetism'],
    chemistryTopics: ['The d- and f-Block Elements', 'Haloalkanes and Haloarenes'],
    biologyTopics: ['Neural Control and Coordination', 'Chemical Coordination and Integration'],
  },
  {
    weekNumber: 9,
    title: 'Magnetism, EMI, AC & Alcohols, Phenols, Ethers',
    phase: 'Class 12 Advanced',
    estimatedHours: 28,
    highYieldWeightage: '18 Qs (~72 Marks)',
    physicsTopics: ['Magnetism and Matter', 'Electromagnetic Induction (EMI)', 'Alternating Current (AC)'],
    chemistryTopics: ['Alcohols, Phenols and Ethers', 'Aldehydes, Ketones and Carboxylic Acids'],
    biologyTopics: ['Sexual Reproduction in Flowering Plants', 'Human Reproduction', 'Reproductive Health'],
  },
  {
    weekNumber: 10,
    title: 'Optics, Amines, Genetics & Molecular Basis of Inheritance',
    phase: 'Class 12 Advanced',
    estimatedHours: 32,
    highYieldWeightage: '25 Qs (~100 Marks)',
    physicsTopics: ['Ray Optics and Optical Instruments', 'Wave Optics (Interference, Diffraction)'],
    chemistryTopics: ['Amines & Diazonium Salts', 'Biomolecules (Polymers/Chemistry in Everyday Life)'],
    biologyTopics: ['Principles of Inheritance and Variation', 'Molecular Basis of Inheritance'],
  },
  {
    weekNumber: 11,
    title: 'Modern Physics, Semiconductors & Biotechnology/Evolution',
    phase: 'Class 12 Advanced',
    estimatedHours: 28,
    highYieldWeightage: '20 Qs (~80 Marks)',
    physicsTopics: ['Dual Nature of Radiation & Matter', 'Atoms & Nuclei', 'Semiconductor Electronics'],
    chemistryTopics: ['p-Block Elements & Salt Analysis', 'Environmental Chemistry / Green Chemistry'],
    biologyTopics: ['Evolution', 'Human Health and Disease', 'Biotechnology: Principles and Processes'],
  },
  {
    weekNumber: 12,
    title: 'Biotech Applications, Ecology & NTA Full 720 Grand Mocks',
    phase: 'Grand Revision & Mocks',
    estimatedHours: 34,
    highYieldWeightage: 'Final Stretch (Full 720 Mocks)',
    physicsTopics: ['Class 11 & 12 Formula Formula Deck Formula Drill', 'Full Length Mock Tests'],
    chemistryTopics: ['Named Organic Reactions Speed Drill', 'Inorganic Exception Tables'],
    biologyTopics: ['Biotechnology and its Applications', 'Organisms and Populations', 'Ecosystem & Biodiversity'],
  },
];

interface StudyRoadmapProps {
  onNavigateTab?: (tab: 'dashboard' | 'tests' | 'analytics' | 'ai-tutor' | 'flashcards') => void;
}

export const StudyRoadmap: React.FC<StudyRoadmapProps> = ({ onNavigateTab }) => {
  const [completedWeeks, setCompletedWeeks] = useState<number[]>([1, 2]); // Default weeks 1 & 2 done
  const [subjectFilter, setSubjectFilter] = useState<'All' | 'Physics' | 'Chemistry' | 'Biology'>('All');
  const [expandedWeek, setExpandedWeek] = useState<number | null>(3); // Expand week 3 by default

  const toggleWeekCompletion = (weekNum: number) => {
    setCompletedWeeks((prev) =>
      prev.includes(weekNum) ? prev.filter((w) => w !== weekNum) : [...prev, weekNum]
    );
  };

  const totalWeeks = initialRoadmapData.length;
  const progressPercent = Math.round((completedWeeks.length / totalWeeks) * 100);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-white shadow-2xl">
      
      {/* Roadmap Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>NCERT Syllabus Timeline</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">12-Week Master Roadmap</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            NEET 2026 Week-by-Week Study Roadmap
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Structured syllabus progression covering Class 11 and Class 12 NCERT chapters for Physics, Chemistry, and Biology with high-yield weightage insights.
          </p>
        </div>

        {/* Overall Completion Metric Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shrink-0 space-y-2 min-w-[200px]">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold uppercase">
            <span>Syllabus Covered</span>
            <span className="text-emerald-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 text-right font-medium">
            {completedWeeks.length} of {totalWeeks} Weeks Mastered
          </div>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Subject Focus:</span>
          
          <div className="flex items-center space-x-1.5 pl-1">
            {(['All', 'Physics', 'Chemistry', 'Biology'] as const).map((sub) => (
              <button
                key={sub}
                onClick={() => setSubjectFilter(sub)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  subjectFilter === sub
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center space-x-2">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Click checkboxes to log completed weeks</span>
        </div>
      </div>

      {/* Week-by-Week Accordion List */}
      <div className="space-y-3 pt-2">
        {initialRoadmapData.map((plan) => {
          const isDone = completedWeeks.includes(plan.weekNumber);
          const isExpanded = expandedWeek === plan.weekNumber;

          return (
            <div
              key={plan.weekNumber}
              className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                isDone
                  ? 'bg-slate-950/40 border-emerald-500/30'
                  : isExpanded
                  ? 'bg-slate-950/90 border-slate-700 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Header Row */}
              <div
                onClick={() => setExpandedWeek(isExpanded ? null : plan.weekNumber)}
                className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  {/* Completion Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWeekCompletion(plan.weekNumber);
                    }}
                    className={`p-1.5 rounded-xl transition-all ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5 fill-emerald-500/20 text-emerald-400" /> : <Circle className="w-5 h-5" />}
                  </button>

                  <div>
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                        Week {plan.weekNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-semibold">
                        {plan.phase}
                      </span>
                      {isDone && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          ✓ Completed
                        </span>
                      )}
                    </div>

                    <h3 className={`text-sm font-bold mt-0.5 truncate ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                      {plan.title}
                    </h3>
                  </div>
                </div>

                {/* Right Badges */}
                <div className="flex items-center space-x-3 shrink-0">
                  <div className="hidden sm:flex flex-col items-end text-right text-[11px]">
                    <span className="text-amber-400 font-bold">{plan.highYieldWeightage}</span>
                    <span className="text-slate-400">{plan.estimatedHours} Hours Target</span>
                  </div>

                  <ChevronRight
                    className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90 text-emerald-400' : ''}`}
                  />
                </div>
              </div>

              {/* Expanded Topic Details */}
              {isExpanded && (
                <div className="px-4 pb-5 pt-2 border-t border-slate-800/80 space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Physics Topics */}
                    {(subjectFilter === 'All' || subjectFilter === 'Physics') && (
                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center space-x-1.5 text-indigo-400 font-bold uppercase tracking-wider text-[11px]">
                          <Zap className="w-3.5 h-3.5" />
                          <span>Physics Topics</span>
                        </div>
                        <ul className="space-y-1.5 text-slate-300">
                          {plan.physicsTopics.map((top, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className="text-indigo-400 font-bold">•</span>
                              <span className="leading-tight">{top}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Chemistry Topics */}
                    {(subjectFilter === 'All' || subjectFilter === 'Chemistry') && (
                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center space-x-1.5 text-purple-400 font-bold uppercase tracking-wider text-[11px]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Chemistry Topics</span>
                        </div>
                        <ul className="space-y-1.5 text-slate-300">
                          {plan.chemistryTopics.map((top, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className="text-purple-400 font-bold">•</span>
                              <span className="leading-tight">{top}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Biology Topics */}
                    {(subjectFilter === 'All' || subjectFilter === 'Biology') && (
                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center space-x-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Biology (Botany & Zoology)</span>
                        </div>
                        <ul className="space-y-1.5 text-slate-300">
                          {plan.biologyTopics.map((top, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span className="leading-tight">{top}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>

                  {/* Actions for this week */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Target completion: {plan.estimatedHours} study hours</span>
                    </span>

                    {onNavigateTab && (
                      <button
                        onClick={() => onNavigateTab('ai-tutor')}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold border border-indigo-500/40 transition-all flex items-center space-x-1"
                      >
                        <span>Ask AI Tutor regarding Week {plan.weekNumber}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
