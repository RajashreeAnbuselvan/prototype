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
        type: "Coding",
        text: "Implement a function to handle real-time playback buffer management.",
        hint: "Consider memory constraints and priority-based data prefetching."
    },
    {
        id: 4,
        type: "System Design",
        text: "Design a recommendation engine that updates based on immediate user playback history.",
        hint: "Discuss stream processing (Kafka/Flink) vs. batch processing."
    },
    {
        id: 5,
        type: "Behavioral",
        text: "A critical service goes down during a major show premiere. You're the lead on call. What's your immediate communication and mitigation strategy?",
        hint: "Transparency, incident response roles, and root cause analysis later."
    }
];

export const getQuestions = (company: string): Question[] => {
    const normalized = company.toLowerCase();
    if (normalized === "netflix") return netflixQuestions;
    return googleQuestions; // Default to Google
};
