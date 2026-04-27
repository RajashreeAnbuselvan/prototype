"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Filter, Download, MoreVertical, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

const initialDetailedHistory = [
    { id: 1, company: "Google", role: "Software Engineer", date: "Dec 28", status: "Completed", score: "92%", type: "Technical" },
    { id: 2, company: "Amazon", role: "Product Manager", date: "Dec 20", status: "Completed", score: "85%", type: "Behavioral" },
    { id: 3, company: "Meta", role: "Frontend Lead", date: "Dec 15", status: "In-Progress", score: "--", type: "System Design" },
    { id: 4, company: "Netflix", role: "Backend Developer", date: "Dec 10", status: "Completed", score: "78%", type: "Technical" },
];

export default function HistoryPage() {
    const [history, setHistory] = React.useState<any[]>([]);

    React.useEffect(() => {
        async function fetchHistory() {
            try {
                const response = await fetch('/api/interviews');
                if (!response.ok) throw new Error('Failed to fetch history');
                const data = await response.json();

                if (data && data.length > 0) {
                    const formatted = data.map((item: any) => ({
                        ...item,
                        id: item._id, // Use MongoDB _id as id
                        score: typeof item.score === 'number' ? `${item.score}%` : item.score
                    }));
                    setHistory(formatted);
                } else {
                    // Fallback to localStorage for existing items not yet in DB
                    const saved = localStorage.getItem('prepBuddy_interviewHistory');
                    if (saved) {
                        const parsed = JSON.parse(saved);
                        const formatted = parsed.map((item: any) => ({
                            ...item,
                            score: typeof item.score === 'number' ? `${item.score}%` : item.score
                        }));
                        setHistory(formatted);
                    } else {
                        setHistory(initialDetailedHistory);
                    }
                }
            } catch (error) {
                console.error("Error loading history from API", error);
                // Fallback to localStorage on error
                const saved = localStorage.getItem('prepBuddy_interviewHistory');
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved);
                        const formatted = parsed.map((item: any) => ({
                            ...item,
                            score: typeof item.score === 'number' ? `${item.score}%` : item.score
                        }));
                        setHistory(formatted);
                    } catch (e) {
                        setHistory(initialDetailedHistory);
                    }
                } else {
                    setHistory(initialDetailedHistory);
                }
            }
        }
        fetchHistory();
    }, []);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard"><ChevronLeft className="w-5 h-5" /></Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Interview History</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="h-9">
                        <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                    <Button className="bg-google-blue h-9">
                        New Session
                    </Button>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Filter by company, role or date..." className="pl-10 h-10 bg-white" />
                </div>
                <Button variant="outline" className="h-10">
                    <Filter className="w-4 h-4 mr-2" /> Filters
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Company & Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Score</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {history.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">
                                                {item.company[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">{item.company}</div>
                                                <div className="text-xs text-slate-500">{item.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{item.date}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className="text-[10px] font-medium border-slate-200">{item.type}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-black text-google-blue">{item.score}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={item.status === "Completed" ? "default" : "secondary"} className={item.status === "Completed" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-blue-100 text-blue-700 hover:bg-blue-100"}>
                                            {item.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-slate-600">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
