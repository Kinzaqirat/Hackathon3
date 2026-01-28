"use client";

import { useState } from "react";
import {
    Code2,
    Play,
    Send,
    Lightbulb,
    ChevronLeft,
    Trophy,
    CheckCircle2,
    AlertCircle,
    RotateCcw,
    Sparkles,
    BookOpen,
    Bot
} from "lucide-react";
import Link from "next/link";
import { AiCodeEditor } from "@/components/AiCodeEditor";
import { AiExecutionFeedback } from "@/components/AiExecutionFeedback";
import { AiTutor } from "@/components/AiTutor";
import { AiAssessment } from "@/components/AiAssessment";
import { CodeExecutionOutput } from "@/components/CodeExecutionOutput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AiFeaturesDemo() {
    const [code, setCode] = useState("# Write your Python code here\nprint('Hello, AI World!')");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState("editor");
    const [showTutor, setShowTutor] = useState(false);
    const [showAssessment, setShowAssessment] = useState(false);
    const [assessmentResult, setAssessmentResult] = useState<any>(null);
    const [executionResult, setExecutionResult] = useState<any>(null);

    const handleRun = async (codeToRun: string) => {
        setIsRunning(true);
        setOutput("Executing Python code...\n");
        setError(null);

        try {
            // Simulate execution
            setTimeout(() => {
                const mockOutput = `Hello, AI World!\nExecution completed successfully (0.04s)\n`;
                setOutput(mockOutput);

                // Set execution result for AI feedback
                setExecutionResult({
                    success: true,
                    output: mockOutput,
                    executionTime: 40
                });

                setIsRunning(false);
            }, 1500);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "An error occurred during execution";
            setError(errorMsg);
            setExecutionResult({
                success: false,
                error: errorMsg
            });
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        // Simulate assessment
        setShowAssessment(true);
    };

    const handleAssessmentComplete = (result: any) => {
        setAssessmentResult(result);
    };

    return (
        <div className="flex h-screen flex-col gap-6 bg-background">
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border bg-card transition-all hover:bg-muted hover:scale-105"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">AI Features Demo</h1>
                        <p className="text-sm text-muted-foreground">Experience the power of AI in code learning</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-4">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Demo Mode</span>
                        <span className="text-lg font-black text-primary">AI Enhanced</span>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setShowTutor(true)}
                        className="flex items-center gap-2"
                    >
                        <Bot className="h-4 w-4" />
                        AI Tutor
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel - Editor */}
                <div className="w-1/2 flex flex-col p-4 gap-4">
                    <div className="flex border-b bg-muted/30 p-1">
                        <button
                            onClick={() => setActiveTab("editor")}
                            className={cn(
                                "flex-1 rounded-2xl py-2 text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === "editor" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Code Editor
                        </button>
                        <button
                            onClick={() => setActiveTab("exercise")}
                            className={cn(
                                "flex-1 rounded-2xl py-2 text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === "exercise" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Exercise
                        </button>
                    </div>

                    {activeTab === "editor" ? (
                        <div className="flex-1 rounded-2xl border bg-card shadow-sm overflow-hidden flex flex-col">
                            <AiCodeEditor
                                value={code}
                                onChange={(value) => setCode(value || "")}
                                language="python"
                                onRun={handleRun}
                                showControls={true}
                                exerciseId={1}
                                exerciseTitle="Python Variables and Data Types"
                            />
                        </div>
                    ) : (
                        <div className="flex-1 rounded-2xl border bg-card shadow-sm overflow-y-auto p-6">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-black mb-2">Python Variables and Data Types</h2>
                                    <p className="text-muted-foreground">
                                        Create variables for name, age, and city, then print them. Learn about different data types in Python.
                                    </p>
                                </div>

                                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                                    <h3 className="font-black text-primary mb-2 flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4" />
                                        Instructions
                                    </h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary mt-1">•</span>
                                            <span>Create variables for name (string), age (integer), and city (string)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary mt-1">•</span>
                                            <span>Print the variables using f-string formatting</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary mt-1">•</span>
                                            <span>Follow Python naming conventions</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                    <h3 className="font-black text-blue-800 mb-2 flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" />
                                        Key Concepts
                                    </h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span>Variables store data values</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span>Data types: str, int, float, bool</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span>F-strings for string formatting</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="h-64 rounded-2xl border bg-card shadow-sm overflow-hidden">
                        <CodeExecutionOutput
                            output={output}
                            error={error || undefined}
                            isLoading={isRunning}
                            onClose={() => {}}
                        />
                    </div>
                </div>

                {/* Right Panel - AI Features */}
                <div className="w-1/2 flex flex-col p-4 gap-4">
                    <div className="flex border-b bg-muted/30 p-1">
                        <button
                            onClick={() => setActiveTab("feedback")}
                            className={cn(
                                "flex-1 rounded-2xl py-2 text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === "feedback" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            AI Feedback
                        </button>
                        <button
                            onClick={() => setActiveTab("assessment")}
                            className={cn(
                                "flex-1 rounded-2xl py-2 text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === "assessment" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            AI Assessment
                        </button>
                    </div>

                    {activeTab === "feedback" ? (
                        <div className="flex-1 rounded-2xl border bg-card shadow-sm overflow-hidden">
                            <AiExecutionFeedback
                                result={executionResult}
                                isLoading={false}
                            />
                        </div>
                    ) : (
                        <div className="flex-1 rounded-2xl border bg-card shadow-sm overflow-hidden">
                            <AiAssessment
                                code={code}
                                exerciseId={1}
                                onAssessmentComplete={handleAssessmentComplete}
                                onRetake={() => setShowAssessment(false)}
                            />
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={() => handleRun(code)}
                            disabled={isRunning}
                            className="flex-1 h-12 items-center gap-2 rounded-xl bg-muted px-6 text-sm font-black uppercase tracking-widest transition-all hover:bg-muted/80 disabled:opacity-50 flex items-center justify-center"
                        >
                            {isRunning ? <RotateCcw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                            Run Code
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 flex items-center justify-center"
                        >
                            <Send size={18} />
                            Submit for Assessment
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Tutor Panel */}
            <AiTutor
                isOpen={showTutor}
                onClose={() => setShowTutor(false)}
                exerciseId={1}
                exerciseTitle="Python Variables and Data Types"
                currentCode={code}
                topic="Variables and Data Types"
            />
        </div>
    );
}