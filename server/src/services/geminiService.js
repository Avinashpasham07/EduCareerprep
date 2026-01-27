const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Lazy load Gemini to prevent crashes if key is missing/invalid
const getGenAI = () => {
    try {
        if (!process.env.GEMINI_API_KEY) return null;
        return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    } catch (e) {
        console.error("Gemini Init Error:", e);
        return null;
    }
};

const questionsData = require('../data/questions');

exports.generateQuestion = async (role, difficulty, history) => {
    console.log(`[LocalAI] generateQuestion called for Role: ${role}`);

    // Safety check for questionsData
    if (!questionsData) {
        console.error("[LocalAI] Error: questionsData is undefined/not loaded!");
        return "Tell me about yourself.";
    }

    // 1. Get questions for the role (or default to HR/General)
    const roleQuestions = questionsData[role] || questionsData["HR"] || [];

    if (!roleQuestions || roleQuestions.length === 0) {
        console.warn(`[LocalAI] No questions found for role: ${role}. Defaulting.`);
        return "Tell me about yourself.";
    }

    // 2. Filter out already asked questions
    const historyTexts = (history || []).map(h => h.text);
    const availableQuestions = roleQuestions.filter(q => !historyTexts.includes(q));

    // 3. Pick a random question
    const pool = availableQuestions.length > 0 ? availableQuestions : roleQuestions;

    if (pool.length === 0) {
        return "Tell me about yourself.";
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    const nextQuestion = pool[randomIndex];

    console.log(`[LocalAI] Selected Question: ${nextQuestion}`);
    return nextQuestion;
};

exports.analyzeResponse = async (role, question, answer) => {
    // Local Logic (No Gemini) for instant feedback
    // Improved Heuristics: Keywords & Sentiment

    const text = answer.trim().toLowerCase();
    const wordCount = text.split(/\s+/).length;
    let classification = "Partial"; // Default to neutral
    let score = 5;

    // 1. Check for Positive/Affirmative words (for behavioral questions)
    const positiveWords = ["yes", "yeah", "sure", "willing", "definitely", "absolutely", "course", "okay", "fine"];
    const isAffirmative = positiveWords.some(w => text.includes(w));

    // 2. Check for Tech Keywords (for technical questions)
    const techKeywords = [
        "react", "html", "css", "javascript", "node", "mongo", "sql", "python", "java", "api", "rest", "component",
        "state", "props", "hooks", "redux", "docker", "aws", "git", "frontend", "backend", "full stack", "design",
        "responsive", "mobile", "testing", "agile", "scrum", "lead", "manage", "organize", "plan"
    ];
    const hasTech = techKeywords.some(w => text.includes(w));

    // Decision Logic
    if (hasTech) {
        classification = "Correct";
        score = 8;
    } else if (isAffirmative) {
        classification = "Correct";
        score = 9; // High score for direct yes/no answers
    } else if (wordCount > 15) {
        classification = "Correct"; // Long detailed answers are usually good
        score = 8;
    } else if (wordCount < 3) {
        classification = "Wrong"; // Too short and no keywords
        score = 3;
    }

    const replies = {
        "Correct": [
            "That sounds great.",
            "Visualizing that... yes, good point.",
            "I appreciate that direct answer.",
            "That fits well with what we're looking for.",
            "Good, that's a solid skill set."
        ],
        "Partial": [
            "Okay, noted.",
            "Interesting.",
            "I see.",
            "Could you elaborate a bit more next time?",
            "Fair enough."
        ],
        "Wrong": [
            "I'm not sure I understood that, but let's continue.",
            "That was quite brief, but moving on.",
            "Okay, let's try another topic.",
            "I might need more detail, but let's proceed."
        ]
    };

    // Pick random reply
    const categoryReplies = replies[classification];
    const randomReply = categoryReplies[Math.floor(Math.random() * categoryReplies.length)];

    return {
        classification,
        reply: randomReply,
        score
    };
};


exports.generateFeedback = async (role, transcript) => {
    try {
        const genAI = getGenAI();
        if (!genAI) throw new Error("Gemini API Key missing");

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const prompt = `
        Analyze this full technical interview for a ${role} position.
        
        Transcript:
        ${JSON.stringify(transcript)}

        Output a JSON object with:
        - "score": (0-100) integer
        - "feedback": [
            { "type": "strength", "text": "...", "icon": "check" },
            { "type": "improvement", "text": "...", "icon": "warning" }
        ] (Max 4 items total)
        - "metrics": {
            "clarity": (0-100),
            "technical": (0-100),
            "confidence": (0-100)
        }
        
        Evaluator Note: Be strict but encouraging.
        RETURN ONLY JSON.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Feedback Error:", error);
        return {
            score: 75,
            feedback: [{ type: "strength", text: "Good engagement.", icon: "check" }],
            metrics: { clarity: 80, technical: 70, confidence: 75 }
        };
    }
};

exports.analyzeProfile = async (profile) => {
    try {
        const genAI = getGenAI();
        if (!genAI) return { score: 70, summary: "AI Service Unavailable", missingSkills: [], suggestions: [] };

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Construct a prompt based on available profile data
        const profileContext = `
            Name: ${profile.name || "Student"}
            Bio: ${profile.bio || "No bio provided"}
            Skills: ${profile.skills ? profile.skills.join(', ') : "No skills listed"}
            Education: ${profile.education || "Not specified"} (${profile.university || ""})
            Experience/Projects: "Not specified"
        `;

        const prompt = `
        Act as an expert Career Counselor and Tech Recruiter.
        Analyze the following student profile:
        ${profileContext}

        Compare this profile against current entry-level industry standards for a Full Stack Developer or Software Engineer role.

        Return a JSON object with this exact structure:
        {
            "score": (Integer 0-100 based on completeness and quality),
            "summary": "2-3 sentence professional summary of the profile's strength.",
            "missingSkills": ["List", "of", "3-5", "critical", "tech", "skills", "missing"],
            "suggestions": ["List", "of", "3", "actionable", "improvements"]
        }
        RETURN ONLY THE JSON STRING. NO MARKDOWN.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Profile Analysis Error:", error);
        // Fallback mock response if API fails
        return {
            score: 70,
            summary: "Profile analysis service is currently unavailable. However, your profile has a good foundation.",
            missingSkills: ["Cloud Platforms", "CI/CD", "Testing Frameworks"],
            suggestions: ["Add more detailed bio", "List specific projects", "Try again later"]
        };
    }
};
