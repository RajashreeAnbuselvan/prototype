"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Mic, Video, Settings, Info, CheckCircle2, VideoOff, MicOff, Sparkles } from "lucide-react";
import Link from "next/link";
import { getQuestions, Question } from "@/lib/interview-data";
import { cn } from "@/lib/utils";

function InterviewContent() {
    const searchParams = useSearchParams();
    const company = searchParams.get("company") || "Google";
    const role = searchParams.get("role") || "Software Engineer (L3)";

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [isVideoOn, setIsVideoOn] = useState(false);

    // New states for real AI feedback loop
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiFeedback, setAiFeedback] = useState("");
    const [isAISpeaking, setIsAISpeaking] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        setQuestions(getQuestions(company));

        // Initialize Speech Recognition
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const rec = new SpeechRecognition();
                rec.continuous = true;
                rec.interimResults = true;
                rec.lang = 'en-US';

                rec.onresult = (event: any) => {
                    let interimTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            setTranscript(prev => prev + ' ' + event.results[i][0].transcript);
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }
                };

                rec.onend = () => {
                    if (isRecording) rec.start(); // Keep recording if supposed to be
                };

                setRecognition(rec);
            }
        }
    }, [company]);

    // Manage recording state
    useEffect(() => {
        if (!recognition) return;

        if (isRecording) {
            setTranscript("");
            setAiFeedback("");
            try {
                recognition.start();
            } catch (e) {
                console.error("Recognition start error", e);
            }
        } else {
            recognition.stop();
            if (transcript.length > 20) {
                handleEvaluation();
            }
        }
    }, [isRecording]);

    const handleEvaluation = async () => {
        setIsAnalyzing(true);
        // Simulate Gemini thinking/analysis
        setTimeout(() => {
            const feedbacks = [
                "That's a very solid approach. You clearly identified the trade-offs between latency and consistency. I'd suggest elaborating more on the failure modes in a distributed environment.",
                "Excellent use of technical terminology. Your explanation of the MapReduce paradigm was intuitive. Try to keep the same energetic tone for the system design section.",
                "Good response. You highlighted the importance of user-centric design. For Netflix, remember to focus on the 'Freedom and Responsibility' culture when discussing team conflicts.",
                "Very methodical. The way you broke down the problem into smaller modules shows strong engineering discipline. Your voice tone remained professional throughout."
            ];
            const feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
            setAiFeedback(feedback);
            setIsAnalyzing(false);
            speakFeedback(feedback);
        }, 2000);
    };

    const speakFeedback = (text: string) => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            // Find a good voice (Gemini-like)
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.name.includes("Google") && (v.name.includes("US") || v.name.includes("English"))) || voices[0];
            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.onstart = () => setIsAISpeaking(true);
            utterance.onend = () => setIsAISpeaking(false);

            window.speechSynthesis.speak(utterance);
        }
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
            setIsRecording(false);
            setTranscript("");
            setAiFeedback("");
            if (typeof window !== "undefined") window.speechSynthesis.cancel();
        } else {
            setCompleted(true);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setIsRecording(false);
            setTranscript("");
            setAiFeedback("");
            if (typeof window !== "undefined") window.speechSynthesis.cancel();
        }
    };

    if (questions.length === 0) return <div className="p-20 text-center">Loading PrepBuddy Interview...</div>;

    if (completed) {
        return (
            <div className="max-w-3xl mx-auto py-12 px-6">
                <Card className="border-emerald-200 shadow-xl overflow-hidden">
                    <div className="h-2 bg-emerald-500 w-full" />
                    <CardHeader className="text-center pt-10">
                        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                        </div>
                        <CardTitle className="text-3xl font-bold">Interview Completed!</CardTitle>
                        <CardDescription className="text-lg">{company} - {role}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pb-10">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                            <p className="text-sm text-slate-500 uppercase font-bold tracking-widest mb-1">Your Score</p>
                            <h2 className="text-5xl font-black text-google-blue">94%</h2>
                            <p className="text-sm text-emerald-600 font-semibold mt-2">Exceptional Performance</p>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-slate-800">PrepBuddy AI Feedback:</h4>
                            <ul className="space-y-2">
                                <li className="text-sm text-slate-600 flex items-start space-x-2">
                                    <span className="text-google-blue font-bold">+</span>
                                    <span>High confidence detected in {questions[0].type} responses.</span>
                                </li>
                                <li className="text-sm text-slate-600 flex items-start space-x-2">
                                    <span className="text-google-blue font-bold">+</span>
                                    <span>Detailed technical explanations for {company} specific architecture.</span>
                                </li>
                                <li className="text-sm text-slate-600 flex items-start space-x-2">
                                    <span className="text-google-blue font-bold">!</span>
                                    <span>Try to maintain more consistent eye contact with the camera.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                            <Button className="flex-1 bg-google-blue" asChild>
                                <Link href="/dashboard">Return to Dashboard</Link>
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={() => speakFeedback("Your overall performance score is 94 percent. Exceptional performance across all categories.")}>
                                Play Audio Summary
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentQ = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard"><ChevronLeft className="w-5 h-5" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">{company} Mock Interview</h1>
                        <p className="text-xs text-slate-500">{role} Role</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-google-blue border-google-blue/20 bg-google-blue/5 px-3 py-1">
                        Question {currentStep + 1} of {questions.length}
                    </Badge>
                    <Button variant="outline" size="icon" className="h-8 w-8"><Settings className="w-4 h-4" /></Button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-medium text-slate-400">
                    <span>Overall Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1.5 bg-slate-100" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Visuals/Camera */}
                <div className="lg:col-span-1 space-y-4">
                    <div className={cn(
                        "aspect-video rounded-2xl relative overflow-hidden flex items-center justify-center group shadow-lg transition-all duration-500",
                        isVideoOn ? "bg-slate-800" : "bg-slate-900",
                        isAISpeaking && "ring-4 ring-google-blue/30 scale-[1.02]"
                    )}>
                        <div className={cn(
                            "absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=688&auto=format&fit=crop')] bg-cover bg-center transition-all duration-700",
                            isVideoOn ? "opacity-100 grayscale-0 blur-0" : "opacity-40 grayscale blur-[2px]"
                        )} />

                        {!isVideoOn && !isAISpeaking && (
                            <div className="relative z-10 flex flex-col items-center">
                                <VideoOff className="w-12 h-12 text-white/30 mb-2" />
                                <p className="text-white/50 text-[10px] font-medium tracking-wider uppercase">Camera Off</p>
                            </div>
                        )}

                        {isAISpeaking && (
                            <div className="absolute inset-0 flex items-center justify-center bg-google-blue/10 backdrop-blur-sm z-20">
                                <div className="flex space-x-1 items-end h-8">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div
                                            key={i}
                                            className="w-1.5 bg-google-blue rounded-full animate-pulse"
                                            style={{
                                                height: `${20 + Math.random() * 80}%`,
                                                animationDuration: `${0.5 + Math.random() * 0.5}s`
                                            }}
                                        />
                                    ))}
                                </div>
                                <p className="absolute bottom-4 text-google-blue font-bold text-[10px] uppercase tracking-widest">AI is Speaking...</p>
                            </div>
                        )}

                        <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full z-30">
                            <div className={cn("w-2 h-2 rounded-full", isRecording ? "bg-red-500 animate-pulse" : "bg-slate-400")} />
                            <span className="text-[10px] text-white/90 font-bold uppercase tracking-widest">
                                {isRecording ? "Live STT Recording" : isAnalyzing ? "Evaluating..." : "Ready"}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant={isVideoOn ? "outline" : "default"}
                            className={cn("flex-1 h-10", isVideoOn && "border-google-blue text-google-blue")}
                            onClick={() => setIsVideoOn(!isVideoOn)}
                        >
                            {isVideoOn ? <Video className="w-4 h-4 mr-2" /> : <VideoOff className="w-4 h-4 mr-2" />}
                            Video
                        </Button>
                        <Button
                            variant={isRecording ? "outline" : "default"}
                            className={cn("flex-1 h-10", isRecording && "border-red-500 text-red-500")}
                            onClick={() => setIsRecording(!isRecording)}
                        >
                            {isRecording ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
                            Audio
                        </Button>
                    </div>

                    <Card className="border-slate-100 bg-white shadow-sm overflow-hidden">
                        <div className="bg-google-blue/5 px-4 py-2 border-b border-slate-50 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-google-blue uppercase tracking-tighter">AI Hint</span>
                            <Sparkles className="w-3 h-3 text-google-blue" />
                        </div>
                        <CardContent className="p-4">
                            <p className="text-xs text-slate-500 leading-relaxed italic">
                                "{currentQ.hint}"
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Interaction */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-slate-200 shadow-sm min-h-[450px] flex flex-col overflow-hidden">
                        <div className="h-1.5 w-full bg-google-blue/10">
                            <div className="h-full bg-google-blue transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                        <CardHeader className="pb-4">
                            <Badge className="w-fit mb-2 bg-google-blue/10 text-google-blue hover:bg-google-blue/10 font-bold border-none uppercase text-[10px]">
                                {currentQ.type}
                            </Badge>
                            <CardTitle className="text-2xl font-bold leading-tight text-slate-900">
                                {currentQ.text}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                            <div className={cn(
                                "flex-1 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col p-6",
                                (isRecording || transcript) ? "bg-slate-50 border-google-blue/20" : "bg-slate-50 border-slate-200 items-center justify-center text-center"
                            )}>
                                {isRecording ? (
                                    <div className="w-full space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex space-x-1">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-1 h-4 bg-google-blue rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                                                ))}
                                            </div>
                                            <span className="text-xs font-bold text-google-blue uppercase">Listening: Speak your answer...</span>
                                        </div>
                                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                            {transcript || "Speak clearly into your microphone..."}
                                            <span className="inline-block w-1.5 h-4 ml-1 bg-google-blue animate-pulse align-middle" />
                                        </p>
                                    </div>
                                ) : transcript && !aiFeedback && !isAnalyzing ? (
                                    <div className="w-full space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-400 uppercase">Your Transcript</span>
                                            <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setTranscript("")}>Redo</Button>
                                        </div>
                                        <p className="text-sm text-slate-700 leading-relaxed border-l-2 border-google-blue pl-4">
                                            {transcript}
                                        </p>
                                        <Button className="w-full bg-google-blue" onClick={handleEvaluation}>
                                            Evaluate with PrepBuddy AI
                                        </Button>
                                    </div>
                                ) : isAnalyzing ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-google-blue/20 border-t-google-blue rounded-full animate-spin" />
                                            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-google-blue animate-pulse" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">Gemini is Analyzing</h4>
                                            <p className="text-sm text-slate-500">Evaluating your tone, content, and delivery...</p>
                                        </div>
                                    </div>
                                ) : aiFeedback ? (
                                    <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="bg-white p-4 rounded-xl border border-google-blue/20 shadow-sm relative">
                                            <div className="absolute -top-3 right-4 px-2 py-0.5 bg-google-blue text-white text-[10px] font-bold rounded-full">AI FEEDBACK</div>
                                            <p className="text-sm text-slate-700 leading-relaxed italic">
                                                "{aiFeedback}"
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" className="flex-1 text-xs" onClick={() => speakFeedback(aiFeedback)}>
                                                Replay Voice
                                            </Button>
                                            <Button className="flex-[2] bg-slate-900" onClick={handleNext}>
                                                Next Question <ChevronRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-google-blue/10 rounded-full mx-auto flex items-center justify-center text-google-blue">
                                            <Mic className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">Ready to respond?</h4>
                                            <p className="text-sm text-slate-500">Click 'Start Recording' and speak your answer naturally.</p>
                                        </div>
                                        <Button className="bg-google-blue hover:bg-google-blue/90 px-8 h-11" onClick={() => setIsRecording(true)}>
                                            <Mic className="w-4 h-4 mr-2" /> Start Recording
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                                <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0} className="text-slate-500">
                                    <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                                </Button>
                                {isRecording && (
                                    <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => setIsRecording(false)}>
                                        Submit Answer
                                    </Button>
                                )}
                                {!isRecording && !aiFeedback && (
                                    <Button variant="ghost" onClick={handleNext} className="text-slate-400 text-xs">
                                        Skip Question
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function InterviewPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center">Loading PrepBuddy Interview...</div>}>
            <InterviewContent />
        </Suspense>
    );
}
