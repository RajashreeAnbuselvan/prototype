"use client";

import React, { useState } from "react";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([
        { role: "assistant", content: "Hi there! I'm your Vertex-powered PrepBuddy Assistant. How can I help you prepare for your Google interview today?" }
    ]);
    const [inputValue, setInputValue] = useState("");

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const userMessage = inputValue.trim().toLowerCase();
        setMessages([...messages, { role: "user", content: inputValue }]);
        setInputValue("");

        // Agentic Command Logic
        if (userMessage.startsWith("/")) {
            setTimeout(() => {
                if (userMessage === "/start" || userMessage === "/interview") {
                    setMessages(prev => [...prev, {
                        role: "assistant",
                        content: "Acknowledged. Initiating your Google Mock Interview now... Redirecting you."
                    }]);
                    setTimeout(() => {
                        window.location.href = "/dashboard/interview";
                    }, 1500);
                } else if (userMessage === "/history") {
                    setMessages(prev => [...prev, {
                        role: "assistant",
                        content: "Fetching your interview history. One moment..."
                    }]);
                    setTimeout(() => {
                        window.location.href = "/dashboard/history";
                    }, 1500);
                } else {
                    setMessages(prev => [...prev, {
                        role: "assistant",
                        content: "Unknown command. Try /start, /history, or /analytics."
                    }]);
                }
            }, 800);
            return;
        }

        // Mock response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "That's a great question! For Google, I recommend focusing on MapReduce and System Design. Would you like to try a practice question?"
            }]);
        }, 1000);
    };

    return (
        <>
            {/* Floating Action Button */}
            <Button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl z-50 transition-all duration-300",
                    isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100",
                    "bg-white hover:bg-slate-50 border border-slate-200"
                )}
            >
                <div className="flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-google-blue" />
                </div>
            </Button>

            {/* Chat Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-slate-200"
                    >
                        {/* Header with Gemini-inspired gradient */}
                        <div className="p-4 bg-gradient-to-r from-google-blue to-purple-600 text-white flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">PrepBuddy Assistant</h3>
                                    <p className="text-[10px] text-white/80">Powered by Gemini 1.5 Pro</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 h-8 w-8">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Chat Messages */}
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.map((m, i) => (
                                    <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                                        <div className={cn(
                                            "max-w-[80%] p-3 rounded-2xl text-sm",
                                            m.role === "user" ? "bg-google-blue text-white rounded-tr-none" : "bg-slate-100 text-slate-800 rounded-tl-none"
                                        )}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-4 border-t border-slate-100 flex items-center space-x-2">
                            <Input
                                placeholder="Ask me anything..."
                                className="bg-slate-50 border-none h-10"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            />
                            <Button size="icon" className="bg-google-blue hover:bg-google-blue/90 h-10 w-10 flex-shrink-0" onClick={handleSend}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
