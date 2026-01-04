"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, User, Bell, Lock, Globe, Shield } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard"><ChevronLeft className="w-5 h-5" /></Link>
                </Button>
                <h1 className="text-2xl font-bold">Settings</h1>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-[400px] mb-8">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="notifications">Alerts</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="billing">Plan</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                    <Card className="border-slate-200">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal details and how others see you.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center space-x-6">
                                <Avatar className="h-20 w-20 border-2 border-slate-100">
                                    <AvatarImage src="https://i.pravatar.cc/150?u=prepbuddy" />
                                    <AvatarFallback>PB</AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                    <Button variant="outline" size="sm">Change Avatar</Button>
                                    <p className="text-xs text-slate-500">JPG, GIF or PNG. Max size of 800K</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" defaultValue="Alex" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" defaultValue="Candidate" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" defaultValue="alex@prepbuddy.ai" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="bio">Professional Bio</Label>
                                    <textarea
                                        id="bio"
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Tell us about your career goals..."
                                        defaultValue="Software Engineer with 5 years of experience specializing in distributed systems and AI integration."
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <div className="p-6 border-t border-slate-100 flex justify-end">
                            <Button className="bg-google-blue">Save Changes</Button>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                    <Card className="border-slate-200">
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Manage how and when you receive updates.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { title: "Interview Reminders", desc: "Receive alerts for scheduled mock sessions." },
                                { title: "AI Feedback Ready", desc: "Get notified when Gemini finishes analyzing your interview." },
                                { title: "Skill Insights", desc: "Weekly summaries of your progress and areas to improve." },
                                { title: "Marketing & Product Updates", desc: "Stay informed about new features and company news." }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 border rounded-xl border-slate-100 hover:bg-slate-50 transition-colors">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                                        <p className="text-xs text-slate-500">{item.desc}</p>
                                    </div>
                                    <div className="h-6 w-11 bg-google-blue rounded-full relative cursor-pointer">
                                        <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <Card className="border-slate-200">
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Manage your password and account security protocols.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="p-4 border border-slate-100 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <Shield className="w-5 h-5 text-google-blue" />
                                        <div>
                                            <p className="text-sm font-semibold">Two-Factor Authentication</p>
                                            <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Enable</Button>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currentPass">Current Password</Label>
                                    <Input id="currentPass" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPass">New Password</Label>
                                    <Input id="newPass" type="password" />
                                </div>
                            </div>
                        </CardContent>
                        <div className="p-6 border-t border-slate-100 flex justify-end">
                            <Button className="bg-google-blue">Update Password</Button>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
