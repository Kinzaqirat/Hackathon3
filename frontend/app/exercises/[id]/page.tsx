"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    Code2,
    Play,
    Send,
    Lightbulb,
    ChevronLeft,
    ChevronRight,
    Trophy,
    CheckCircle2,
    AlertCircle,
    RotateCcw,
    X,
    Sparkles,
    BookOpen,
    Bot
} from "lucide-react";
import Link from "next/link";
import { AiCodeEditor } from "@/components/AiCodeEditor";
import { CodeExecutionOutput } from "@/components/CodeExecutionOutput";
import { AiTutor } from "@/components/AiTutor";
import { AiAssessment } from "@/components/AiAssessment";
import { AiExecutionFeedback } from "@/components/AiExecutionFeedback";
import { cn } from "@/lib/utils";
import { fetchExercise } from "@/lib/api";

export default function ExerciseDetail() {
    const params = useParams();
    const [exercise, setExercise] = useState<any>(null);
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState("description");
    const [isLoading, setIsLoading] = useState(true);
    const [showOutput, setShowOutput] = useState(true);
    const [showTutor, setShowTutor] = useState(false);
    const [showAssessment, setShowAssessment] = useState(false);
    const [executionResult, setExecutionResult] = useState<any>(null);
    const [assessmentResult, setAssessmentResult] = useState<any>(null);

    useEffect(() => {
        async function loadExercise() {
            if (!params || !params.id) return;
            try {
                const data = await fetchExercise(params.id as string);

                // Validate that we received valid exercise data
                if (!data || !data.title) {
                    throw new Error("Invalid exercise data received");
                }

                setExercise(data);
                setCode(data.starter_code || "# Write your Python code here\n\nprint('Hello LearnFlow!')");
            } catch (error) {
                console.error("Error loading exercise:", error);

                // In case of error, try to fetch the exercise using the API function
                // which handles mock data consistently
                const exerciseData = await fetchExercise(params.id as string);
                setExercise(exerciseData);
                setCode(exerciseData.starter_code || "# Write your Python code here\n\nprint('Hello LearnFlow!')\n# Try different Python concepts\n# like variables, loops, or functions");
            } finally {
                setIsLoading(false);
            }
        }
        loadExercise();
    }, [params]);

    const handleRun = async (codeToRun: string) => {
        setIsRunning(true);
        setOutput("Executing Python code...\n");
        setError(null);

        try {
            // In a real implementation, this would call the backend API
            // For now, simulate execution
            setTimeout(() => {
                // Mock execution - in a real app, this would be an API call
                const mockOutput = `Hello LearnFlow!\nExecution completed successfully (0.04s)\n`;
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
        // Show assessment panel
        setShowAssessment(true);
    };

    const handleAssessmentComplete = (result: any) => {
        setAssessmentResult(result);
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!exercise) {
        return (
            <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <h2 className="text-2xl font-black">Exercise Not Found</h2>
                <Link href="/exercises" className="text-primary hover:underline font-bold uppercase tracking-widest text-xs">Back to Syllabus</Link>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-10rem)] flex-col gap-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/exercises"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border bg-card transition-all hover:bg-muted hover:scale-105"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-widest text-primary">Python Mastery #{exercise.id}</span>
                            <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">{exercise.difficulty_level}</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight">{exercise.title}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-4">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Target Reward</span>
                        <span className="text-lg font-black text-emerald-600">+250 XP</span>
                    </div>
                    <button
                        onClick={() => setShowTutor(true)}
                        className="flex h-11 items-center gap-2 rounded-xl bg-blue-500/10 text-blue-600 px-6 text-sm font-black uppercase tracking-widest transition-all hover:bg-blue-500/20"
                    >
                        <Bot className="h-4 w-4 fill-current" />
                        AI Tutor
                    </button>
                    <button
                        onClick={() => handleRun(code)}
                        disabled={isRunning}
                        className="flex h-11 items-center gap-2 rounded-xl bg-muted px-6 text-sm font-black uppercase tracking-widest transition-all hover:bg-muted/80 disabled:opacity-50"
                    >
                        {isRunning ? <RotateCcw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                        Run
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex h-11 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
                    >
                        <Send size={18} />
                        Submit
                    </button>
                </div>
            </div>

            <div className="grid flex-1 gap-6 lg:grid-cols-2 overflow-hidden">
                <div className="flex flex-col rounded-3xl border bg-card shadow-sm overflow-hidden">
                    <div className="flex border-b bg-muted/30 p-1">
                        <button
                            onClick={() => setActiveTab("description")}
                            className={cn(
                                "flex-1 rounded-2xl py-3 text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === "description" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab("hints")}
                            className={cn(
                                "flex-1 rounded-2xl py-3 text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === "hints" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Hints
                        </button>
                        <button
                            onClick={() => setActiveTab("ai-assist")}
                            className={cn(
                                "flex-1 rounded-2xl py-3 text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === "ai-assist" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            AI Assistant
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 prose prose-slate max-w-none scrollbar-thin scrollbar-thumb-primary/10">
                        {activeTab === "description" ? (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                <h3 className="text-xl font-black mb-4 uppercase tracking-tight">The Challenge</h3>
                                <p className="text-muted-foreground font-medium leading-relaxed">
                                    {exercise.description}
                                </p>

                                <h4 className="text-md font-black mt-8 mb-3 uppercase tracking-widest text-foreground/80">Goal</h4>
                                <p className="text-muted-foreground font-medium italic">
                                    Implement the solution in Python ensuring all edge cases are handled. Correct logic will earn you full points and unlock the next level.
                                </p>

                                <div className="mt-8 rounded-2xl bg-primary/5 p-6 border border-primary/10">
                                    <h4 className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest mb-2">
                                        <Trophy className="h-4 w-4" />
                                        Bonus Objective
                                    </h4>
                                    <p className="text-sm font-medium text-foreground/60">
                                        Use list comprehension to make your code more "Pythonic" for an extra badge!
                                    </p>
                                </div>
                            </div>
                        ) : activeTab === "hints" ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                {exercise.hints?.map((hint: string, i: number) => (
                                    <div key={i} className="flex gap-4 rounded-2xl border bg-muted/30 p-5 group transition-all hover:border-primary/30">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Lightbulb size={20} className="group-hover:animate-pulse" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground/80 leading-relaxed italic">{hint}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-up-4 duration-300">
                                <div className="flex items-center gap-2 mb-6">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-black uppercase tracking-tight">AI Assistant</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-5 rounded-2xl border border-primary/10">
                                        <h4 className="flex items-center gap-2 font-black text-sm uppercase tracking-widest mb-3 text-primary">
                                            <Sparkles className="h-4 w-4" />
                                            AI Explanation
                                        </h4>
                                        <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                                            This exercise focuses on {exercise.topic}. Understanding this concept is crucial for Python programming as it forms the foundation for more complex operations.
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 p-5 rounded-2xl border border-blue-100/30">
                                        <h4 className="flex items-center gap-2 font-black text-sm uppercase tracking-widest mb-3 text-blue-600">
                                            <Lightbulb className="h-4 w-4" />
                                            AI Hints
                                        </h4>
                                        <ul className="text-sm font-medium text-foreground/80 space-y-2">
                                            {exercise.hints?.slice(0, 2).map((hint: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="text-blue-600 mt-1">•</span>
                                                    <span>{hint}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-gradient-to-r from-emerald-50/50 to-green-50/50 p-5 rounded-2xl border border-emerald-100/30">
                                        <h4 className="flex items-center gap-2 font-black text-sm uppercase tracking-widest mb-3 text-emerald-600">
                                            <Code2 className="h-4 w-4" />
                                            AI Solution Approach
                                        </h4>
                                        <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                                            To solve this exercise, you should focus on implementing the core logic while considering edge cases. Pay attention to variable naming conventions and code readability.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6 overflow-hidden">
                    <div className="flex-1 rounded-3xl border bg-card shadow-sm overflow-hidden flex flex-col relative group">
                        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest backdrop-blur-md">AI Enhanced</span>
                        </div>
                        <AiCodeEditor
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            language="python"
                            onRun={handleRun}
                            showControls={true}
                            exerciseId={exercise.id}
                            exerciseTitle={exercise.title}
                        />
                    </div>

                    {showOutput && (
                        <div className="h-64">
                            <CodeExecutionOutput
                                output={output}
                                error={error || undefined}
                                isLoading={isRunning}
                                onClose={() => setShowOutput(false)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* AI Assessment Panel */}
            {showAssessment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-2xl border w-full max-w-4xl h-5/6 flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-black flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                AI Assessment
                            </h2>
                            <button
                                onClick={() => setShowAssessment(false)}
                                className="p-2 rounded-full hover:bg-muted"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden p-4">
                            <AiAssessment
                                code={code}
                                exerciseId={exercise.id}
                                onAssessmentComplete={handleAssessmentComplete}
                                onRetake={() => setAssessmentResult(null)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* AI Tutor Panel */}
            <AiTutor
                isOpen={showTutor}
                onClose={() => setShowTutor(false)}
                exerciseId={exercise.id}
                exerciseTitle={exercise.title}
                currentCode={code}
                topic={exercise.topic}
            />
        </div>
    );
}
