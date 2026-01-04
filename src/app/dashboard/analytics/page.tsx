"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Info, TrendingUp, Target, Brain, MessageSquare } from "lucide-react";
import Link from "next/link";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, BarChart, Bar, Cell } from "recharts";

const performanceData = [
    { name: "Technical", score: 85, fill: "#4285F4" },
    { name: "Communication", score: 72, fill: "#EA4335" },
    { name: "System Design", score: 68, fill: "#FBBC04" },
    { name: "Behavioral", score: 90, fill: "#34A853" },
];

const trendData = [
    { month: "Aug", score: 45 },
    { month: "Sep", score: 52 },
    { month: "Oct", score: 48 },
    { month: "Nov", score: 65 },
    { month: "Dec", score: 78 },
    { month: "Jan", score: 85 },
];

export default function AnalyticsPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard"><ChevronLeft className="w-5 h-5" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Analytics & Growth</h1>
                    <p className="text-sm text-slate-500">Your performance insights powered by Vertex AI</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Growth Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Skill Progression</CardTitle>
                        <CardDescription>Aggregate preparation score over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorScoreLarge" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4285F4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#4285F4" strokeWidth={3} fillOpacity={1} fill="url(#colorScoreLarge)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Skill Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Skill Breakdown</CardTitle>
                        <CardDescription>Performance by category</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={performanceData} layout="vertical" margin={{ left: -20 }}>
                                <XAxis type="number" hide domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} width={100} />
                                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                                    {performanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-blue-50/30 border-blue-100">
                    <CardContent className="p-6 flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-2xl text-google-blue">
                            <Brain className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Conceptual Depth</p>
                            <h3 className="text-xl font-bold text-slate-900">Advanced</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-50/30 border-emerald-100">
                    <CardContent className="p-6 flex items-center space-x-4">
                        <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Communication</p>
                            <h3 className="text-xl font-bold text-slate-900">Good</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-purple-50/30 border-purple-100">
                    <CardContent className="p-6 flex items-center space-x-4">
                        <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Prep Accuracy</p>
                            <h3 className="text-xl font-bold text-slate-900">88%</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <section className="space-y-4">
                <h3 className="text-lg font-bold">AI Recommendations</h3>
                <Card className="border-slate-200">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-start space-x-4 border-l-4 border-google-blue pl-4">
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900">Increase Technical Frequency</h4>
                                <p className="text-sm text-slate-600">Based on your recent scores, increasing tech-rounds by 2 sessions/week will optimize your Google interview readiness.</p>
                            </div>
                            <Button size="sm" variant="outline">Schedule</Button>
                        </div>
                        <div className="flex items-start space-x-4 border-l-4 border-emerald-500 pl-4">
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900">Communication Polish</h4>
                                <p className="text-sm text-slate-600">Try our new 'Active Listening' module to improve your behavioral interview score.</p>
                            </div>
                            <Button size="sm" variant="outline">View Module</Button>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
