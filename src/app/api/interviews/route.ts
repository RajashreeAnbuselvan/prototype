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
        let interviews = await Interview.find({}).sort({ createdAt: -1 });

        // Auto-seed if empty
        if (interviews.length === 0) {
            await Interview.insertMany(initialHistory);
            interviews = await Interview.find({}).sort({ createdAt: -1 });
        }

        return NextResponse.json(interviews);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const interview = await Interview.create(body);
        return NextResponse.json(interview, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
