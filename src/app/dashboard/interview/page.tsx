"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Mic, Video, Settings, CheckCircle2, VideoOff, MicOff, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getQuestions, Question } from "@/lib/interview-data";
import { cn } from "@/lib/utils";
import { getGeminiFeedback, generateInterviewQuestions } from "@/lib/gemini";

function InterviewContent() {
    const searchParams = useSearchParams();
    const company = searchParams.get("company") || "Google";
    const role = searchParams.get("role") || "Software Engineer (L3)";
    const academicYear = searchParams.get("year") || "Junior (Year 3)";
    const experience = searchParams.get("exp") || "";
    const moduleType = searchParams.get("module") as "soft_skills" | "technical" | null;

    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isCameraLoading, setIsCameraLoading] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const streamRef = React.useRef<MediaStream | null>(null);

    // Track responses and feedback for DB
    const [allResponses, setAllResponses] = useState<string[]>([]);
    const [allFeedbacks, setAllFeedbacks] = useState<string[]>([]);
    const [allScores, setAllScores] = useState<number[]>([]);

    // Camera control functions
    const startCamera = React.useCallback(async () => {
        setIsCameraLoading(true);
        setCameraError(null);

        if (typeof window === "undefined" || !navigator?.mediaDevices?.getUserMedia) {
            setCameraError("Camera access is not supported by your browser or environment. Please ensure you are running on localhost or HTTPS.");
            setIsCameraLoading(false);
            setIsVideoOn(false);
            return;
        }

        try {
            console.log("Attempting to start camera...");
            let newStream: MediaStream;
            try {
                // Try ideal resolution first
                newStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280, max: 1920 },
                        height: { ideal: 720, max: 1080 },
                        facingMode: "user"
                    },
                    audio: false
                });
            } catch (constraintErr) {
                console.warn("Retrying camera with generic constraints...", constraintErr);
                // Fallback to basic video constraint for webcams with strict requirements
                newStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                });
            }

            // Stop existing tracks if any before attaching new stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }

            streamRef.current = newStream;
            setStream(newStream);
            setIsVideoOn(true);
            setCameraError(null);

            if (videoRef.current) {
                videoRef.current.muted = true;
                videoRef.current.srcObject = newStream;
                try {
                    await videoRef.current.play();
                } catch (pErr) {
                    console.warn("Video play interrupted or blocked:", pErr);
                }
            }
        } catch (err: any) {
            console.error("Error accessing camera:", err);
            let msg = "Could not access camera.";
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                msg = "Camera permission was denied. Please allow camera permissions in your browser.";
            } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
                msg = "No camera found on this device. Please connect a webcam.";
            } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
                msg = "Camera is currently in use by another application or tab.";
            } else if (err.name === "OverconstrainedError") {
                msg = "Camera resolution constraints could not be satisfied by your video device.";
            } else if (err.message) {
                msg = `Camera error: ${err.message}`;
            }
            setCameraError(msg);
            setIsVideoOn(false);
            setStream(null);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
                streamRef.current = null;
            }
        } finally {
            setIsCameraLoading(false);
        }
    }, []);

    const stopCamera = React.useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setStream(null);
        setIsVideoOn(false);
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, []);

    const toggleCamera = React.useCallback(() => {
        if (isVideoOn && streamRef.current) {
            stopCamera();
        } else {
            startCamera();
        }
    }, [isVideoOn, startCamera, stopCamera]);

    // Initial camera startup
    useEffect(() => {
        startCamera();
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
                streamRef.current = null;
            }
        };
    }, [startCamera]);

    // Ensure video srcObject is continuously synced whenever video element mounts or stream updates
    useEffect(() => {
        if (videoRef.current && stream && isVideoOn) {
            videoRef.current.muted = true;
            if (videoRef.current.srcObject !== stream) {
                videoRef.current.srcObject = stream;
            }
            videoRef.current.play().catch(pErr => {
                console.warn("Video auto-play warning:", pErr);
            });
        }
    }, [stream, isVideoOn, isLoadingQuestions]);

    // Stop camera when interview completes
    useEffect(() => {
        if (completed) {
            stopCamera();
        }
    }, [completed, stopCamera]);

    // Fetch dynamic questions
    useEffect(() => {
        const fetchQs = async () => {
            setIsLoadingQuestions(true);
            try {
                const dynamicQs = await generateInterviewQuestions(
                    company,
                    role,
                    academicYear,
                    experience,
                    moduleType || undefined
                );
                if (dynamicQs && dynamicQs.length > 0) {
                    setQuestions(dynamicQs);
                } else {
                    // Fallback to static data
                    setQuestions(getQuestions(company));
                }
            } catch (error) {
                console.error("Failed to load questions:", error);
                setQuestions(getQuestions(company));
            } finally {
                setIsLoadingQuestions(false);
            }
        };
        fetchQs();
    }, [company, role, academicYear, moduleType]);

    // Helper to capture a frame from the video
    const captureFrame = (): string | null => {
        const video = videoRef.current;
        if (video && isVideoOn && video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.scale(-1, 1); // Mirror
                    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
                    return canvas.toDataURL("image/jpeg", 0.8).split(",")[1]; // Return base64 without prefix
                }
            } catch (err) {
                console.warn("Error capturing camera frame:", err);
            }
        }
        return null;
    };

    // New states for real AI feedback loop
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiFeedback, setAiFeedback] = useState("");
    const [bodyLanguageFeedback, setBodyLanguageFeedback] = useState("");
    const [isAISpeaking, setIsAISpeaking] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);
    const recognitionRef = React.useRef<any>(null);
    const isRecordingRef = React.useRef(isRecording);
    const isStartedRef = React.useRef(false);

    // Keep ref in sync with state for use in callbacks
    useEffect(() => {
        isRecordingRef.current = isRecording;
    }, [isRecording]);

    useEffect(() => {
        setQuestions(getQuestions(company));

        // Initialize Speech Recognition
        if (typeof window !== "undefined" && !recognitionRef.current) {
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

                rec.onstart = () => {
                    isStartedRef.current = true;
                };

                rec.onend = () => {
                    isStartedRef.current = false;
                    // Auto-restart logic - ONLY if intent is still to record
                    if (isRecordingRef.current && recognitionRef.current) {
                        try {
                            recognitionRef.current.start();
                        } catch (e: any) {
                            // Ignore "already started" errors
                            if (e.name !== 'InvalidStateError') {
                                console.error("Auto-restart error", e);
                            }
                        }
                    }
                };

                rec.onerror = (event: any) => {
                    console.error("Speech Recognition Error", event.error);
                    if (event.error === 'not-allowed') {
                        setIsRecording(false);
                    }
                    // onend will fire after onerror
                };

                recognitionRef.current = rec;
                setRecognition(rec);
            }
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.abort(); // abort is better for immediate cleanup
                } catch (e) { }
                recognitionRef.current = null;
                isStartedRef.current = false;
            }
        };
    }, [company]);

    // Manage recording state
    useEffect(() => {
        const rec = recognitionRef.current;
        if (!rec) return;

        if (isRecording) {
            setTranscript("");
            setAiFeedback("");
            if (!isStartedRef.current) {
                try {
                    rec.start();
                } catch (e: any) {
                    if (e.name !== 'InvalidStateError') {
                        console.error("Recognition start error", e);
                    } else {
                        isStartedRef.current = true; // Sync state if already started
                    }
                }
            }
        } else {
            if (isStartedRef.current) {
                try {
                    rec.stop();
                } catch (e) {
                    console.error("Recognition stop error", e);
                }
                // isStartedRef will be set to false in onend
            }
            if (transcript.length > 20) {
                handleEvaluation();
            }
        }
    }, [isRecording]);

    const handleEvaluation = async () => {
        if (!transcript || transcript.length < 5) return;

        setIsAnalyzing(true);
        setAiFeedback("");
        setBodyLanguageFeedback("");
        
        // Capture frame for body language analysis
        const frame = captureFrame();

        try {
            const data = await getGeminiFeedback(
                questions[currentStep].text,
                transcript,
                company,
                role,
                academicYear,
                experience,
                frame || undefined,
                questions[currentStep].hint // Pass hint as expectedContext
            );

            const feedback = data.feedback || "I've analyzed your answer. Good effort!";
            const blFeedback = data.bodyLanguage || "Maintain good posture and eye contact.";
            const score = data.score || 70;

            setAiFeedback(feedback);
            setBodyLanguageFeedback(blFeedback);
            
            setAllFeedbacks(prev => {
                const updated = [...prev];
                updated[currentStep] = feedback + " | Body Language: " + blFeedback;
                return updated;
            });
            setAllScores(prev => {
                const updated = [...prev];
                updated[currentStep] = Math.round((score + (data.bodyLanguageScore || score)) / 2);
                return updated;
            });
            setIsAnalyzing(false);
            speakFeedback(feedback);
        } catch (error) {
            console.error("Evaluation failed:", error);
            setIsAnalyzing(false);
            setAiFeedback("Sorry, I couldn't analyze that right now. Let's try the next one!");
        }
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

    const handleNext = async () => {
        // Save current transcript
        const currentTranscript = transcript;
        setAllResponses(prev => {
            const updated = [...prev];
            updated[currentStep] = currentTranscript;
            return updated;
        });

        if (currentStep < questions.length - 1) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            setIsRecording(false);
            // Restore previous state if it exists
            setTranscript(allResponses[nextStep] || "");
            setAiFeedback(allFeedbacks[nextStep] || "");
            if (typeof window !== "undefined") window.speechSynthesis.cancel();
        } else {
            setCompleted(true);

            // Prepare data for DB
            const finalResponses = [...allResponses];
            finalResponses[currentStep] = currentTranscript;

            const interviewData = {
                company,
                role,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                status: "Completed",
                score: allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 85,
                type: company === "Netflix" && role.includes("Content Strategy") ? "Behavioral" : "Technical",
                questions: questions,
                responses: finalResponses,
                feedbacks: allFeedbacks
            };

            // Save to MongoDB
            try {
                const response = await fetch('/api/interviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(interviewData),
                });
                if (!response.ok) throw new Error('Failed to save interview');
                console.log("Interview saved to MongoDB");
            } catch (error) {
                console.error("Error saving to MongoDB:", error);
                // Fallback to localStorage if API fails
                if (typeof window !== "undefined") {
                    const saved = localStorage.getItem('prepBuddy_interviewHistory');
                    let history = [];
                    if (saved) {
                        try {
                            history = JSON.parse(saved);
                        } catch (e) { }
                    }
                    history.unshift({ ...interviewData, id: Date.now() });
                    localStorage.setItem('prepBuddy_interviewHistory', JSON.stringify(history));
                }
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            const prevStep = currentStep - 1;
            setCurrentStep(prevStep);
            setIsRecording(false);
            // Restore state
            setTranscript(allResponses[prevStep] || "");
            setAiFeedback(allFeedbacks[prevStep] || "");
            if (typeof window !== "undefined") window.speechSynthesis.cancel();
        }
    };

    if (questions.length === 0) return <div className="p-20 text-center">Loading PrepBuddy Interview...</div>;

    if (isLoadingQuestions) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-google-blue border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 animate-pulse">Preparing your custom interview questions...</p>
            </div>
        );
    }

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
                        {/* Video Element - continuously mounted to preserve ref and hardware stream binding */}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            onLoadedMetadata={(e) => {
                                const v = e.currentTarget;
                                v.muted = true;
                                v.play().catch(pErr => console.warn("Video auto-play onLoadedMetadata warning:", pErr));
                            }}
                            className={cn(
                                "absolute inset-0 w-full h-full object-cover scale-x-[-1] transition-opacity duration-300",
                                isVideoOn && stream ? "opacity-100 z-10" : "opacity-0 pointer-events-none"
                            )}
                        />

                        {/* Background placeholder when camera is not actively streaming */}
                        {(!isVideoOn || !stream) && (
                            <div className={cn(
                                "absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=688&auto=format&fit=crop')] bg-cover bg-center transition-all duration-700",
                                "opacity-40 grayscale blur-[2px]"
                            )} />
                        )}

                        {isCameraLoading && (
                            <div className="relative z-20 flex flex-col items-center gap-2 p-4 text-center">
                                <RefreshCw className="w-8 h-8 text-google-blue animate-spin" />
                                <p className="text-white text-xs font-semibold">Connecting camera...</p>
                            </div>
                        )}

                        {!isVideoOn && !isCameraLoading && !isAISpeaking && (
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

                        <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full z-30">
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                isRecording ? "bg-red-500 animate-pulse" : (isVideoOn && stream) ? "bg-emerald-500" : "bg-slate-400"
                            )} />
                            <span className="text-[10px] text-white/90 font-bold uppercase tracking-widest">
                                {isRecording ? "Live STT Recording" : isAnalyzing ? "Evaluating..." : (isVideoOn && stream) ? "Camera Active" : "Ready"}
                            </span>
                        </div>
                    </div>

                    {cameraError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 space-y-2">
                            <div className="flex items-center gap-1.5 font-semibold text-red-800">
                                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                                <span>Camera Access Required</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-red-600">{cameraError}</p>
                            <Button
                                size="sm"
                                variant="outline"
                                className="w-full h-7 text-xs bg-white border-red-300 text-red-700 hover:bg-red-100 font-semibold"
                                onClick={startCamera}
                            >
                                <RefreshCw className="w-3 h-3 mr-1" /> Grant Permission / Retry
                            </Button>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button
                            variant={isVideoOn && stream ? "outline" : "default"}
                            className={cn(
                                "flex-1 h-10",
                                isVideoOn && stream && "border-google-blue text-google-blue hover:bg-google-blue/10"
                            )}
                            onClick={toggleCamera}
                            disabled={isCameraLoading}
                        >
                            {isVideoOn && stream ? <Video className="w-4 h-4 mr-2 text-google-blue" /> : <VideoOff className="w-4 h-4 mr-2" />}
                            {isCameraLoading ? "Starting..." : isVideoOn && stream ? "Video On" : "Turn On Video"}
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
                                        <div className="space-y-3">
                                            <div className="bg-white p-4 rounded-xl border border-google-blue/20 shadow-sm relative">
                                                <div className="absolute -top-3 right-4 px-2 py-0.5 bg-google-blue text-white text-[10px] font-bold rounded-full uppercase">Response</div>
                                                <p className="text-sm text-slate-700 leading-relaxed italic">
                                                    "{aiFeedback}"
                                                </p>
                                            </div>

                                            {bodyLanguageFeedback && (
                                                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 shadow-sm relative">
                                                    <div className="absolute -top-3 right-4 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full uppercase flex items-center gap-1">
                                                        <Sparkles className="w-2.5 h-2.5" /> Body Language
                                                    </div>
                                                    <p className="text-sm text-slate-700 leading-relaxed italic">
                                                        "{bodyLanguageFeedback}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex space-x-2 pt-2">
                                            <Button variant="outline" className="flex-1 text-xs" onClick={() => {
                                                if (aiFeedback.includes("error")) {
                                                    handleEvaluation();
                                                } else {
                                                    speakFeedback(aiFeedback);
                                                }
                                            }}>
                                                {aiFeedback.includes("error") ? "Try Again" : "Replay Voice"}
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
