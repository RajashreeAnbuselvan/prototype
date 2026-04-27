import mongoose, { Schema, Document } from 'mongoose';

export interface IInterview extends Document {
    company: string;
    role: string;
    date: string;
    status: string;
    score: number;
    type: string;
    questions: Array<{
        id: number;
        type: string;
        text: string;
        hint: string;
    }>;
    responses: string[];
    feedbacks: string[];
    createdAt: Date;
}

const InterviewSchema: Schema = new Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, required: true },
    score: { type: Number, required: true },
    type: { type: String, required: true },
    questions: [
        {
            id: { type: Number, required: true },
            type: { type: String, required: true },
            text: { type: String, required: true },
            hint: { type: String, required: true },
        }
    ],
    responses: [{ type: String }],
    feedbacks: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Interview || mongoose.model<IInterview>('Interview', InterviewSchema);
