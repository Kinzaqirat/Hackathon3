"use client";

import { useState, useRef, useEffect } from "react";
import {
    Send,
    Bot,
    User,
    Sparkles,
    RotateCcw,
    MoreVertical,
    Code,
    MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { createChatSession, fetchChatMessages, sendChatMessage } from "@/lib/api";

export default function ChatPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize chat session
        const initChat = async () => {
            if (authLoading || !user) return;
            
            try {
                const session = await createChatSession(user.id, "general", "general");
                setSessionId(session.id);

                // Add welcome message
                setMessages([{
                    id: 1,
                    role: "assistant",
                    content: "Hello! I'm your LearnFlow AI Assistant. How can I help you with your studies today?",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            } catch (error) {
                console.error("Error initializing chat:", error);
                setMessages([{
                    id: 1,
                    role: "assistant",
                    content: "I'm having trouble connecting to the AI assistant. This might be because the backend service is not running or properly configured. Please make sure the backend is running and the API keys are set up correctly.",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }
        };

        initChat();
    }, [user, authLoading]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

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
                content: "I'm having trouble connecting to the AI assistant. This might be because the backend service is not running or properly configured. Please make sure the backend is running and the API keys are set up correctly.",
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

    return (
        <div className="flex h-full flex-col overflow-hidden bg-card rounded-2xl border shadow-sm">
            <div className="flex items-center justify-between border-b px-6 py-4 bg-primary/5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                        <Bot size={22} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            LearnFlow AI
                            <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />
                        </h2>
                        <div className="flex items-center gap-1.5">
                            <span className={`h-2 w-2 rounded-full ${sessionId ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                                {sessionId ? 'Active & Ready' : 'Connecting...'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="rounded-md p-2 transition-colors hover:bg-muted"
                        title="Reset Chat"
                        onClick={() => window.location.reload()} // Simple reset for demo
                    >
                        <RotateCcw size={18} className="text-muted-foreground" />
                    </button>
                    <button className="rounded-md p-2 transition-colors hover:bg-muted">
                        <MoreVertical size={18} className="text-muted-foreground" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent"
            >
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            "flex items-start gap-4 animate-in slide-in-from-bottom-2",
                            message.role === "user" ? "flex-row-reverse" : "flex-row"
                        )}
                    >
                        <div className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm",
                            message.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                            {message.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        <div className={cn(
                            "relative max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                            message.role === "assistant"
                                ? "bg-card border-border border text-foreground rounded-tl-none"
                                : "bg-primary text-primary-foreground rounded-tr-none"
                        )}>
                            {message.content}
                            <div className={cn(
                                "mt-2 text-[10px] opacity-60",
                                message.role === "user" ? "text-right" : "text-left"
                            )}>
                                {message.timestamp}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm bg-primary text-primary-foreground">
                            <Bot size={16} />
                        </div>
                        <div className="relative max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm bg-card border-border border text-foreground rounded-tl-none">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                                <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-75"></div>
                                <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-150"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t p-6 bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message here... (Shift+Enter for new line)"
                            className="w-full resize-none rounded-xl border border-input bg-card p-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[56px] max-h-[150px]"
                            rows={1}
                            disabled={isLoading || !sessionId}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading || !sessionId}
                            className="absolute right-3 top-[10px] flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isLoading ? <RotateCcw className="h-4 w-4 animate-spin" /> : <Send size={18} />}
                        </button>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
                    <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <Code size={12} />
                        Insert Code Block
                    </button>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <MessageSquare size={12} />
                        Request Live Help
                    </button>
                </div>
            </div>
        </div>
    );
}
