"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, History, TrendingUp, ChevronRight, Info, Plus, LayoutDashboard, Search, Calendar, BookOpen, Clock, Sparkles, Target, Zap, ShieldAlert, Check, ThumbsUp, ThumbsDown, Award, BarChart3 } from "lucide-react";
import { MockInterviewModal } from "@/components/MockInterviewModal";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { isGeminiMockMode } from "@/lib/gemini";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Initial interview history data
const initialHistory = [
    { company: "Google", role: "Software Engineer", date: "Dec 28", status: "Completed", score: 92 },
    { company: "Amazon", role: "Product Manager", date: "Dec 20", status: "Completed", score: 85 },
    { company: "Meta", role: "Frontend Lead", date: "Dec 15", status: "In-Progress", score: 0 },
    { company: "Netflix", role: "Backend Developer", date: "Dec 10", status: "Completed", score: 78 },
];

export default function DashboardPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dashboardHistory, setDashboardHistory] = useState(initialHistory);

    // Personalization state
    const [targetCompany, setTargetCompany] = useState("Google");
    const [targetRole, setTargetRole] = useState("Software Engineer");
    const [targetLevel, setTargetLevel] = useState("L3 (Entry Level)");

    // Readiness score state
    const [readinessScore, setReadinessScore] = useState(72);
    const [readinessBreakdown, setReadinessBreakdown] = useState({
        technical: 68,
        communication: 82,
        confidence: 75,
        speed: 64
    });

    // AI Insight state
    const [weeklyInsight, setWeeklyInsight] = useState("Analyzing your performance data...");
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);

    // Sync dashboardHistory with MongoDB/localStorage
    useEffect(() => {
        async function fetchHistory() {
            try {
                const response = await fetch('/api/interviews');
                if (!response.ok) throw new Error('Failed to fetch history');
                const data = await response.json();

                if (data && data.length > 0) {
                    setDashboardHistory(data);

                    // Dynamically calculate readiness score based on last 5 interviews
                    const completed = data.filter((i: any) => i.status === "Completed");
                    if (completed.length > 0) {
                        const avg = Math.round(completed.reduce((acc: number, curr: any) => acc + curr.score, 0) / completed.length);
                        setReadinessScore(avg);

                        // Mock breakdown update based on scores
                        setReadinessBreakdown({
                            technical: Math.min(100, avg - 5),
                            communication: Math.min(100, avg + 8),
                            confidence: Math.min(100, avg + 2),
                            speed: Math.min(100, avg - 10)
                        });
                    }
                } else {
                    // Fallback to localStorage
                    const saved = localStorage.getItem('prepBuddy_interviewHistory');
                    if (saved) {
                        try {
                            const parsed = JSON.parse(saved);
                            setDashboardHistory(parsed);
                            if (parsed.length > 0) {
                                const avg = Math.round(parsed.reduce((acc: number, curr: any) => acc + curr.score, 0) / parsed.length);
                                setReadinessScore(avg || 72);
                            }
                        } catch (e) { }
                    }
                }
            } catch (error) {
                console.error("Error loading dashboard history from API", error);
            }
        }

        async function getRealTimeInsight(history: any[]) {
            if (!history || history.length === 0) return;
            setIsLoadingInsight(true);
            try {
                const res = await fetch('/api/generate-insight', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ history }),
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.insight) setWeeklyInsight(data.insight);
                }
            } catch (e) {
                console.error("Error fetching AI insight:", e);
            } finally {
                setIsLoadingInsight(false);
            }
        }

        fetchHistory().then(() => {
            // After history is fetched (and dashboardHistory state is set), get insight
            // We use the local data from the fetchHistory closure if possible
        });
    }, []);

    // Secondary effect to trigger AI insight when history changes
    useEffect(() => {
        if (dashboardHistory.length > 0 && dashboardHistory !== initialHistory) {
            const fetchInsight = async () => {
                setIsLoadingInsight(true);
                try {
                    const res = await fetch('/api/generate-insight', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ history: dashboardHistory }),
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data.insight) setWeeklyInsight(data.insight);
                    }
                } catch (e) {
                    console.error("Error fetching AI insight:", e);
                } finally {
                    setIsLoadingInsight(false);
                }
            };
            fetchInsight();
        }
    }, [dashboardHistory]);

    const [chartData, setChartData] = useState<Array<{ name: string, score: number }>>([]);
    const [totalInterviews, setTotalInterviews] = useState(0);
    const [avgScore, setAvgScore] = useState(0);
    const [growthPercentage, setGrowthPercentage] = useState(0);

    // Schedule and Module modals
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [isModuleOpen, setIsModuleOpen] = useState(false);
    const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);

    // Scheduled sessions state
    const [scheduledSessions, setScheduledSessions] = useState<Array<{
        id: string;
        title: string;
        type: string;
        date: string;
        time: string;
        frequency: string;
        duration: string;
    }>>([]);

    // Form inputs for scheduling
    const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
    const [scheduleTime, setScheduleTime] = useState("18:00");

    // Load scheduled sessions from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('scheduledSessions');
        if (saved) {
            try {
                setScheduledSessions(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading scheduled sessions:', e);
            }
        }
    }, []);

    // Save scheduled sessions to localStorage whenever they change
    useEffect(() => {
        if (scheduledSessions.length > 0) {
            localStorage.setItem('scheduledSessions', JSON.stringify(scheduledSessions));
        } else {
            localStorage.removeItem('scheduledSessions');
        }
    }, [scheduledSessions]);

    // Session history state
    const [sessionHistory, setSessionHistory] = useState<Array<{
        id: string;
        title: string;
        type: string;
        date: string;
        time: string;
        status: string;
    }>>([]);

    // Load session history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('sessionHistory');
        if (saved) {
            try {
                setSessionHistory(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading session history:', e);
            }
        }
    }, []);

    // Save session history to localStorage
    useEffect(() => {
        if (sessionHistory.length > 0) {
            localStorage.setItem('sessionHistory', JSON.stringify(sessionHistory));
        }
    }, [sessionHistory]);

    // Calculate dynamic stats based on interview history
    useEffect(() => {
        const completedInterviews = dashboardHistory.filter(item => item.status === "Completed");
        setTotalInterviews(completedInterviews.length);

        if (completedInterviews.length > 0) {
            const total = completedInterviews.reduce((sum, item) => sum + item.score, 0);
            const average = Math.round(total / completedInterviews.length);
            setAvgScore(average);

            // Calculate growth percentage (comparing last 2 interviews)
            if (completedInterviews.length >= 2) {
                const lastScore = completedInterviews[0].score;
                const previousScore = completedInterviews[1].score;
                const growth = Math.round(((lastScore - previousScore) / previousScore) * 100);
                setGrowthPercentage(growth);
            }

            // Generate chart data from completed interviews
            const chartPoints = completedInterviews.reverse().map((item, idx) => ({
                name: item.date,
                score: item.score
            }));
            setChartData(chartPoints);
        }
    }, [dashboardHistory]);

    const handleScheduleConfirm = () => {
        const newSession = {
            id: Date.now().toString(),
            title: selectedRecommendation?.title || "",
            type: selectedRecommendation?.type || "",
            date: scheduleDate,
            time: scheduleTime,
            frequency: selectedRecommendation?.sessions || "",
            duration: selectedRecommendation?.duration || ""
        };
        setScheduledSessions([...scheduledSessions, newSession]);
        setIsScheduleOpen(false);
        // Reset form
        setScheduleDate(new Date().toISOString().split('T')[0]);
        setScheduleTime("18:00");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        Candidate Dashboard
                        <Badge variant="outline" className="text-[10px] bg-blue-50 text-google-blue border-blue-100 uppercase font-black tracking-widest">AI COACH ACTIVE</Badge>
                        {isGeminiMockMode() && (
                            <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-600 border-amber-100 uppercase font-black tracking-widest animate-pulse">
                                Mock Mode
                            </Badge>
                        )}
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">Welcome back! Your interview readiness is trending up.</p>
                </div>
            </div>

            {/* Top Metrics: Professional Vibrant Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Global Readiness Score - High End Gradient */}
                <Card className="lg:col-span-2 overflow-hidden border-none shadow-2xl bg-gradient-vibrant text-white relative group animate-glow">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Award className="w-5 h-5 text-blue-200" />
                                        <h3 className="text-lg font-bold text-blue-50">Predictive Readiness Score</h3>
                                    </div>
                                    <p className="text-blue-100/90 text-[10px] font-black uppercase tracking-widest">Global Readiness Quotient</p>
                                </div>
                                <div className="flex items-end gap-4">
                                    <span className="text-7xl font-black tracking-tighter drop-shadow-lg">{readinessScore}%</span>
                                    <div className="flex items-center text-emerald-400 text-sm font-black bg-white/20 backdrop-blur-md px-3 py-1 rounded-full mb-3 shadow-lg border border-white/10">
                                        <TrendingUp className="size-4 mr-1.5" />
                                        +5.2%
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] text-blue-100 font-bold uppercase">
                                            <span>Technical</span>
                                            <span>{readinessBreakdown.technical}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-blue-900/30 rounded-full overflow-hidden">
                                            <div className="h-full bg-white rounded-full" style={{ width: `${readinessBreakdown.technical}%` }} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] text-blue-100 font-bold uppercase">
                                            <span>Communication</span>
                                            <span>{readinessBreakdown.communication}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-blue-900/30 rounded-full overflow-hidden">
                                            <div className="h-full bg-white rounded-full" style={{ width: `${readinessBreakdown.communication}%` }} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] text-blue-100 font-bold uppercase">
                                            <span>Confidence</span>
                                            <span>{readinessBreakdown.confidence}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-blue-900/30 rounded-full overflow-hidden">
                                            <div className="h-full bg-white rounded-full" style={{ width: `${readinessBreakdown.confidence}%` }} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] text-blue-100 font-bold uppercase">
                                            <span>Speed</span>
                                            <span>{readinessBreakdown.speed}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-blue-900/30 rounded-full overflow-hidden">
                                            <div className="h-full bg-white rounded-full" style={{ width: `${readinessBreakdown.speed}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:flex flex-col items-center justify-center space-y-3 bg-white/10 p-6 rounded-3xl border border-white/20 backdrop-blur-xl shadow-2xl">
                                <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Peak Target</span>
                                <div className="text-4xl font-black tracking-tighter">90%</div>
                                <div className="text-[10px] text-center text-blue-200 font-bold max-w-[80px] leading-tight">Needed for {targetCompany}</div>
                                <Button size="sm" className="bg-white text-google-blue hover:bg-white/90 text-xs h-8 px-6 font-black shadow-xl shadow-blue-900/40 mt-1" onClick={() => setIsModalOpen(true)}>
                                    ACCELERATE
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Weekly AI Insight - Premium Glass Card */}
                <Card className="glass-card overflow-hidden border-none shadow-premium transition-all hover:-translate-y-1 duration-300 group">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-google-blue animate-pulse" />
                            Weekly AI Insight
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 flex flex-col justify-between h-full">
                        <div className="p-5 bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-2xl border border-blue-100/50 group-hover:bg-white transition-all shadow-inner min-h-[100px] flex items-center relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Sparkles className="size-16 text-google-blue" />
                            </div>
                            {isLoadingInsight ? (
                                <div className="w-full space-y-2 animate-pulse">
                                    <div className="h-3 bg-slate-200 rounded-full w-full"></div>
                                    <div className="h-3 bg-slate-200 rounded-full w-5/6"></div>
                                    <div className="h-3 bg-slate-200 rounded-full w-4/6"></div>
                                </div>
                            ) : (
                                <p className="text-xs leading-relaxed text-slate-700 font-bold italic z-10">
                                    "{weeklyInsight}"
                                </p>
                            )}
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 font-black uppercase tracking-tighter">Strategic Impact</span>
                                <span className="text-google-blue font-black tracking-widest">85%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-gradient-to-r from-google-blue to-vibrant-purple rounded-full" style={{ width: '85%' }} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Card 1: Mock Interview Action */}
                {/* Card 1: Mock Interview - Action Hero */}
                <Card className="overflow-hidden border-none shadow-premium glass-card group relative transition-all hover:-translate-y-1 duration-300">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center space-x-2 font-black text-slate-800">
                            <div className="size-8 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Play className="size-4 text-google-blue fill-google-blue" />
                            </div>
                            <span className="uppercase tracking-widest text-xs">Dynamic Mock</span>
                        </CardTitle>
                        <CardDescription className="font-bold text-[10px] text-slate-400">PRACTICE WITH LIVE AI</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border border-slate-100 group-hover:bg-white transition-all shadow-inner">
                            <h4 className="text-xs font-black mb-1">TARGET: <span className="text-google-blue">{targetCompany}</span></h4>
                            <p className="text-[10px] text-slate-500 font-bold">Focus: System Design & Algorithms</p>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-black tracking-widest uppercase">
                            <span>45m Duration</span>
                            <Badge className="bg-orange-50 text-orange-600 border-none text-[9px]">HARD</Badge>
                        </div>
                        <Button className="w-full bg-google-blue hover:bg-google-blue/90 text-white font-black tracking-widest shadow-lg shadow-blue-500/20 py-6 rounded-2xl" onClick={() => setIsModalOpen(true)}>
                            LAUNCH SESSION
                        </Button>
                    </CardContent>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-google-blue/5 rounded-full -mr-8 -mt-8 group-hover:scale-125 transition-transform duration-700" />
                </Card>

                {/* Card 2: Interview History - Glass Layer */}
                <Card className="flex flex-col border-none shadow-premium glass-card overflow-hidden transition-all hover:-translate-y-1 duration-300">
                    <CardHeader className="pb-3 border-b border-slate-100/50">
                        <CardTitle className="flex items-center space-x-2 font-black text-slate-800">
                            <div className="size-8 rounded-xl bg-purple-50 flex items-center justify-center">
                                <History className="size-4 text-vibrant-purple" />
                            </div>
                            <span className="uppercase tracking-widest text-xs">Performance log</span>
                        </CardTitle>
                        <CardDescription className="font-bold text-[10px] text-slate-400">RECENT ANALYTICS</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <ScrollArea className="h-[200px]">
                            <div className="divide-y divide-slate-100">
                                {dashboardHistory.map((item, idx) => (
                                    <Link key={idx} href="/dashboard/history" className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">
                                                {item.company[0]}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold">{item.company}</h4>
                                                <p className="text-[10px] text-slate-400">{item.role} • {item.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Badge variant={item.status === "Completed" ? "default" : "secondary"} className={item.status === "Completed" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-blue-100 text-blue-700 hover:bg-blue-100"}>
                                                {item.status}
                                            </Badge>
                                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-google-blue group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Card 3: Analytics & Growth - Glass Layer */}
                <Card className="border-none shadow-premium glass-card overflow-hidden transition-all hover:-translate-y-1 duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100/50">
                        <Link href="/dashboard/analytics" className="space-y-1 hover:underline group">
                            <CardTitle className="flex items-center space-x-2 font-black text-slate-800">
                                <div className="size-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <TrendingUp className="size-4 text-vibrant-emerald" />
                                </div>
                                <span className="uppercase tracking-widest text-xs">Growth Map</span>
                            </CardTitle>
                            <CardDescription className="font-bold text-[10px] text-slate-400">SKILL TRAJECTORY</CardDescription>
                        </Link>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                        <Info className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Aggregated performance score across coding, communication, and system design.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardHeader>
                    <CardContent>
                        <Link href="/dashboard/analytics">
                            <div className="h-[140px] w-full mt-4 cursor-pointer">
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={100}>
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#4285F4" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                            <XAxis dataKey="name" hide />
                                            <RechartsTooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                                itemStyle={{ color: '#4285F4', fontWeight: 'bold' }}
                                            />
                                            <Area type="monotone" dataKey="score" stroke="#4285F4" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                                        Complete interviews to see your growth
                                    </div>
                                )}
                            </div>
                        </Link>
                        <div className={`mt-4 flex items-center justify-between p-3 rounded-xl border ${growthPercentage >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-orange-50 border-orange-100'}`}>
                            <span className={`text-[11px] font-medium ${growthPercentage >= 0 ? 'text-emerald-700' : 'text-orange-700'}`}>
                                Recent Improvement: {growthPercentage >= 0 ? '+' : ''}{growthPercentage}%
                            </span>
                            <Button size="sm" variant="link" className={`h-auto p-0 text-[11px] font-bold ${growthPercentage >= 0 ? 'text-emerald-700' : 'text-orange-700'}`} asChild>
                                <Link href="/dashboard/analytics">Review Feedback</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Sessions */}
            {scheduledSessions.length > 0 && (
                <section className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-google-blue" />
                        <h3 className="font-bold text-lg">Upcoming Sessions</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {scheduledSessions.map((session) => (
                            <Card key={session.id} className="border-none shadow-sm glass-card border-l-4 border-l-emerald-500 group">
                                <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                                <Calendar className="size-4 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-xs text-slate-800">{session.title}</h4>
                                                <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-medium">
                                                    <span>{new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                    <span>•</span>
                                                    <span>{session.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Badge variant="secondary" className="text-[9px] bg-slate-100 text-slate-600 border-none px-2">{session.duration}</Badge>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-slate-300 hover:text-red-500 hover:bg-red-50"
                                                onClick={() => {
                                                    setScheduledSessions(scheduledSessions.filter(s => s.id !== session.id));
                                                }}
                                            >
                                                <Plus className="w-3.5 h-3.5 rotate-45" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}




            {/* AI Recommendations */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-google-blue" />
                        <h3 className="font-bold text-lg">Next Steps for You</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Compact Recommendation 1 */}
                    <Card className="border-none shadow-premium glass-card border-l-4 border-l-vibrant-purple hover:-translate-y-1 transition-all group">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h4 className="font-black text-sm text-slate-800 uppercase tracking-tight">Optimize Complexity Logic</h4>
                                    <p className="text-[11px] text-slate-500 font-medium">Refine "Big O" verbal delivery for {targetCompany}.</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-black text-vibrant-purple">+12%</span>
                                    <p className="text-[8px] text-slate-400 font-bold uppercase">Impact</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 20m</span>
                                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> 2x/wk</span>
                                <span className="text-google-blue bg-blue-50 px-2 py-0.5 rounded-full">Technical</span>
                            </div>
                            <div className="flex gap-2">
                                <Button className="flex-1 bg-google-blue hover:bg-google-blue/90 text-white font-bold h-8 text-[10px]" asChild>
                                    <Link href={`/dashboard/interview?company=${encodeURIComponent(targetCompany)}&role=${encodeURIComponent(targetRole)}&module=technical`}>
                                        START
                                    </Link>
                                </Button>
                                <Button variant="outline" className="flex-1 border-slate-200 text-slate-700 h-8 text-[10px] font-bold" onClick={() => setIsScheduleOpen(true)}>SCHEDULE</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Compact Recommendation 2 */}
                    <Card className="border-none shadow-premium glass-card border-l-4 border-l-vibrant-pink hover:-translate-y-1 transition-all group">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h4 className="font-black text-sm text-slate-800 uppercase tracking-tight">Active STAR Precision</h4>
                                    <p className="text-[11px] text-slate-500 font-medium">Master reflective listening for behavioral rounds.</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-black text-vibrant-pink">+15%</span>
                                    <p className="text-[8px] text-slate-400 font-bold uppercase">Impact</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 15m</span>
                                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Daily</span>
                                <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Soft Skills</span>
                            </div>
                            <div className="flex gap-2">
                                <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold h-8 text-[10px]" onClick={() => setIsModuleOpen(true)}>LAUNCH</Button>
                                <Button variant="outline" className="flex-1 border-slate-200 text-slate-700 h-8 text-[10px] font-bold" onClick={() => { }}>SAVED</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Schedule Modal */}
            <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-google-blue" />
                            <span>Schedule Practice Sessions</span>
                        </DialogTitle>
                        <DialogDescription>
                            Set up your {selectedRecommendation?.title} practice schedule
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="session-type">Session Type</Label>
                            <Input id="session-type" value={selectedRecommendation?.type || ""} disabled />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="frequency">Frequency</Label>
                                <Input id="frequency" value={selectedRecommendation?.sessions || ""} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input id="duration" value={selectedRecommendation?.duration || ""} disabled />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="start-date">Start Date</Label>
                            <Input
                                id="start-date"
                                type="date"
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="preferred-time">Preferred Time</Label>
                            <Input
                                id="preferred-time"
                                type="time"
                                value={scheduleTime}
                                onChange={(e) => setScheduleTime(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>Cancel</Button>
                        <Button className="bg-google-blue hover:bg-google-blue/90" onClick={handleScheduleConfirm}>
                            Confirm Schedule
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Module Modal */}
            <Dialog open={isModuleOpen} onOpenChange={setIsModuleOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <BookOpen className="w-5 h-5 text-purple-600" />
                            <span>{selectedRecommendation?.title}</span>
                        </DialogTitle>
                        <DialogDescription>
                            {selectedRecommendation?.description}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
                            <Clock className="w-5 h-5 text-purple-600" />
                            <div>
                                <p className="text-sm font-medium">Duration: {selectedRecommendation?.duration}</p>
                                <p className="text-xs text-slate-500">Level: {selectedRecommendation?.level}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Module Content:</h4>
                            <ul className="space-y-2">
                                {selectedRecommendation?.lessons?.map((lesson: string, idx: number) => (
                                    <li key={idx} className="flex items-center space-x-2 text-sm">
                                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                                            {idx + 1}
                                        </div>
                                        <span>{lesson}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModuleOpen(false)}>Close</Button>
                        <Button className="bg-purple-600 hover:bg-purple-700" asChild>
                            <Link href={`/dashboard/interview?company=${encodeURIComponent(targetCompany)}&role=${encodeURIComponent(targetRole)}&module=soft_skills`}>
                                Start Module
                            </Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <MockInterviewModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
        </div>
    );
}
