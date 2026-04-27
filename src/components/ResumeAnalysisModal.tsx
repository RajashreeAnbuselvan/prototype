"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, FileText, Target, CheckCircle2, TrendingUp, Building2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ResumeAnalysisModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ResumeAnalysisModal = ({ isOpen, onOpenChange }: ResumeAnalysisModalProps) => {
    const [resumeText, setResumeText] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState<any>(null);

    const handleAnalyze = async () => {
        if (!resumeText.trim()) return;
        setIsAnalyzing(true);
        try {
            const res = await fetch('/api/analyze-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeText }),
            });
            if (res.ok) {
                const data = await res.json();
                setResults(data);
            }
        } catch (error) {
            console.error("Analysis failed:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] border border-slate-200 shadow-2xl p-0 overflow-hidden rounded-2xl">
                <div className="bg-google-blue h-2 w-full" />
                <div className="p-6">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black text-slate-800 flex items-center gap-2">
                            <Target className="w-6 h-6 text-google-blue" />
                            <span>Compatibility Matrix</span>
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">
                            AI-powered analysis of your profile against industry standards.
                        </DialogDescription>
                    </DialogHeader>

                    {!results ? (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="resume" className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Paste Resume or Bio
                                </Label>
                                <Textarea
                                    id="resume"
                                    placeholder="Paste your experience, skills, and projects here for deep AI matching..."
                                    className="min-h-[200px] bg-slate-50 border-slate-200 focus:bg-white transition-all font-medium text-sm p-4 resize-none"
                                    value={resumeText}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResumeText(e.target.value)}
                                />
                                <p className="text-[10px] text-slate-400 italic">
                                    Privacy Note: Your data is processed securely by Google Gemini and not stored in our public logs.
                                </p>
                            </div>

                            <Button
                                className="w-full bg-google-blue hover:bg-google-blue/90 text-white font-black py-6 text-base shadow-xl shadow-google-blue/20"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !resumeText}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        ANALYZING PROFILE...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        GENERATE COMPATIBILITY REPORT
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Target className="w-20 h-20" />
                                </div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">Global Compatibility</p>
                                        <h2 className="text-4xl font-black">{results.score}%</h2>
                                        <p className="text-[10px] text-slate-400 mt-2 font-medium">Based on 12 security & skill metrics</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] font-bold">READY TO APPLY</Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    Top Company Matches
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {results.matches.map((match: any, idx: number) => (
                                        <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start justify-between group hover:border-google-blue transition-colors">
                                            <div className="space-y-1">
                                                <h5 className="font-bold text-slate-800 text-sm">{match.company}</h5>
                                                <p className="text-xs text-slate-500 leading-relaxed pr-8">{match.reason}</p>
                                            </div>
                                            <div className="mt-1">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-3.5 h-3.5 text-google-blue" />
                                    <span className="text-[10px] font-bold text-google-blue uppercase">AI Summary</span>
                                </div>
                                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                    {results.summary}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button className="flex-1 bg-google-blue" onClick={() => setResults(null)}>
                                    ANALYZE NEW PROFILE
                                </Button>
                                <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                                    CLOSE REPORT
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
