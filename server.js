require("dotenv").config();

const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = 3000;

if (!process.env.GEMINI_API_KEY) {
    console.error("Missing GEMINI_API_KEY in .env");
    process.exit(1);
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json({ limit: "10kb" }));
app.use(express.static("public"));

app.post("/api/ask", async (req, res) => {
    try {
        const { question, subject } = req.body;

        if (
            typeof question !== "string" ||
            typeof subject !== "string" ||
            !question.trim() ||
            question.length > 2000 ||
            subject.length > 60
        ) {
            return res.status(400).json({
                error: "Enter a valid question and subject."
            });
        }

        const prompt = `
You are StudyPilot AI, a friendly educational tutor.

Subject: ${subject}
Student's question: ${question.trim()}

Teaching rules:
- Explain concepts clearly and step by step.
- Use examples appropriate for students.
- For mathematics, show the working.
- Encourage understanding, not just memorization.
- If the question is unclear, ask for clarification.
- If you are unsure of a fact, say so.
- Keep the answer focused and easy to read.
`;

        const result = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt
        });

        res.json({
            answer: result.text || "I couldn't generate an answer. Please try again."
        });

    } catch (error) {
        console.error("Tutor request failed:", error.message);

        res.status(500).json({
            error: "The AI tutor is temporarily unavailable. Please try again."
        });
    }
});

app.listen(PORT, () => {
    console.log(`StudyPilot AI running at http://localhost:${PORT}`);
});