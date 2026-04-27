import dotenv from 'dotenv';
import path from 'path';

// Load env vars first
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const initialHistory = [
    {
        company: "Google",
        role: "Software Engineer",
        date: "Dec 28",
        status: "Completed",
        score: 92,
        type: "Technical",
        questions: [],
        responses: [],
        feedbacks: []
    },
    {
        company: "Amazon",
        role: "Product Manager",
        date: "Dec 20",
        status: "Completed",
        score: 85,
        type: "Behavioral",
        questions: [],
        responses: [],
        feedbacks: []
    },
    {
        company: "Meta",
        role: "Frontend Lead",
        date: "Dec 15",
        status: "In-Progress",
        score: 0,
        type: "System Design",
        questions: [],
        responses: [],
        feedbacks: []
    },
    {
        company: "Netflix",
        role: "Backend Developer",
        date: "Dec 10",
        status: "Completed",
        score: 78,
        type: "Technical",
        questions: [],
        responses: [],
        feedbacks: []
    },
];

async function seed() {
    try {
        console.log("Loading modules...");
        // Dynamic imports to ensure env vars are loaded first
        const { default: dbConnect } = await import('./src/lib/mongodb');
        const { default: Interview } = await import('./src/models/Interview');

        console.log("Connecting to MongoDB...");
        await dbConnect();
        console.log("Connected to MongoDB");

        // Check if data already exists
        const count = await Interview.countDocuments();
        if (count === 0) {
            console.log("Seeding initial history...");
            await Interview.insertMany(initialHistory);
            console.log("Successfully seeded database!");
        } else {
            console.log("Database already contains data, skipping seed.");
        }
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seed();
