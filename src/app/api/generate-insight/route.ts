import { NextResponse } from 'next/server';
import { generateWeeklyInsight } from '@/lib/gemini';

export async function POST(request: Request) {
    try {
        const { history } = await request.json();

        if (!history || !Array.isArray(history)) {
            return NextResponse.json({ error: 'Valid history is required' }, { status: 400 });
        }

        const insight = await generateWeeklyInsight(history);

        return NextResponse.json({ insight });
    } catch (error) {
        console.error('API error generating insight:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
