"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, History, TrendingUp, ChevronRight, Info, Plus, LayoutDashboard, Search, Calendar, BookOpen, Clock, Sparkles } from "lucide-react";
import { MockInterviewModal } from "@/components/MockInterviewModal";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Candidate Dashboard</h1>
                    <p className="text-slate-500 text-sm">Welcome back! You're in the top 5% of candidates this week.</p>
                </div>
                <Button className="bg-google-blue hover:bg-google-blue/90 text-white font-medium" onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Interview
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Card 1: Mock Interview Action */}
                <Card className="relative overflow-hidden group hover:border-google-blue/50 transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Play className="w-5 h-5 text-google-blue" />
                            <span>Mock Interview</span>
                        </CardTitle>
                        <CardDescription>Practice with AI in real-time</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-blue-50/50 transition-colors">
                            <h4 className="text-sm font-semibold mb-1">Target Company: <span className="text-google-blue">Google</span></h4>
                            <p className="text-xs text-slate-500">Focus: System Design & Algos</p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                            <span>Avg. Duration: 45m</span>
                            <span>Difficulty: Hard</span>
                        </div>
                        <Button className="w-full bg-google-blue hover:bg-google-blue/90 text-white" onClick={() => setIsModalOpen(true)}>
                            Start Now
                        </Button>
                    </CardContent>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-google-blue/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500" />
                </Card>

                {/* Card 2: Interview History */}
                <Card className="flex flex-col hover:border-google-blue/50 transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <History className="w-5 h-5 text-slate-700" />
                            <span>Interview History</span>
                        </CardTitle>
                        <CardDescription>Recent performance and feedback</CardDescription>
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

                {/* Card 3: Analytics & Growth */}
                <Card className="hover:border-google-blue/50 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <Link href="/dashboard/analytics" className="space-y-1 hover:underline group">
                            <CardTitle className="flex items-center space-x-2 text-base">
                                <TrendingUp className="w-5 h-5 text-emerald-500 group-hover:text-google-blue transition-colors" />
                                <span>Growth Trajectory</span>
                            </CardTitle>
                            <CardDescription className="text-[11px]">Skill improvement over time</CardDescription>
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
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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
                            <Card key={session.id} className="border-l-4 border-l-emerald-500">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-base mb-1">{session.title}</h4>
                                            <p className="text-xs text-slate-500 mb-3">{session.type}</p>
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2 text-sm">
                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                    <span className="text-slate-600">
                                                        {new Date(session.date).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm">
                                                    <Clock className="w-4 h-4 text-slate-400" />
                                                    <span className="text-slate-600">{session.time}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-xs text-slate-500 mt-2">
                                                    <Badge variant="secondary" className="text-[10px]">{session.frequency}</Badge>
                                                    <Badge variant="secondary" className="text-[10px]">{session.duration}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => {
                                                setScheduledSessions(scheduledSessions.filter(s => s.id !== session.id));
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Session History */}
            {sessionHistory.length > 0 && (
                <section className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <History className="w-5 h-5 text-slate-600" />
                        <h3 className="font-bold text-lg">Session History</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {sessionHistory.slice().reverse().map((session) => (
                            <Card key={session.id} className={`border-l-4 ${session.status === 'Completed' ? 'border-l-emerald-500' : 'border-l-slate-300'}`}>
                                <CardContent className="p-4">
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between">
                                            <h4 className="font-semibold text-sm">{session.title}</h4>
                                            <Badge
                                                variant={session.status === 'Completed' ? 'default' : 'secondary'}
                                                className={session.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}
                                            >
                                                {session.status}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-slate-500">{session.type}</p>
                                        <div className="flex items-center space-x-2 text-xs text-slate-600">
                                            <Calendar className="w-3 h-3" />
                                            <span>
                                                {new Date(session.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <Clock className="w-3 h-3 ml-2" />
                                            <span>{session.time}</span>
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
                <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-google-blue" />
                    <h3 className="font-bold text-lg">AI Recommendations</h3>
                </div>
                <div className="space-y-4">
                    {/* Recommendation 1: Increase Technical Frequency */}
                    <Card className="border-l-4 border-l-google-blue hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-base mb-2">Increase Technical Frequency</h4>
                                    <p className="text-sm text-slate-600 mb-4">
                                        Based on your recent scores, increasing tech rounds by 2 sessions/week will optimize your Google interview readiness.
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="ml-4 border-google-blue text-google-blue hover:bg-google-blue hover:text-white"
                                    onClick={() => {
                                        setSelectedRecommendation({
                                            title: "Increase Technical Frequency",
                                            type: "Technical Practice",
                                            sessions: "2 sessions/week",
                                            duration: "45 mins each"
                                        });
                                        setIsScheduleOpen(true);
                                    }}
                                >
                                    Schedule
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recommendation 2: Communication Polish */}
                    <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-base mb-2">Communication Polish</h4>
                                    <p className="text-sm text-slate-600 mb-4">
                                        Try our new 'Active Listening' module to improve your behavioral interview score.
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="ml-4 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white"
                                    onClick={() => {
                                        setSelectedRecommendation({
                                            title: "Active Listening Module",
                                            description: "Master the art of active listening to excel in behavioral interviews",
                                            lessons: [
                                                "Understanding Non-Verbal Cues",
                                                "Reflective Listening Techniques",
                                                "STAR Method Integration",
                                                "Practice Scenarios"
                                            ],
                                            duration: "2 hours",
                                            level: "Intermediate"
                                        });
                                        setIsModuleOpen(true);
                                    }}
                                >
                                    View Module
                                </Button>
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
                        <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => {
                            setIsModuleOpen(false);
                            // Here you would navigate to the module
                        }}>
                            Start Module
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <MockInterviewModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
        </div>
    );
}
