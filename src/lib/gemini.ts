import { GoogleGenerativeAI } from "@google/generative-ai";

const getApiKey = () => process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const isGeminiMockMode = () => {
    const key = getApiKey();
    return !key || key === "YOUR_GEMINI_API_KEY_HERE";
};

// Centralized model getter
const getModel = (modelName: string) => {
    const apiKey = getApiKey();
    if (!apiKey || isGeminiMockMode()) return null;

    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: modelName });
};

// Robust execution wrapper - uses Gemini 2.0 models (current stable API)
const executeWithFallback = async (prompt: string | any[]) => {
    const modelsToTry = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-1.5-flash",
        "gemini-1.5-flash-8b",
    ];

    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`[PrepBuddy AI] Attempting model: ${modelName}...`);
            const model = getModel(modelName);
            if (!model) continue;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().trim();

            console.log(`[PrepBuddy AI] Success with model: ${modelName}`);
            return text;
        } catch (e: any) {
            console.warn(`[PrepBuddy AI] Model ${modelName} failed:`, e.message);
            lastError = e;
            continue;
        }
    }

    console.error('[PrepBuddy AI] All models failed. Last error:', lastError?.message);
    return null;
};

export const generateInterviewQuestions = async (
    company: string,
    role: string,
    academicYear: string,
    experience?: string,
    moduleType?: "soft_skills" | "technical"
) => {
    if (isGeminiMockMode()) {
        return [
            { id: 1, type: "Behavioral", text: `Why do you want to work at ${company} as a ${role}?`, hint: "Focus on cultural fit and your passion for their products." },
            { id: 2, type: "Technical", text: `Explain a technical challenge you faced while working as a ${role} ${experience ? `with ${experience} years of experience` : ""}.`, hint: "Use the STAR method to structure your answer." },
            { id: 3, type: "Coding", text: `How would you optimize a data structure for a high-performance system at ${company}?`, hint: "Consider time and space complexity tradeoffs." },
            { id: 4, type: "System Design", text: `Design a scalable architecture for a feature common at ${company}.`, hint: "Think about load balancing, caching, and database sharding." },
            { id: 5, type: "General", text: `As a ${academicYear} student, how do you balance learning new technologies with your current role?`, hint: "Mention specific tools or platforms you use for continuous learning." }
        ];
    }
    try {
        const prompt = `
            You are a professional hiring manager at ${company}.
            Create 5 interview questions for a candidate for a ${role} position.
            Candidate Profile: ${academicYear} student ${experience ? `with ${experience} years of experience` : ""}.
            
            ${moduleType === "soft_skills"
                ? "FOCUS: This is a BEHAVIORAL interview module. All 5 questions MUST be behavioral questions (STAR method, situational, soft skills)."
                : moduleType === "technical"
                    ? "FOCUS: This is a TECHNICAL interview module. All 5 questions MUST be technical, role-specific, or system design questions."
                    : "The questions should be a mix of: 1. Behavioral (2 questions), 2. Technical/Role-specific (2 questions), 3. General/Fit (1 question)"}
            
            Provide the output ONLY as a JSON array of objects with this structure:
            [
              {
                "id": number,
                "type": "Behavioral" | "Coding" | "System Design" | "General",
                "text": "string",
                "hint": "string"
              }
            ]
            Do not include any other text or markdown formatting.
        `;

        const text = await executeWithFallback(prompt);
        if (!text) return [];

        const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating questions:", error);
        return [];
    }
};

export const getGeminiFeedback = async (
    question: string,
    transcript: string,
    company: string,
    role: string,
    academicYear: string,
    experience?: string,
    imageBuffer?: string, // base64 string
    expectedContext?: string // The question hint/keywords
) => {
    if (isGeminiMockMode()) {
        return {
            feedback: `Your explanation for the ${company} role was clear.`,
            bodyLanguage: "You maintained a professional posture.",
            score: 100,
            bodyLanguageScore: 90
        };
    }
    try {
        const textPrompt = `
            You are PrepBuddy AI, a professional interview coach for ${company}.
            The candidate is a ${academicYear} student applying for a ${role} position.
            
            Question: "${question}"
            Expected Keywords/Context: "${expectedContext || 'General technical accuracy'}"
            Candidate's Answer: "${transcript}"
            
            SCORING RULES:
            - If the candidate's answer is highly accurate and includes all key concepts from the "Expected Keywords/Context", give a score of 100.
            - If concepts are missing or incorrect, lower the score accordingly.
            
            RESPONSE STRUCTURE:
            You MUST return a JSON object with exactly these fields:
            1. "feedback": A string with 2 short sentences. Mention if key terms were present or missing.
            2. "bodyLanguage": Analysis of the provided image or general tips.
            3. "score": A number (0-100) based on accuracy and keyword presence.
            4. "bodyLanguageScore": A number (0-100).
            
            Return ONLY the JSON. No other text.
        `;

        const content = imageBuffer ? [textPrompt, { inlineData: { data: imageBuffer, mimeType: "image/jpeg" } }] : textPrompt;
        const text = await executeWithFallback(content);
        if (!text) return { feedback: "I encountered an error.", bodyLanguage: "N/A", score: 0, bodyLanguageScore: 0 };

        const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating Gemini feedback:", error);
        return { feedback: "Error during analysis.", bodyLanguage: "N/A", score: 0, bodyLanguageScore: 0 };
    }
};

export const analyzeResume = async (resumeText: string) => {
    if (isGeminiMockMode()) {
        return {
            matches: [
                { company: "Google", reason: "Strong algorithmic foundation and research experience." },
                { company: "Amazon", reason: "Experience with cloud architectures and scalability." },
                { company: "Stripe", reason: "Clean code practices and interest in fintech systems." }
            ],
            score: 88,
            summary: "Your profile shows a strong balance between technical skill and product thinking, making you a great fit for Tier-1 tech companies."
        };
    }
    try {
        const prompt = `
            You are a career coach and recruiter. 
            Analyze the following resume text and provide:
            1. Top 3 companies that would be a great fit for this candidate.
            2. The primary reasons for these matches.
            3. A compatibility score (0-100) for a "Software Engineer" role.

            Resume Text:
            "${resumeText}"

            Provide the output ONLY as a JSON object:
            {
                "matches": [
                    { "company": "string", "reason": "string" }
                ],
                "score": number,
                "summary": "string"
            }
            Do not include any other text or markdown formatting.
        `;

        const text = await executeWithFallback(prompt);
        if (!text) return null;

        const jsonString = text.replace(/```json\n?|\n?```/g, '');
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error analyzing resume:", error);
        return null;
    }
};

export const generateWeeklyInsight = async (history: any[]) => {
    if (isGeminiMockMode()) {
        return "You're showing great consistency in technical rounds. Focus on refining your system design answers to hit that 90% readiness score!";
    }
    try {
        if (!history || history.length === 0) return "Start your first mock interview to get AI-powered insights!";

        const historyText = JSON.stringify(history.slice(0, 5));
        const prompt = `
            Analyze the following interview history for a candidate:
            ${historyText}

            Provide a single concise sentence (max 25 words) summarizing their progress and the #1 area they should focus on next.
            Focus on technical accuracy, communication, or speed based on their scores.
            Output ONLY the sentence.
        `;

        const text = await executeWithFallback(prompt);
        return text || "Keep practicing to improve your consistency across technical rounds.";
    } catch (error) {
        console.error("Error generating weekly insight:", error);
        return "Keep practicing to improve your consistency across technical rounds.";
    }
};
