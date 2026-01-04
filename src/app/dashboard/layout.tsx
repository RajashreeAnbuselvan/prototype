"use client";

import React, { useState } from "react";
import { Search, Bell, User, LayoutDashboard, History, Settings, LogOut, Menu, CheckCircle, Clock, AlertCircle } from "lucide-react";
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

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50/50">
            {/* Sidebar - Optional but good for professional look */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
                <div className="p-6">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-google-blue rounded-lg flex items-center justify-center text-white font-bold">P</div>
                        <span className="text-xl font-bold tracking-tight">PrepBuddy <span className="text-google-blue">AI</span></span>
                    </Link>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-google-blue bg-blue-50 rounded-lg">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/dashboard/history" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">
                        <History className="w-4 h-4" />
                        <span>Past Interviews</span>
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                    </Link>
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
                {/* Top Navbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
                    <div className="flex items-center md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="flex-1 max-w-xl mx-4 hidden sm:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search mock roles, questions, or history..." className="pl-10 bg-slate-50/50 border-none w-full h-10" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
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

            <AIAssistant />
        </div>
    );
}
