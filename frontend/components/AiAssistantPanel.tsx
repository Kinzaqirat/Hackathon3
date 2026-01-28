"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, User, Send, RotateCcw, X, Sparkles, Lightbulb, Bug, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { sendChatMessage, fetchChatMessages, createChatSession } from "@/lib/api";

interface AiAssistantPanelProps {
    isOpen: boolean;
    onClose: () => void;
    exerciseId?: number;
    exerciseTitle?: string;
    currentCode?: string;
    onCodeChange?: (code: string) => void;
}

export function AiAssistantPanel({ 
    isOpen, 
    onClose, 
    exerciseId, 
    exerciseTitle, 
    currentCode,
    onCodeChange
}: AiAssistantPanelProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    
    // Initialize chat session when panel opens
    useEffect(() => {
        if (isOpen && !sessionId) {
            initChatSession();
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const initChatSession = async () => {
        try {
            // In a real implementation, we'd get the actual user ID
            // For now, using a mock user ID
            const mockUserId = 1;
            const session = await createChatSession(
                mockUserId, 
                exerciseTitle || "exercise-help", 
                "exercise"
            );
            setSessionId(session.id);
            
            // Add welcome message
            setMessages([{
                id: 1,
                role: "assistant",
                content: `Hello! I'm your AI assistant for the "${exerciseTitle}" exercise. I can help you understand the requirements, debug your code, or provide hints. What would you like help with?`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (error) {
            console.error("Error initializing chat session:", error);
            setMessages([{
                id: 1,
                role: "assistant",
                content: "I'm having trouble connecting to the AI assistant. Please make sure the backend is running and the API keys are configured.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !sessionId || isLoading) return;

        const userMsg = {
            id: Date.now(),
            role: "user",
            content: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            // Send message to backend
            await sendChatMessage(sessionId, input);

            // Fetch updated messages including AI response
            const updatedMessages = await fetchChatMessages(sessionId);

            // Update messages with latest from backend
            setMessages(updatedMessages.map((msg: any, index: number) => ({
                id: msg.id || index,
                role: msg.role,
                content: msg.content,
                timestamp: new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            })));
        } catch (error) {
            console.error("Error sending message:", error);

            // Add error message to chat
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: "assistant",
                content: "I'm having trouble processing your request. Please try again.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Quick action buttons for common AI requests
    const handleQuickAction = (action: string) => {
        let prompt = "";
        
        switch(action) {
            case "hint":
                prompt = "Can you give me a hint for this exercise?";
                break;
            case "explain":
                prompt = `Can you explain the requirements for this exercise: ${exerciseTitle}?`;
                break;
            case "debug":
                prompt = `Can you help me debug my code? Here's what I have so far:\n\n${currentCode}`;
                break;
            case "optimize":
                prompt = `How can I improve this code?\n\n${currentCode}`;
                break;
            default:
                return;
        }
        
        setInput(prompt);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-background border-l z-50 flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0">
            <div className="flex items-center justify-between border-b px-4 py-3 bg-primary/5">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Bot size={16} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">AI Exercise Helper</h3>
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                            {exerciseTitle || "Exercise Help"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        className="p-1.5 rounded-md transition-colors hover:bg-muted"
                        title="Reset Chat"
                        onClick={() => {
                            setMessages([]);
                            initChatSession();
                        }}
                    >
                        <RotateCcw size={16} className="text-muted-foreground" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-md transition-colors hover:bg-muted"
                    >
                        <X size={18} className="text-muted-foreground" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5"
            >
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            "flex items-start gap-3 animate-in slide-in-from-bottom-2",
                            message.role === "user" ? "flex-row-reverse" : "flex-row"
                        )}
                    >
                        <div className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border shadow-sm",
                            message.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                            {message.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
                        </div>
                        <div className={cn(
                            "relative max-w-[80%] rounded-xl px-3 py-2 text-sm shadow-sm",
                            message.role === "assistant"
                                ? "bg-card border-border border text-foreground rounded-tl-none"
                                : "bg-primary text-primary-foreground rounded-tr-none"
                        )}>
                            {message.content}
                            <div className={cn(
                                "mt-1 text-xs opacity-60",
                                message.role === "user" ? "text-right" : "text-left"
                            )}>
                                {message.timestamp}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border shadow-sm bg-primary text-primary-foreground">
                            <Bot size={14} />
                        </div>
                        <div className="relative max-w-[80%] rounded-xl px-3 py-2 text-sm shadow-sm bg-card border-border border text-foreground rounded-tl-none">
                            <div className="flex items-center gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse delay-75"></div>
                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse delay-150"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Action Buttons */}
            <div className="border-t bg-muted/10 p-3">
                <div className="flex flex-wrap gap-2 mb-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction("hint")}
                        className="text-xs px-2 py-1 h-7"
                    >
                        <Lightbulb size={12} className="mr-1" />
                        Hint
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction("explain")}
                        className="text-xs px-2 py-1 h-7"
                    >
                        <Code size={12} className="mr-1" />
                        Explain
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction("debug")}
                        className="text-xs px-2 py-1 h-7"
                    >
                        <Bug size={12} className="mr-1" />
                        Debug
                    </Button>
                </div>
            </div>

            {/* Input Area */}
            <div className="border-t p-3 bg-card">
                <div className="flex items-center gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask for help with this exercise..."
                        className="flex-1 resize-none rounded-lg border border-input bg-background p-2 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-[40px] max-h-[100px]"
                        rows={1}
                        disabled={isLoading || !sessionId}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading || !sessionId}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {isLoading ? <RotateCcw className="h-4 w-4 animate-spin" /> : <Send size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
}