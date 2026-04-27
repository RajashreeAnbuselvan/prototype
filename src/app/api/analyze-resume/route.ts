import { NextResponse } from 'next/server';
import { analyzeResume } from '@/lib/gemini';

export async function POST(request: Request) {
    try {
        const { resumeText } = await request.json();

        if (!resumeText) {
            return NextResponse.json({ error: 'Resume text is required' }, { status: 400 });
        }

        const result = await analyzeResume(resumeText);

        if (!result) {
            return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('API error analyzing resume:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
