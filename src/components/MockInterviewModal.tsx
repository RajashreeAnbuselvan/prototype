"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Search, History } from "lucide-react";
import Link from "next/link";

interface MockInterviewModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const MockInterviewModal = ({ isOpen, onOpenChange }: MockInterviewModalProps) => {
    const [company, setCompany] = React.useState("Google");
    const [role, setRole] = React.useState("Software Engineer (L3)");

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] border border-slate-200 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center space-x-2">
                        <Building2 className="w-5 h-5 text-google-blue" />
                        <span>Select Mock Interview</span>
                    </DialogTitle>
                    <DialogDescription>
                        Choose a company or role to start your AI-powered mock interview.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="company" className="text-sm font-medium">Which company are you interviewing for?</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="company"
                                    placeholder="e.g. Google, Amazon, Meta"
                                    className="pl-10 h-11"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-sm font-medium">What role are you applying for?</Label>
                            <Input
                                id="role"
                                placeholder="e.g. Software Engineer, Product Manager"
                                className="h-11 border-slate-200 focus:border-google-blue"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs font-semibold text-slate-500 uppercase flex items-center space-x-1">
                                <History className="w-3 h-3" />
                                <span>Quick Select</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {["Software Engineer (L3)", "Product Manager", "Frontend Developer", "Backend Engineer"].map((r) => (
                                    <Button
                                        key={r}
                                        variant="outline"
                                        size="sm"
                                        className={`h-8 text-[10px] border-slate-200 transition-all ${role === r ? 'bg-google-blue/10 border-google-blue text-google-blue' : 'hover:border-google-blue hover:text-google-blue'}`}
                                        onClick={() => setRole(r)}
                                    >
                                        {r}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-between items-center gap-4">
                    <p className="text-[10px] text-muted-foreground italic">
                        Questions are generated based on real industry data.
                    </p>
                    <div className="flex space-x-2 w-full sm:w-auto">
                        <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button className="bg-google-blue hover:bg-google-blue/90 text-white px-8" asChild>
                            <Link href={`/dashboard/interview?company=${encodeURIComponent(company)}&role=${encodeURIComponent(role)}`}>Start Interview</Link>
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
