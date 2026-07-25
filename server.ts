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
