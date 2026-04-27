"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Search, History, Sparkles } from "lucide-react";
import Link from "next/link";

interface MockInterviewModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const MockInterviewModal = ({ isOpen, onOpenChange }: MockInterviewModalProps) => {
    const [company, setCompany] = React.useState("Google");
    const [role, setRole] = React.useState("Software Engineer (L3)");
    const [year, setYear] = React.useState("Junior (Year 3)");
    const [experience, setExperience] = React.useState("");

    // Dynamic role mapping based on company
    const companyRoles: Record<string, string[]> = {
        "Google": ["Software Engineer (L3)", "Product Manager", "SRE", "Sales Engineer"],
        "Amazon": ["SDE I", "Software Development Manager", "Solutions Architect", "Program Manager"],
        "Meta": ["Software Engineer", "Product Designer", "Data Engineer", "Production Engineer"],
        "Netflix": ["Senior Software Engineer", "UI Engineer", "Data Scientist"],
        "Microsoft": ["Software Engineer", "Program Manager", "Support Engineer"]
    };

    const suggestedRoles = React.useMemo(() => {
        const lowerCompany = company.toLowerCase();
        for (const [key, roles] of Object.entries(companyRoles)) {
            if (lowerCompany.includes(key.toLowerCase())) return roles;
        }
        return ["Software Engineer", "Product Manager", "Data Scientist", "UI Developer"];
    }, [company]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] border border-slate-200 shadow-2xl p-0 overflow-hidden rounded-2xl">
                <div className="bg-google-blue h-2 w-full" />
                <div className="p-6">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black text-slate-800 flex items-center gap-2">
                            <Building2 className="w-6 h-6 text-google-blue" />
                            <span>Prepare for Success</span>
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">
                            Tailor your mock interview session for precise outcome analysis.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="company" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="company"
                                        placeholder="Google, Amazon..."
                                        className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all font-semibold"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Role</Label>
                                <Input
                                    id="role"
                                    placeholder="Software Engineer..."
                                    className="h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all font-semibold"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="year" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Year of Study</Label>
                                <select
                                    id="year"
                                    className="w-full h-12 px-3 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-google-blue/10 transition-all font-semibold"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                >
                                    <option>Freshman (Year 1)</option>
                                    <option>Sophomore (Year 2)</option>
                                    <option>Junior (Year 3)</option>
                                    <option>Senior (Year 4)</option>
                                    <option>Graduate Student</option>
                                    <option>Not a Student</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="experience" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Experience (Years) - <span className="text-[9px] lowercase italic">Optional</span></Label>
                                <Input
                                    id="experience"
                                    type="number"
                                    placeholder="e.g. 2"
                                    className="h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all font-semibold"
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2">
                                <Sparkles className="w-3 h-3 text-google-blue" />
                                <span>Suggested Roles for {company || "Selected Company"}</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {suggestedRoles.map((r) => (
                                    <Button
                                        key={r}
                                        variant="outline"
                                        size="sm"
                                        className={`h-9 px-4 text-xs font-bold rounded-full transition-all border-slate-200 ${role === r ? 'bg-google-blue text-white border-google-blue shadow-md' : 'hover:border-google-blue hover:text-google-blue bg-white'}`}
                                        onClick={() => setRole(r)}
                                    >
                                        {r}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-10 sm:justify-between items-center bg-slate-50 -mx-6 -mb-6 p-6 border-t border-slate-100">
                        <div className="hidden sm:block">
                            <p className="text-[10px] text-slate-400 flex items-center gap-1.5 font-bold uppercase">
                                <History className="w-3 h-3" />
                                Adaptive AI Questions active
                            </p>
                        </div>
                        <div className="flex space-x-3 w-full sm:w-auto">
                            <Button variant="ghost" className="font-bold text-slate-500 hover:text-slate-800" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button className="bg-google-blue hover:bg-google-blue/90 text-white px-10 font-black tracking-wide shadow-xl shadow-google-blue/20" asChild>
                                <Link href={`/dashboard/interview?company=${encodeURIComponent(company)}&role=${encodeURIComponent(role)}&year=${encodeURIComponent(year)}&exp=${encodeURIComponent(experience)}`}>
                                    START MISSION
                                </Link>
                            </Button>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};
