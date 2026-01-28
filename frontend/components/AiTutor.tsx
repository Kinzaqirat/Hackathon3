"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, User, Send, RotateCcw, X, Sparkles, Lightbulb, BookOpen, Target, Trophy, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { sendChatMessage, fetchChatMessages, createChatSession } from "@/lib/api";

interface TutorMessage {
    id: number;
    role: 'tutor' | 'student';
    content: string;
    timestamp: string;
    type?: 'instruction' | 'feedback' | 'encouragement' | 'hint';
}

interface AiTutorProps {
    isOpen: boolean;
    onClose: () => void;
    exerciseId?: number;
    exerciseTitle?: string;
    currentCode?: string;
    onCodeChange?: (code: string) => void;
    topic?: string;
}

export function AiTutor({
    isOpen,
    onClose,
    exerciseId,
    exerciseTitle,
    currentCode,
    onCodeChange,
    topic
}: AiTutorProps) {
    const [messages, setMessages] = useState<TutorMessage[]>([
        {
            id: 1,
            role: 'tutor',
            content: `Hello! I'm your AI tutor. I'm here to help you learn ${topic || 'programming concepts'} step by step. How can I assist you today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'instruction'
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [learningPath, setLearningPath] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initialize tutor session when component opens
    useEffect(() => {
        if (isOpen && !sessionId) {
            initTutorSession();
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const initTutorSession = async () => {
        try {
            // In a real implementation, we'd get the actual user ID
            // For now, using a mock user ID
            const mockUserId = 1;
            const session = await createChatSession(
                mockUserId,
                topic || "guided-learning",
                "concepts"
            );
            setSessionId(session.id);

            // Initialize learning path based on topic
            if (topic) {
                setLearningPath(getLearningPathForTopic(topic));
            }
        } catch (error) {
            console.error("Error initializing tutor session:", error);
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'tutor',
                content: "I'm having trouble connecting to the AI tutor. Please make sure the backend is running and the API keys are configured.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'instruction'
            }]);
        }
    };

    const getLearningPathForTopic = (topic: string): string[] => {
        // Define learning paths for different topics
        const paths: Record<string, string[]> = {
            "Variables and Data Types": [
                "What are variables?",
                "Different data types in Python",
                "Variable naming conventions",
                "Practice with variables"
            ],
            "Control Flow": [
                "Understanding if statements",
                "elif and else clauses",
                "Nested conditions",
                "Practice with control flow"
            ],
            "Loops": [
                "For loops in Python",
                "While loops",
                "Loop control statements",
                "Practice with loops"
            ],
            "Functions": [
                "Defining functions",
                "Function parameters",
                "Return values",
                "Practice with functions"
            ]
        };

        return paths[topic] || [
            "Introduction to the concept",
            "Key principles",
            "Common patterns",
            "Practice exercises"
        ];
    };

    const handleSend = async () => {
        if (!input.trim() || !sessionId || isLoading) return;

        const userMsg: TutorMessage = {
            id: Date.now(),
            role: "student",
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
            const tutorResponse: TutorMessage = {
                id: Date.now(),
                role: "tutor",
                content: generateTutorResponse(input, currentStep, learningPath),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'instruction'
            };

            setMessages(prev => [...prev, tutorResponse]);
        } catch (error) {
            console.error("Error sending message:", error);

            // Add error message to chat
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: "tutor",
                content: "I'm having trouble processing your request. Please try again.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'instruction'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const generateTutorResponse = (userInput: string, step: number, path: string[]): string => {
        // Generate contextually appropriate responses based on the learning path
        if (path.length > 0) {
            const currentTopic = path[step] || path[path.length - 1];
            
            if (userInput.toLowerCase().includes('help')) {
                return `Sure! Let's focus on "${currentTopic}". ${getDetailedExplanation(currentTopic)}`;
            } else if (userInput.toLowerCase().includes('next')) {
                const nextStep = Math.min(step + 1, path.length - 1);
                setCurrentStep(nextStep);
                return `Great! Let's move to the next topic: "${path[nextStep]}". ${getDetailedExplanation(path[nextStep])}`;
            } else if (userInput.toLowerCase().includes('repeat') || userInput.toLowerCase().includes('again')) {
                return `Let's go over "${currentTopic}" again. ${getDetailedExplanation(currentTopic)}`;
            } else {
                return `I understand you're asking about: "${userInput}". Let's connect this to our current topic: "${currentTopic}". ${getRelatedExplanation(userInput, currentTopic)}`;
            }
        }
        
        return "I'm here to help you learn! What would you like to know about this topic?";
    };

    const getDetailedExplanation = (topic: string): string => {
        const explanations: Record<string, string> = {
            "What are variables?": "Variables are containers for storing data values. In Python, you don't need to declare the type of variable before assigning a value to it. The type is inferred from the value.",
            "Different data types in Python": "Python has several built-in data types including integers (int), floating-point numbers (float), strings (str), booleans (bool), lists, tuples, and dictionaries.",
            "Variable naming conventions": "Variable names in Python must start with a letter or underscore, can contain letters, numbers, and underscores, and are case-sensitive. Use descriptive names and follow PEP 8 guidelines.",
            "Practice with variables": "Try creating variables for different data types. For example: name = 'Alice', age = 25, height = 5.6, is_student = True",
            "Understanding if statements": "If statements allow you to execute code only when a certain condition is true. The basic syntax is: if condition: # code to execute",
            "elif and else clauses": "Use elif (else if) for additional conditions and else for a default case when no conditions are met.",
            "Nested conditions": "You can have if statements inside other if statements. Just be mindful of indentation.",
            "Practice with control flow": "Try writing a program that checks if a number is positive, negative, or zero using if/elif/else statements.",
            "For loops in Python": "For loops are used to iterate over sequences like lists, tuples, strings, or ranges.",
            "While loops": "While loops continue executing as long as a condition remains true. Be careful to avoid infinite loops!",
            "Loop control statements": "break exits the loop, continue skips to the next iteration, and pass does nothing but maintains the loop structure.",
            "Practice with loops": "Write a program that prints numbers 1 to 10 using a for loop, then using a while loop.",
            "Defining functions": "Functions are defined using the 'def' keyword followed by the function name and parentheses. Example: def greet(): print('Hello!')",
            "Function parameters": "Parameters are specified after the function name in parentheses. They act as variables inside the function.",
            "Return values": "Functions can return values using the 'return' statement. If no return statement is used, the function returns None.",
            "Practice with functions": "Create a function that takes two numbers as parameters and returns their sum."
        };

        return explanations[topic] || "Let me explain this concept in more detail...";
    };

    const getRelatedExplanation = (userInput: string, currentTopic: string): string => {
        return `That's a great question! In relation to "${currentTopic}", ${userInput.toLowerCase().includes('variable') ? 'variables are fundamental building blocks that store data' : 'this concept builds on what we just discussed'}. Would you like me to elaborate?`;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Tutor actions for guided learning
    const handleTutorAction = (action: string) => {
        let prompt = "";

        switch(action) {
            case "explain":
                prompt = `Can you explain the current topic: ${learningPath[currentStep] || 'the concept we are discussing'}?`;
                break;
            case "example":
                prompt = `Can you give me a practical example of ${learningPath[currentStep] || 'this concept'}?`;
                break;
            case "practice":
                prompt = `Can you give me a practice exercise for ${learningPath[currentStep] || 'this concept'}?`;
                break;
            case "next":
                prompt = "What's the next topic I should learn?";
                break;
            case "review":
                prompt = "Can you review my current understanding of this topic?";
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
                        <h3 className="font-bold text-sm">AI Learning Tutor</h3>
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                            {topic || "Guided Learning"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                        <Target size={12} className="text-primary" />
                        {currentStep + 1}/{learningPath.length}
                    </div>
                    <button
                        className="p-1.5 rounded-md transition-colors hover:bg-muted"
                        title="Reset Tutor"
                        onClick={() => {
                            setMessages([{
                                id: 1,
                                role: 'tutor',
                                content: `Hello! I'm your AI tutor. I'm here to help you learn ${topic || 'programming concepts'} step by step. How can I assist you today?`,
                                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                type: 'instruction'
                            }]);
                            setCurrentStep(0);
                            initTutorSession();
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
                            message.role === "student" ? "flex-row-reverse" : "flex-row"
                        )}
                    >
                        <div className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border shadow-sm",
                            message.role === "tutor" ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                            {message.role === "tutor" ? <Bot size={14} /> : <User size={14} />}
                        </div>
                        <div className={cn(
                            "relative max-w-[80%] rounded-xl px-3 py-2 text-sm shadow-sm",
                            message.role === "tutor"
                                ? "bg-card border-border border text-foreground rounded-tl-none"
                                : "bg-primary text-primary-foreground rounded-tr-none"
                        )}>
                            {message.content}
                            <div className={cn(
                                "mt-1 text-xs opacity-60",
                                message.role === "student" ? "text-right" : "text-left"
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

            {/* Learning Path Progress */}
            {learningPath.length > 0 && (
                <div className="border-t bg-muted/10 p-3">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Learning Path</p>
                        <span className="text-xs text-muted-foreground">{currentStep + 1}/{learningPath.length}</span>
                    </div>
                    <div className="flex gap-1">
                        {learningPath.map((step, index) => (
                            <div 
                                key={index}
                                className={`h-1.5 flex-1 rounded-full ${
                                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                                }`}
                            />
                        ))}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground truncate">
                        {learningPath[currentStep]}
                    </div>
                </div>
            )}

            {/* Tutor Action Buttons */}
            <div className="border-t bg-muted/10 p-3">
                <div className="flex flex-wrap gap-2 mb-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTutorAction("explain")}
                        className="text-xs px-2 py-1 h-7"
                    >
                        <BookOpen size={12} className="mr-1" />
                        Explain
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTutorAction("example")}
                        className="text-xs px-2 py-1 h-7"
                    >
                        <Lightbulb size={12} className="mr-1" />
                        Example
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTutorAction("practice")}
                        className="text-xs px-2 py-1 h-7"
                    >
                        <Target size={12} className="mr-1" />
                        Practice
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTutorAction("next")}
                        className="text-xs px-2 py-1 h-7"
                    >
                        <Trophy size={12} className="mr-1" />
                        Next
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
                        placeholder="Ask your AI tutor for help..."
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