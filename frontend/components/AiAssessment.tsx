"use client";

import { useState, useEffect } from "react";
import { 
    Trophy, 
    Star, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Target, 
    Sparkles, 
    RotateCcw, 
    BarChart3,
    Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AssessmentResult {
    score: number;
    maxScore: number;
    feedback: string;
    suggestions: string[];
    passed: boolean;
    completionTime: number; // in seconds
    strengths: string[];
    areasForImprovement: string[];
}

interface AiAssessmentProps {
    code: string;
    exerciseId: number;
    onAssessmentComplete?: (result: AssessmentResult) => void;
    onRetake?: () => void;
}

export function AiAssessment({ code, exerciseId, onAssessmentComplete, onRetake }: AiAssessmentProps) {
    const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
    const [isGrading, setIsGrading] = useState(false);
    const [gradeProgress, setGradeProgress] = useState(0);

    // Simulate AI grading process
    const performAssessment = async () => {
        setIsGrading(true);
        setGradeProgress(0);
        
        // Simulate grading progress
        const interval = setInterval(() => {
            setGradeProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
        
        // Simulate AI analysis
        setTimeout(() => {
            clearInterval(interval);
            
            // Generate mock assessment result
            const mockResult: AssessmentResult = {
                score: Math.floor(Math.random() * 41) + 60, // Random score between 60-100
                maxScore: 100,
                feedback: generateFeedback(),
                suggestions: generateSuggestions(),
                passed: Math.random() > 0.3, // 70% pass rate
                completionTime: Math.floor(Math.random() * 1200) + 60, // 1-20 mins
                strengths: generateStrengths(),
                areasForImprovement: generateAreasForImprovement()
            };
            
            setAssessmentResult(mockResult);
            setIsGrading(false);
            
            if (onAssessmentComplete) {
                onAssessmentComplete(mockResult);
            }
        }, 2500);
    };

    // Generate feedback based on code
    const generateFeedback = (): string => {
        const feedbackOptions = [
            "Excellent work! Your solution demonstrates a solid understanding of the concepts.",
            "Good effort! You've implemented most of the requirements correctly.",
            "Well done! Your approach shows good problem-solving skills.",
            "Nice try! You're on the right track with a few adjustments needed.",
            "Keep practicing! You have the basics down but need more refinement."
        ];
        return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
    };

    // Generate suggestions
    const generateSuggestions = (): string[] => {
        const suggestions = [
            "Consider adding comments to explain your logic",
            "Try to optimize your solution for better performance",
            "Follow Python naming conventions (PEP 8)",
            "Handle edge cases in your implementation",
            "Use more descriptive variable names",
            "Consider breaking down complex functions into smaller ones",
            "Add error handling for robustness"
        ];
        
        // Return 2-4 random suggestions
        const count = Math.floor(Math.random() * 3) + 2;
        const shuffled = [...suggestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    // Generate strengths
    const generateStrengths = (): string[] => {
        const strengths = [
            "Clear and readable code structure",
            "Good use of appropriate data structures",
            "Effective problem-solving approach",
            "Proper use of Python idioms",
            "Well-organized logic flow",
            "Good variable naming conventions"
        ];
        
        // Return 1-3 random strengths
        const count = Math.floor(Math.random() * 3) + 1;
        const shuffled = [...strengths].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    // Generate areas for improvement
    const generateAreasForImprovement = (): string[] => {
        const areas = [
            "Consider adding more comments for clarity",
            "Optimize for better time/space complexity",
            "Handle more edge cases",
            "Improve variable naming for readability",
            "Break down complex functions",
            "Add error handling",
            "Follow Python style guidelines more closely"
        ];
        
        // Return 1-3 random areas
        const count = Math.floor(Math.random() * 3) + 1;
        const shuffled = [...areas].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    // Calculate score percentage
    const getScorePercentage = () => {
        if (!assessmentResult) return 0;
        return Math.round((assessmentResult.score / assessmentResult.maxScore) * 100);
    };

    // Get score color based on performance
    const getScoreColor = () => {
        if (!assessmentResult) return "text-gray-500";
        
        const percentage = getScorePercentage();
        if (percentage >= 90) return "text-emerald-600";
        if (percentage >= 80) return "text-green-600";
        if (percentage >= 70) return "text-amber-600";
        return "text-red-600";
    };

    // Get badge based on score
    const getBadge = () => {
        if (!assessmentResult) return null;
        
        const percentage = getScorePercentage();
        if (percentage >= 90) return { icon: <Award className="h-6 w-6 text-yellow-500" />, label: "Excellent!" };
        if (percentage >= 80) return { icon: <Star className="h-6 w-6 text-blue-500" />, label: "Great Job!" };
        if (percentage >= 70) return { icon: <Trophy className="h-6 w-6 text-amber-500" />, label: "Good Work!" };
        return { icon: <BarChart3 className="h-6 w-6 text-gray-500" />, label: "Keep Practicing!" };
    };

    // Perform assessment when component mounts if code is provided
    useEffect(() => {
        if (code && code.trim() !== "" && !assessmentResult && !isGrading) {
            performAssessment();
        }
    }, [code]);

    return (
        <div className="h-full w-full overflow-hidden rounded-xl border bg-card shadow-inner flex flex-col">
            <div className="flex items-center justify-between p-2 bg-muted border-b">
                <div className="text-xs font-mono text-muted-foreground ml-2 flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-primary" />
                    AI Assessment & Grading
                </div>
                {assessmentResult && (
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${getScoreColor()}`}>
                            {getScorePercentage()}%
                        </span>
                    </div>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
                {isGrading ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                            </div>
                        </div>
                        
                        <div className="text-center space-y-2">
                            <h3 className="font-bold text-lg">AI is Assessing Your Code</h3>
                            <p className="text-muted-foreground">Analyzing logic, efficiency, and correctness</p>
                        </div>
                        
                        <div className="w-64 bg-muted rounded-full h-2.5">
                            <div 
                                className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out" 
                                style={{ width: `${gradeProgress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-muted-foreground">{gradeProgress}% complete</p>
                    </div>
                ) : assessmentResult ? (
                    <div className="space-y-6">
                        <div className="text-center py-4">
                            <div className="flex justify-center mb-3">
                                {getBadge()?.icon}
                            </div>
                            <h2 className="text-2xl font-bold">{getBadge()?.label}</h2>
                            <div className="mt-2 flex items-center justify-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-yellow-500" />
                                    <span className={`text-2xl font-black ${getScoreColor()}`}>
                                        {assessmentResult.score}/{assessmentResult.maxScore}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        {Math.floor(assessmentResult.completionTime / 60)}m {assessmentResult.completionTime % 60}s
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                <h3 className="font-bold text-green-800 flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="h-5 w-5" />
                                    Feedback
                                </h3>
                                <p className="text-green-700">{assessmentResult.feedback}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
                                        <Star className="h-5 w-5" />
                                        Strengths
                                    </h3>
                                    <ul className="space-y-2">
                                        {assessmentResult.strengths.map((strength, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-blue-700">
                                                <span className="mt-1">✓</span>
                                                <span className="text-sm">{strength}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <h3 className="font-bold text-amber-800 flex items-center gap-2 mb-2">
                                        <Target className="h-5 w-5" />
                                        Areas for Improvement
                                    </h3>
                                    <ul className="space-y-2">
                                        {assessmentResult.areasForImprovement.map((area, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-amber-700">
                                                <span className="mt-1">→</span>
                                                <span className="text-sm">{area}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                <h3 className="font-bold text-purple-800 flex items-center gap-2 mb-2">
                                    <Sparkles className="h-5 w-5" />
                                    AI Suggestions
                                </h3>
                                <ul className="space-y-2">
                                    {assessmentResult.suggestions.map((suggestion, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-purple-700">
                                            <span className="mt-1">💡</span>
                                            <span className="text-sm">{suggestion}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                        {!assessmentResult.passed && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <h3 className="font-bold text-red-800 flex items-center gap-2 mb-2">
                                    <XCircle className="h-5 w-5" />
                                    Need More Practice
                                </h3>
                                <p className="text-red-700">
                                    You didn't quite meet the passing criteria. Review the feedback and suggestions above, 
                                    then try again to improve your solution.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-6">
                        <div className="bg-primary/10 p-4 rounded-full">
                            <BarChart3 className="h-12 w-12 text-primary" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="font-bold text-lg">Ready for Assessment</h3>
                            <p className="text-muted-foreground max-w-md">
                                Submit your code to receive AI-powered assessment and detailed feedback
                            </p>
                        </div>
                        <Button 
                            onClick={performAssessment}
                            className="flex items-center gap-2"
                        >
                            <Sparkles className="h-4 w-4" />
                            Grade My Code
                        </Button>
                    </div>
                )}
            </div>
            
            {assessmentResult && (
                <div className="border-t p-3 bg-muted/30">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "h-3 w-3 rounded-full",
                                assessmentResult.passed ? "bg-green-500" : "bg-red-500"
                            )}></div>
                            <span className="text-xs font-bold uppercase tracking-widest">
                                {assessmentResult.passed ? "Passed" : "Needs Improvement"}
                            </span>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={onRetake || performAssessment}
                            className="flex items-center gap-2"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Retake Assessment
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}