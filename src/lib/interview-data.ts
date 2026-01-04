export interface Question {
    id: number;
    type: "Behavioral" | "Coding" | "System Design" | "General";
    text: string;
    hint: string;
}

export const googleQuestions: Question[] = [
    {
        id: 1,
        type: "Behavioral",
        text: "How would you explain MapReduce to a non-technical person?",
        hint: "Focus on the analogy of a large counting task split among many people."
    },
    {
        id: 2,
        type: "Coding",
        text: "Find the first non-repeating character in a string.",
        hint: "Think about frequency counting and order of appearance."
    },
    {
        id: 3,
        type: "System Design",
        text: "Design a system like Google Photos.",
        hint: "Consider storage, indexing, and image processing at scale."
    },
    {
        id: 4,
        type: "Behavioral",
        text: "Tell me about a time you had a conflict with a teammate.",
        hint: "Use the STAR method: Situation, Task, Action, Result."
    },
    {
        id: 5,
        type: "General",
        text: "How do you prioritize tasks when you have multiple deadlines?",
        hint: "Discuss impact, urgency, and stakeholder management."
    }
];

export const netflixQuestions: Question[] = [
    {
        id: 1,
        type: "System Design",
        text: "How would you design a content delivery network (CDN) for high-availability video streaming?",
        hint: "Think about edge locations, caching strategy, and global load balancing."
    },
    {
        id: 2,
        type: "Behavioral",
        text: "Netflix has a unique 'Freedom and Responsibility' culture. How do you decide when to take a risk vs. when to follow established protocol?",
        hint: "Focus on ownership and how you weigh impact on the end user experience."
    },
    {
        id: 3,
        type: "General",
        text: "If you were to greenlight a new original series for the APAC market, which data points would you prioritize vs. your own creative intuition?",
        hint: "Balance algorithmic demand with the 'Judgment' rubric of long-term thinking."
    },
    {
        id: 4,
        type: "Behavioral",
        text: "Tell me about a time you gave extremely direct, difficult feedback to a peer. How did you ensure it was radical candor and not just rudeness?",
        hint: "Focus on the 'Radical Candor' rubric: care personally, challenge directly."
    },
    {
        id: 5,
        type: "General",
        text: "As a Content Strategist, how do you provide 'Context, Not Control' to the creative teams producing our shows?",
        hint: "Discuss empowering partners with data and goals rather than micro-managing creative choices."
    }
];

export const getQuestions = (company: string): Question[] => {
    const normalized = company.toLowerCase();
    if (normalized === "netflix") return netflixQuestions;
    return googleQuestions; // Default to Google
};
