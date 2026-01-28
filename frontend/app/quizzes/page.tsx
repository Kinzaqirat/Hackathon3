"use client";

import { useState, useEffect } from "react";
import {
    BookOpen,
    Trophy,
    Clock,
    Target,
    ChevronRight,
    AlertCircle,
    RotateCcw
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchQuizzes } from "@/lib/api";

export default function QuizzesPage() {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadQuizzes() {
            try {
                const data = await fetchQuizzes();
                setQuizzes(data);
            } catch (err) {
                console.error("Error loading quizzes:", err);
                setError("Failed to load quizzes. The backend server may not be running.");
                setQuizzes([]); // Set empty array as fallback
            } finally {
                setLoading(false);
            }
        }

        loadQuizzes();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <h2 className="text-2xl font-black">Error Loading Quizzes</h2>
                <p className="text-muted-foreground">{error}</p>
                <Button onClick={() => window.location.reload()}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-black tracking-tight mb-4">Python Mastery Quizzes</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Test your knowledge with our carefully crafted quizzes designed to reinforce your Python learning journey.
                </p>
            </div>

            {quizzes.length === 0 ? (
                <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-black mb-2">No Quizzes Available</h3>
                    <p className="text-muted-foreground mb-6">
                        Check back later for new quizzes or complete more exercises to unlock more assessments.
                    </p>
                    <Link href="/exercises">
                        <Button>Continue Learning</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz) => (
                        <Card key={quiz.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <Badge variant="secondary" className="text-xs">
                                        {quiz.level?.name || 'Unknown Level'}
                                    </Badge>
                                    {quiz.time_limit_minutes && (
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {quiz.time_limit_minutes} min
                                        </div>
                                    )}
                                </div>
                                <CardTitle className="text-xl font-black mt-2">{quiz.title}</CardTitle>
                                <CardDescription>{quiz.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                    <div className="flex items-center gap-1">
                                        <Target className="h-4 w-4" />
                                        {quiz.questions?.length || 0} Questions
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Trophy className="h-4 w-4" />
                                        Min. {quiz.passing_score}% to Pass
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <div className="text-xs text-muted-foreground">
                                    {quiz.questions?.length || 0} questions
                                </div>
                                <Link href={`/quizzes/${quiz.id}`}>
                                    <Button size="sm">
                                        Start Quiz
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}