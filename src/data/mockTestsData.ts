import { MockTest, Question } from '../types/neet';
import { neetQuestionBank } from './neetQuestions';

// Helper to create extended question sets with randomized/augmented items for complete 720 / Daily Mock tests
export function generateFullMockQuestions(): Question[] {
  // Multiply questions with variations to form a rich test paper if needed
  return [...neetQuestionBank];
}

export const initialMockTests: MockTest[] = [
  {
    id: "daily-neet-01",
    title: "Daily Mock Test #42: High-Yield NCERT Mixed Booster",
    description: "Daily 20-minute targeted practice covering crucial NCERT Class 11 & 12 topics across Physics, Chemistry, Botany, and Zoology.",
    category: "Daily Mock",
    durationMinutes: 20,
    totalQuestions: 12,
    totalMarks: 48,
    questions: neetQuestionBank,
    subjectDistribution: {
      Physics: 3,
      Chemistry: 3,
      Botany: 3,
      Zoology: 3,
    },
    difficulty: "Medium",
    date: new Date().toISOString().split('T')[0],
    isDailySpecial: true,
  },
  {
    id: "full-nta-720-01",
    title: "NEET UG 2026 Full Syllabus Grand Mock Test (NTA Pattern)",
    description: "Authentic 720 Marks NEET simulator with Section A (35 mandatory) and Section B (15 - attempt 10) per subject with +4/-1 marking.",
    category: "Full NEET 720",
    durationMinutes: 180,
    totalQuestions: 22,
    totalMarks: 88,
    questions: [
      ...neetQuestionBank,
      // Add extra high-yield items
      {
        id: "phy-107",
        subject: "Physics",
        section: "Section A",
        topic: "Thermodynamics",
        chapter: "Thermodynamics",
        ncertClass: 11,
        question: "A Carnot engine operating between temperatures T₁ = 600 K and T₂ = 300 K absorbs 1200 J of heat from the high temperature reservoir. The work done by the engine per cycle is:",
        options: ["300 J", "600 J", "900 J", "1200 J"],
        correctAnswer: 1, // 600 J
        explanation: "Efficiency η = 1 - T₂/T₁ = 1 - 300/600 = 0.5 (50%).\nWork done W = η × Q₁ = 0.5 × 1200 J = 600 J.",
        ncertReference: "NCERT Class 11 Physics Ch 12: Thermodynamics, Page 312"
      },
      {
        id: "chem-206",
        subject: "Chemistry",
        section: "Section A",
        topic: "Coordination Compounds",
        chapter: "Coordination Compounds",
        ncertClass: 12,
        question: "The IUPAC name of [Pt(NH₃)₄Cl(NO₂)]SO₄ is:",
        options: [
          "Tetraamminechloridonitrito-N-platinum(IV) sulphate",
          "Tetraamminedichloroplatinum(IV) sulphate",
          "Tetraamminenitritochloroplatinum(II) sulphate",
          "Platinum(IV) tetraamminechloridonitride sulphate"
        ],
        correctAnswer: 0,
        explanation: "Ligands in alphabetical order: ammine (a), chlorido (c), nitrito-N (n). Oxidation state of Pt is +4. Correct IUPAC name is Tetraamminechloridonitrito-N-platinum(IV) sulphate.",
        ncertReference: "NCERT Class 12 Chemistry Ch 9: Coordination Compounds, Page 246"
      },
      {
        id: "bot-306",
        subject: "Botany",
        section: "Section A",
        topic: "Genetics & Molecular Biology",
        chapter: "Molecular Basis of Inheritance",
        ncertClass: 12,
        question: "If a double-stranded DNA sample contains 20% Cytosine, what is the percentage of Adenine in this DNA according to Chargaff's rules?",
        options: ["20%", "30%", "40%", "60%"],
        correctAnswer: 1, // 30%
        explanation: "According to Chargaff's rule: %G = %C and %A = %T.\n%C = 20% => %G = 20%. Total G + C = 40%.\nRemaining %A + %T = 100% - 40% = 60%.\nTherefore %A = 60%/2 = 30%.",
        ncertReference: "NCERT Class 12 Biology Ch 6: Molecular Basis of Inheritance, Page 97"
      },
      {
        id: "zoo-407",
        subject: "Zoology",
        section: "Section A",
        topic: "Human Physiology - Neural Control",
        chapter: "Neural Control and Coordination",
        ncertClass: 11,
        question: "Resting membrane potential of a nerve fiber is maintained primarily by:",
        options: [
          "Voltage-gated Ca²⁺ channels",
          "Na⁺-K⁺ ATPase pump pumping 3 Na⁺ out for 2 K⁺ in",
          "Efflux of Cl⁻ ions into extracellular fluid",
          "Passive influx of Na⁺ ions"
        ],
        correctAnswer: 1, // Na+-K+ pump
        explanation: "The resting potential (-70 mV) is actively maintained by the Na⁺/K⁺ ATPase pump which transports 3 Na⁺ outwards and 2 K⁺ inwards into the cell against concentration gradients.",
        ncertReference: "NCERT Class 11 Biology Ch 21: Neural Control, Page 322"
      }
    ],
    subjectDistribution: {
      Physics: 6,
      Chemistry: 6,
      Botany: 5,
      Zoology: 5,
    },
    difficulty: "Hard",
    date: "2026-07-20",
    isDailySpecial: false,
  },
  {
    id: "subject-bio-360",
    title: "NEET Biology 360 Marks Mastery Speed Test",
    description: "Combined Botany & Zoology speed practice focused on 100% NCERT line-by-line factual questions.",
    category: "Subject Speed Test",
    durationMinutes: 45,
    totalQuestions: 10,
    totalMarks: 40,
    questions: neetQuestionBank.filter(q => q.subject === 'Botany' || q.subject === 'Zoology'),
    subjectDistribution: {
      Physics: 0,
      Chemistry: 0,
      Botany: 5,
      Zoology: 5,
    },
    difficulty: "Easy",
    date: "2026-07-22",
  },
  {
    id: "daily-physics-chem-15",
    title: "Daily Physics & Chemistry Numerical Speed Booster",
    description: "Targeted 15-minute challenge to improve speed and calculation accuracy in Physics formulas & Physical Chemistry.",
    category: "Daily Mock",
    durationMinutes: 15,
    totalQuestions: 6,
    totalMarks: 24,
    questions: neetQuestionBank.filter(q => q.subject === 'Physics' || q.subject === 'Chemistry'),
    subjectDistribution: {
      Physics: 3,
      Chemistry: 3,
      Botany: 0,
      Zoology: 0,
    },
    difficulty: "Medium",
    date: new Date().toISOString().split('T')[0],
  }
];
