"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, AlertCircle, RotateCcw, Sparkles, Wrench, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExecutionResult {
    success: boolean;
    output: string;
    error?: string;
    executionTime?: number;
    feedback?: string;
    suggestions?: string[];
}

interface AiExecutionFeedbackProps {
    result: ExecutionResult | null;
    isLoading: boolean;
    onClose?: () => void;
}

export function AiExecutionFeedback({ result, isLoading, onClose }: AiExecutionFeedbackProps) {
    const [aiFeedback, setAiFeedback] = useState<string | null>(null);
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Analyze the execution result with AI
    useEffect(() => {
        if (result && !isLoading) {
            analyzeWithAI(result);
        }
    }, [result, isLoading]);

    const analyzeWithAI = async (executionResult: ExecutionResult) => {
        setIsAnalyzing(true);
        
        try {
            // In a real implementation, this would call the AI service
            // For now, we'll simulate AI analysis
            setTimeout(() => {
                if (executionResult.success) {
                    setAiFeedback("Great job! Your code executed successfully. It appears to be working correctly according to the requirements.");
                    setAiSuggestions([
                        "Consider adding comments to explain complex logic",
                        "You could optimize this by using list comprehension",
                        "Consider adding error handling for edge cases"
                    ]);
                } else {
                    setAiFeedback("There are some issues with your code that need to be addressed:");
                    setAiSuggestions([
                        "Check your syntax near the error location",
                        "Make sure all variables are properly initialized",
                        "Verify that your logic matches the exercise requirements"
                    ]);
                }
                setIsAnalyzing(false);
            }, 800);
        } catch (error) {
            console.error("Error analyzing execution result:", error);
            setAiFeedback("Could not analyze the execution result. Please try again.");
            setIsAnalyzing(false);
        }
    };

    if (!result && !isLoading) {
        return (
            <div className="h-64 flex items-center justify-center border rounded-xl bg-muted/30">
                <p className="text-muted-foreground">Run your code to see execution feedback</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full overflow-hidden rounded-xl border bg-card shadow-inner flex flex-col">
            <div className="flex items-center justify-between p-2 bg-muted border-b">
                <div className="text-xs font-mono text-muted-foreground ml-2 flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-primary" />
                    AI Execution Analysis
                </div>
                {onClose && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-7 w-7 p-0"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading || isAnalyzing ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Analyzing your code...</p>
                        </div>
                    </div>
                ) : result ? (
                    <>
                        <div className={cn(
                            "flex items-start gap-3 p-4 rounded-xl",
                            result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                        )}>
                            {result.success ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                                <h4 className="font-bold text-sm mb-1">
                                    {result.success ? "Execution Successful!" : "Execution Failed"}
                                </h4>
                                <p className="text-sm">
                                    {result.success 
                                        ? "Your code ran without errors and produced the expected output." 
                                        : result.error || "An error occurred during execution."}
                                </p>
                                {result.executionTime && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Execution time: {result.executionTime}ms
                                    </p>
                                )}
                            </div>
                        </div>

                        {aiFeedback && (
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-sm mb-1">AI Analysis</h4>
                                        <p className="text-sm">{aiFeedback}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {aiSuggestions && aiSuggestions.length > 0 && (
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-sm mb-2">AI Suggestions</h4>
                                        <ul className="space-y-2">
                                            {aiSuggestions.map((suggestion, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="text-amber-600 mt-1">•</span>
                                                    <span className="text-sm">{suggestion}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {result.output && (
                            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                                <h4 className="font-bold text-sm mb-2">Program Output</h4>
                                <pre className="whitespace-pre-wrap font-mono text-xs bg-white p-3 rounded-lg overflow-x-auto max-h-32 overflow-y-auto">
                                    {result.output}
                                </pre>
                            </div>
                        )}
                    </>
                ) : null}
            </div>
        </div>
    );
}