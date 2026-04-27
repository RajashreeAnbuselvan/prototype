"use client";

import React, { useState } from "react";
import { Search, Bell, User, LayoutDashboard, History, Settings, LogOut, Menu, CheckCircle, Clock, AlertCircle, Building2, Sparkles, TrendingUp, Briefcase, FileText, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { AIAssistant } from "@/components/AIAssistant";
import { ResumeAnalysisModal } from "@/components/ResumeAnalysisModal";
import { motion, AnimatePresence } from "framer-motion";

function CollapsibleTarget({ name, color, active, sub }: { name: string; color: string; active: string; sub: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between group p-2 rounded-lg hover:bg-slate-100 transition-all text-left"
            >
                <span className="text-[11px] font-black text-slate-800 group-hover:text-google-blue transition-colors flex items-center gap-1.5">
                    <div className={`size-1.5 rounded-full ${color}`} />
                    {name}
                </span>
                <Badge variant="outline" className={`text-[8px] h-4 px-1.5 font-black border-slate-100 text-slate-400 bg-slate-50 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? 'Close' : 'Open'}
                </Badge>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="ml-3 pl-2 border-l border-slate-100 pb-2 space-y-1">
                            <div className="flex justify-between items-center pr-2">
                                <span className="text-[9px] text-slate-400 bg-slate-100 px-1.5 rounded-full font-bold">{active}</span>
                            </div>
                            <p className="text-[9px] text-slate-500 font-bold">{sub}</p>
                            <Button size="sm" variant="link" className="h-auto p-0 text-[9px] font-black text-google-blue uppercase tracking-tighter" asChild>
                                <Link href={`/dashboard/interview?company=${name}`}>Launch Prep →</Link>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50/30">
            {/* Sidebar - Professional Vibrant Uplift */}
            <aside className="hidden md:flex flex-col w-64 bg-white/50 backdrop-blur-xl border-r border-slate-200/60 shadow-xl z-30">
                <div className="p-6">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-google-blue rounded-lg flex items-center justify-center text-white font-bold">P</div>
                        <span className="text-xl font-bold tracking-tight">PrepBuddy <span className="text-google-blue">AI</span></span>
                    </Link>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
                    <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2.5 text-sm font-bold text-google-blue bg-blue-50/80 rounded-xl shadow-sm shadow-blue-200/50 transition-all border border-blue-100/50">
                        <LayoutDashboard className="size-4" />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/dashboard/history" className="flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-vibrant-purple transition-all rounded-xl group">
                        <History className="size-4 text-slate-400 group-hover:text-vibrant-purple transition-colors" />
                        <span>Past Interviews</span>
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-vibrant-pink transition-all rounded-xl group">
                        <Settings className="size-4 text-slate-400 group-hover:text-vibrant-pink transition-colors" />
                        <span>Settings</span>
                    </Link>

                    {/* Compatibility Card */}
                    <div className="mt-8 px-2">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 shadow-lg border border-slate-700 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles className="w-12 h-12 text-white" />
                            </div>
                            <div className="relative z-10 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-google-blue" />
                                    <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Compatibility</span>
                                </div>
                                <h4 className="text-xs font-black text-white leading-tight tracking-wide">AI PROFILE MATRICES</h4>
                                <p className="text-[9px] text-slate-400 font-bold leading-relaxed">Cross-analyze your resume with real-time industry demand.</p>
                                <Button size="sm" className="w-full bg-google-blue hover:bg-google-blue/90 text-white font-bold text-[10px] h-7 rounded-lg shadow-google-blue/20 shadow-lg" onClick={() => setIsAnalysisOpen(true)}>
                                    <FileText className="w-3 h-3 mr-1.5" />
                                    ANALYZE NOW
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Simplified Collapsible Top Targets */}
                    <div className="mt-8 px-2 pb-6">
                        <div className="px-3 mb-4 flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Targets</span>
                            <Badge variant="outline" className="text-[8px] h-4 px-1.5 font-black border-emerald-100 text-emerald-600 bg-emerald-50">HIRING</Badge>
                        </div>
                        <div className="space-y-1">
                            <CollapsibleTarget name="Google" color="bg-google-blue" active="12 active" sub="DSA • System Design" />
                            <CollapsibleTarget name="Amazon" color="bg-orange-500" active="8 active" sub="LPs • Scalability" />
                        </div>
                    </div>
                </nav>
                <div className="p-4 border-t border-slate-100">
                    <Link href="/login" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg group">
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header - Premium Glass Layer */}
                <header className="h-16 bg-white/70 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between px-6 sticky top-0 z-20">
                    <div className="flex items-center md:hidden">
                        <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                            <Menu className="size-5 text-slate-600" />
                        </Button>
                    </div>

                    <div className="flex-1 max-w-xl mx-4 hidden sm:block">
                        <div className="relative group">
                            <Search className="absolute left-3 top-3 size-4 text-slate-400 group-focus-within:text-google-blue transition-colors" />
                            <Input placeholder="Search mock roles, insights, or career paths..." className="pl-10 bg-slate-100/50 border-transparent focus:bg-white focus:border-google-blue/30 w-full h-10 rounded-xl transition-all font-medium" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-5">
                        {/* Notification Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <DropdownMenuLabel className="font-bold">Notifications</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="flex items-start space-x-3 p-3 cursor-pointer">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Interview Completed</p>
                                        <p className="text-xs text-slate-500">Your Google L3 mock interview score: 94%</p>
                                        <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-start space-x-3 p-3 cursor-pointer">
                                    <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">New Question Set Available</p>
                                        <p className="text-xs text-slate-500">Netflix Senior Data Engineer questions added</p>
                                        <p className="text-xs text-slate-400 mt-1">5 hours ago</p>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-start space-x-3 p-3 cursor-pointer">
                                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Tip of the Day</p>
                                        <p className="text-xs text-slate-500">Practice the STAR method for behavioral questions</p>
                                        <p className="text-xs text-slate-400 mt-1">1 day ago</p>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-center text-xs text-google-blue font-semibold cursor-pointer">
                                    View All Notifications
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Profile Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                                    <Avatar className="h-9 w-9 border border-slate-200">
                                        <AvatarImage src="https://i.pravatar.cc/150?u=prepbuddy" />
                                        <AvatarFallback>PB</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">PrepBuddy User</p>
                                        <p className="text-xs text-slate-500">user@prepbuddy.ai</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard" className="cursor-pointer flex items-center">
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/history" className="cursor-pointer flex items-center">
                                        <History className="w-4 h-4 mr-2" />
                                        Past Interviews
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings" className="cursor-pointer flex items-center">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/login" className="cursor-pointer flex items-center text-red-600">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>

                {/* Footer */}
                <footer className="p-6 text-center text-xs text-slate-400 border-t border-slate-100">
                    Powered by <span className="text-google-blue font-semibold">Vertex AI</span> &copy; 2026 Vertex Voyagers
                </footer>
            </div>

            <ResumeAnalysisModal isOpen={isAnalysisOpen} onOpenChange={setIsAnalysisOpen} />
            <AIAssistant />
        </div>
    );
}
