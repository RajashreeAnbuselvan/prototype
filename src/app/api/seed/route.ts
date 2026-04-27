import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Interview from '@/models/Interview';

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

export async function GET() {
    try {
        await dbConnect();

        // Check if data already exists
        const count = await Interview.countDocuments();
        if (count === 0) {
            await Interview.insertMany(initialHistory);
            return NextResponse.json({ message: "Successfully seeded database!" });
        } else {
            return NextResponse.json({ message: "Database already contains data, skipping seed." });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
