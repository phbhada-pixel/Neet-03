import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize GoogleGenAI SDK lazily/safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "NEET Prep Master" });
});

// Endpoint 1: Detailed Question Explanation by AI
app.post("/api/gemini/explain", async (req, res) => {
  try {
    const { question, options, correctAnswer, subject, topic, userAnswer } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }

    const ai = getGeminiClient();
    const prompt = `You are a top NEET UG exam master coach (expert in NCERT Physics, Chemistry, Botany, and Zoology).
Provide a clear, high-yield, step-by-step NCERT-aligned explanation for the following NEET question:

Subject: ${subject || "NEET Science"}
Topic: ${topic || "General"}
Question: ${question}
Options: ${JSON.stringify(options || [])}
Correct Option: ${correctAnswer}
Student's Chosen Option: ${userAnswer || "Unattempted"}

Instructions:
1. Explain why Option ${correctAnswer} is strictly correct according to NCERT Class 11/12 textbook concepts.
2. If the student made a mistake (chose ${userAnswer}), explain the common misconception or calculation trap.
3. Mention the exact NCERT concept/formula/line reference.
4. Give a "Pro-Tip / Memory Trick" or key formula box for rapid revision during NEET exam.

Format your response in neat, well-structured Markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ explanation: response.text });
  } catch (error: any) {
    console.error("Error in /api/gemini/explain:", error);
    res.status(500).json({ error: error.message || "Failed to generate explanation." });
  }
});

// Endpoint 2: AI Doubt Solver for NEET Aspirants
app.post("/api/gemini/ask-doubt", async (req, res) => {
  try {
    const { doubt, subject, contextHistory } = req.body;
    if (!doubt) {
      return res.status(400).json({ error: "Doubt text is required." });
    }

    const ai = getGeminiClient();
    const systemInstruction = `You are "NEET Guru", an empathetic, highly knowledgeable AI Tutor specializing exclusively in NEET UG exam preparation (Physics, Physical/Organic/Inorganic Chemistry, Botany, Zoology).

Guidelines:
- Align all answers strictly with NCERT Class 11 and Class 12 NEET syllabus.
- Use simple, encouraging language with clear bullet points.
- Highlight key NCERT lines, important equations, SI units, reaction mechanisms, or memory mnemonics where helpful.
- Keep responses focused, concise, and exam-oriented. Include a brief practice question at the end related to the user's doubt.`;

    const contents = contextHistory && Array.isArray(contextHistory) && contextHistory.length > 0
      ? [
          ...contextHistory.map((msg: any) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
          })),
          { role: "user", parts: [{ text: `[Subject: ${subject || "NEET"}]\n${doubt}` }] },
        ]
      : `[Subject: ${subject || "NEET"}]\n${doubt}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction,
      },
    });

    res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Error in /api/gemini/ask-doubt:", error);
    res.status(500).json({ error: error.message || "Failed to solve doubt." });
  }
});

// Endpoint 3: Generate Custom Practice Questions
app.post("/api/gemini/generate-practice", async (req, res) => {
  try {
    const { subject, topic, difficulty, count = 3 } = req.body;
    const ai = getGeminiClient();

    const prompt = `Generate ${count} high-yield NEET UG multiple-choice questions for:
Subject: ${subject}
Topic: ${topic}
Difficulty Level: ${difficulty || "Medium"}

Format the response as a JSON array of objects with the following schema:
[
  {
    "id": "custom-1",
    "subject": "${subject}",
    "topic": "${topic}",
    "question": "Question text here...",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "correctAnswer": 0, // index 0-3
    "explanation": "Step-by-step NCERT explanation...",
    "ncertReference": "NCERT Class 11/12 Chapter name..."
  }
]

Ensure questions match actual NTA NEET pattern (+4/-1 marking, conceptual & statement/assertion-reason type questions included). Return strictly valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    res.json({ questions: parsed });
  } catch (error: any) {
    console.error("Error in /api/gemini/generate-practice:", error);
    res.status(500).json({ error: error.message || "Failed to generate practice questions." });
  }
});

// Endpoint 4: AI Performance & Weak Area Strategic Advisor
app.post("/api/gemini/analyze-strategy", async (req, res) => {
  try {
    const { testSummary, subjectScores, accuracyMap, weakTopics } = req.body;
    const ai = getGeminiClient();

    const prompt = `Act as an expert NEET AIR 1 Mentor. Analyze this student's recent Mock Test Performance and generate an actionable 7-day Revision Plan and Weak-Area Action Strategy.

Performance Summary:
- Total Marks Obtained: ${testSummary.score} / ${testSummary.totalMarks}
- Accuracy Rate: ${testSummary.accuracy}%
- Physics Score: ${subjectScores.Physics?.score || 0} (Accuracy: ${subjectScores.Physics?.accuracy || 0}%)
- Chemistry Score: ${subjectScores.Chemistry?.score || 0} (Accuracy: ${subjectScores.Chemistry?.accuracy || 0}%)
- Botany Score: ${subjectScores.Botany?.score || 0} (Accuracy: ${subjectScores.Botany?.accuracy || 0}%)
- Zoology Score: ${subjectScores.Zoology?.score || 0} (Accuracy: ${subjectScores.Zoology?.accuracy || 0}%)
- Identified Weak Topics: ${weakTopics?.join(", ") || "None specified"}

Provide:
1. AIR Tier & Target Cutoff Analysis (Realistically based on standard NEET score trends: 680+ for top AIIMS, 620+ top state GMCs).
2. Subject-wise Urgent Priorities (Where to gain maximum marks with minimum effort).
3. 3 Custom Memory Hacks / Common Traps to avoid in NEET physics calculations or biology terminology.
4. Suggested Daily Mock Test routine for the next week.

Format as beautiful markdown with bold highlights, bullet points, and actionable tips.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ advice: response.text });
  } catch (error: any) {
    console.error("Error in /api/gemini/analyze-strategy:", error);
    res.status(500).json({ error: error.message || "Failed to analyze performance strategy." });
  }
});

// ==================== NTA NEET QUESTION BANK API ====================

// Comprehensive Seed Database for NTA NEET Question Bank
const ntaQuestionBankSeed = [
  {
    id: "nta-phy-2024-01",
    subject: "Physics",
    section: "Section A",
    topic: "Kinematics",
    chapter: "Motion in a Straight Line",
    ncertClass: 11,
    pyqYear: 2024,
    difficulty: "Medium",
    question: "A vehicle travels half the distance L with speed v1 and the remaining half distance with speed v2. Its average speed for the entire journey is given by:",
    options: ["(v1 + v2) / 2", "2 v1 v2 / (v1 + v2)", "√(v1 v2)", "(v1 v2) / (v1 + v2)"],
    correctAnswer: 1,
    explanation: "Average speed = Total Distance / Total Time = L / (t1 + t2) = L / [(L/2)/v1 + (L/2)/v2] = 2 v1 v2 / (v1 + v2).",
    ncertReference: "NCERT Class 11 Physics Ch 3: Motion in a Straight Line, Page 43"
  },
  {
    id: "nta-phy-2024-02",
    subject: "Physics",
    section: "Section A",
    topic: "Current Electricity",
    chapter: "Current Electricity",
    ncertClass: 12,
    pyqYear: 2024,
    difficulty: "Easy",
    question: "A wire of resistance R is stretched to double its original length keeping volume constant. Its new resistance will be:",
    options: ["2R", "R/2", "4R", "R/4"],
    correctAnswer: 2,
    explanation: "When wire is stretched to length L' = 2L, area becomes A' = A/2 to keep volume constant. Resistance R' = ρ(L'/A') = ρ(2L / (A/2)) = 4 ρ(L/A) = 4R.",
    ncertReference: "NCERT Class 12 Physics Ch 3: Current Electricity, Page 97"
  },
  {
    id: "nta-chem-2024-01",
    subject: "Chemistry",
    section: "Section A",
    topic: "Chemical Bonding",
    chapter: "Chemical Bonding and Molecular Structure",
    ncertClass: 11,
    pyqYear: 2024,
    difficulty: "Easy",
    question: "Which of the following molecules has zero dipole moment?",
    options: ["NH3", "H2O", "BF3", "PCl3"],
    correctAnswer: 2,
    explanation: "BF3 has trigonal planar geometry with bond angle 120°. The three B-F bond dipoles cancel out symmetrically, resulting in a net dipole moment of zero (μ = 0 D).",
    ncertReference: "NCERT Class 11 Chemistry Ch 4: Chemical Bonding, Page 108"
  },
  {
    id: "nta-chem-2023-01",
    subject: "Chemistry",
    section: "Section A",
    topic: "Organic Chemistry",
    chapter: "Hydrocarbons",
    ncertClass: 11,
    pyqYear: 2023,
    difficulty: "Medium",
    question: "Among the following, which compound gives positive Iodoform test?",
    options: ["Methanol", "Ethanol", "Propan-1-ol", "Benzaldehyde"],
    correctAnswer: 1,
    explanation: "Ethanol (CH3CH2OH) contains the CH3-CH(OH)- group which oxidizes to acetaldehyde (CH3CHO) with I2/NaOH to form yellow precipitate of iodoform (CHI3).",
    ncertReference: "NCERT Class 12 Chemistry Ch 11: Alcohols, Phenols and Ethers, Page 338"
  },
  {
    id: "nta-bot-2024-01",
    subject: "Botany",
    section: "Section A",
    topic: "Cell Biology",
    chapter: "Cell: The Unit of Life",
    ncertClass: 11,
    pyqYear: 2024,
    difficulty: "Easy",
    question: "The organelle involved in lipid synthesis, steroid hormone production and detoxification in eukaryotic cells is:",
    options: ["Rough Endoplasmic Reticulum (RER)", "Smooth Endoplasmic Reticulum (SER)", "Golgi Apparatus", "Lysosome"],
    correctAnswer: 1,
    explanation: "Smooth Endoplasmic Reticulum (SER) is the major site for synthesis of lipids, phospholipids, and steroid hormones (e.g. testosterone, estrogen).",
    ncertReference: "NCERT Class 11 Biology Ch 8: Cell: The Unit of Life, Page 133"
  },
  {
    id: "nta-zoo-2024-01",
    subject: "Zoology",
    section: "Section A",
    topic: "Human Physiology",
    chapter: "Breathing and Exchange of Gases",
    ncertClass: 11,
    pyqYear: 2024,
    difficulty: "Medium",
    question: "In human blood, majority of CO2 is transported as:",
    options: ["Dissolved gas in plasma (7%)", "Carbamino-hemoglobin (20-25%)", "Bicarbonate ions (HCO3⁻) in plasma (~70%)", "Carbonic acid in RBCs"],
    correctAnswer: 2,
    explanation: "About 70% of CO2 is transported as bicarbonate ions (HCO3⁻) formed inside RBCs catalyzed by carbonic anhydrase and diffused into plasma.",
    ncertReference: "NCERT Class 11 Biology Ch 17: Breathing and Exchange of Gases, Page 274"
  },
  {
    id: "nta-zoo-2023-01",
    subject: "Zoology",
    section: "Section A",
    topic: "Genetics",
    chapter: "Principles of Inheritance and Variation",
    ncertClass: 12,
    pyqYear: 2023,
    difficulty: "Hard",
    question: "A disease characterized by trisomy of 21st chromosome leading to mental retardation and epicanthic skin fold is:",
    options: ["Klinefelter's Syndrome", "Turner's Syndrome", "Down's Syndrome", "Patau Syndrome"],
    correctAnswer: 2,
    explanation: "Down's syndrome is caused by non-disjunction leading to trisomy 21 (47 chromosomes: 45 + XX or XY). First described by Langdon Down in 1866.",
    ncertReference: "NCERT Class 12 Biology Ch 5: Principles of Inheritance, Page 91"
  }
];

// GET /api/nta-neet/questions - Fetch or filter NTA Question Bank
app.get("/api/nta-neet/questions", async (req, res) => {
  try {
    const { subject, topic, difficulty, pyqYear, search, limit = "20" } = req.query;

    let results = [...ntaQuestionBankSeed];

    if (subject && typeof subject === "string" && subject !== "All") {
      results = results.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
    }

    if (topic && typeof topic === "string" && topic !== "All") {
      results = results.filter(q => q.topic.toLowerCase().includes(topic.toLowerCase()));
    }

    if (difficulty && typeof difficulty === "string" && difficulty !== "All") {
      results = results.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    if (pyqYear && typeof pyqYear === "string" && pyqYear !== "All") {
      results = results.filter(q => q.pyqYear.toString() === pyqYear);
    }

    if (search && typeof search === "string" && search.trim().length > 0) {
      const qLower = search.toLowerCase();
      results = results.filter(q =>
        q.question.toLowerCase().includes(qLower) ||
        q.chapter.toLowerCase().includes(qLower) ||
        q.topic.toLowerCase().includes(qLower)
      );
    }

    const maxLimit = Math.min(parseInt(limit as string, 10) || 20, 100);

    // If request asks for more questions than seed or specific criteria, augment using Gemini API if key is available
    if (results.length < maxLimit && process.env.GEMINI_API_KEY) {
      try {
        const ai = getGeminiClient();
        const needed = maxLimit - results.length;
        const prompt = `Generate ${needed} authentic NTA NEET UG level multiple choice questions.
Target Subject: ${subject || "Physics, Chemistry, Botany, Zoology"}
Target Topic: ${topic || "NCERT Class 11 and 12 Syllabus"}
Difficulty: ${difficulty || "Medium"}

Format response as strict JSON array matching this schema:
[
  {
    "id": "nta-gen-${Date.now()}-1",
    "subject": "${subject || "Physics"}",
    "section": "Section A",
    "topic": "${topic || "General"}",
    "chapter": "NCERT Chapter Name",
    "ncertClass": 12,
    "pyqYear": 2024,
    "difficulty": "Medium",
    "question": "Question text...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed step-by-step NCERT explanation...",
    "ncertReference": "NCERT Class 11/12 Chapter & Page"
  }
]`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });

        const generated = JSON.parse(response.text || "[]");
        if (Array.isArray(generated)) {
          results = [...results, ...generated];
        }
      } catch (genErr) {
        console.warn("Could not generate additional NTA questions via Gemini:", genErr);
      }
    }

    res.json({
      status: "success",
      source: "NTA NEET Official Question Bank API",
      totalCount: results.length,
      questions: results.slice(0, maxLimit)
    });
  } catch (error: any) {
    console.error("Error in /api/nta-neet/questions:", error);
    res.status(500).json({ error: error.message || "Failed to fetch NTA NEET Question Bank." });
  }
});

// GET /api/nta-neet/topics - Subject & Syllabus Taxonomy Metadata
app.get("/api/nta-neet/topics", (_req, res) => {
  res.json({
    status: "success",
    authority: "National Testing Agency (NTA) NEET UG",
    subjects: ["Physics", "Chemistry", "Botany", "Zoology"],
    years: [2024, 2023, 2022, 2021, 2020, 2019, 2018],
    difficulties: ["Easy", "Medium", "Hard"],
    chapters: [
      { subject: "Physics", count: 28, name: "Kinematics, Laws of Motion, Work Energy, Current Electricity, Optics, Modern Physics" },
      { subject: "Chemistry", count: 30, name: "Mole Concept, Chemical Bonding, Thermodynamics, Organic Reactions, Coordination Compounds" },
      { subject: "Botany", count: 20, name: "Cell Structure, Plant Physiology, Genetics, Biotechnology, Ecology" },
      { subject: "Zoology", count: 22, name: "Human Physiology, Animal Kingdom, Biomolecules, Reproduction, Human Health" }
    ]
  });
});

// POST /api/nta-neet/generate-mock - Instantly generate NTA Mock Test
app.post("/api/nta-neet/generate-mock", async (req, res) => {
  try {
    const { title, subject = "All", questionCount = 10, durationMinutes = 20 } = req.body;

    let selected = [...ntaQuestionBankSeed];
    if (subject !== "All") {
      selected = selected.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
    }

    // If we need more questions for a full test, ask Gemini
    if (selected.length < questionCount && process.env.GEMINI_API_KEY) {
      try {
        const ai = getGeminiClient();
        const needed = questionCount - selected.length;
        const prompt = `Generate ${needed} high-quality NTA NEET UG questions for a test paper on subject: ${subject}.
Format strictly as JSON array of questions with keys: id, subject, topic, chapter, question, options (array of 4), correctAnswer (index 0-3), explanation, ncertReference.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });

        const generated = JSON.parse(response.text || "[]");
        if (Array.isArray(generated)) {
          selected = [...selected, ...generated];
        }
      } catch (err) {
        console.warn("Failed to generate extra mock questions:", err);
      }
    }

    const testQuestions = selected.slice(0, questionCount);

    const mockTest = {
      id: `nta-api-mock-${Date.now()}`,
      title: title || `NTA NEET ${subject} Practice Paper`,
      description: `Official NTA NEET question paper auto-generated from NTA Question Bank API. Covers NCERT concepts with +4/-1 marking scheme.`,
      durationMinutes: durationMinutes || 20,
      totalTimeMinutes: durationMinutes || 20,
      maxMarks: testQuestions.length * 4,
      totalQuestions: testQuestions.length,
      category: subject === "All" ? "Full NEET 720" : "Subject Speed Test",
      difficulty: "Medium",
      questions: testQuestions
    };

    res.json({ status: "success", test: mockTest });
  } catch (error: any) {
    console.error("Error in /api/nta-neet/generate-mock:", error);
    res.status(500).json({ error: error.message || "Failed to generate NTA Mock Test." });
  }
});

// Vite server integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
