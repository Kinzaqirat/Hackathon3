"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Clock,
    RotateCcw,
    Send,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronLeft,
    Trophy,
    Target
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchExercise, fetchQuizzes } from "@/lib/api";
import { startQuiz, submitQuizAnswer, completeQuiz, getQuizSubmission } from "@/lib/api";

export default function QuizTakingPage() {
    const params = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{[key: number]: string}>({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [submissionId, setSubmissionId] = useState<number | null>(null);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [finalScore, setFinalScore] = useState<number | null>(null);

    const currentQuestion = quiz?.questions?.[currentQuestionIndex];

    useEffect(() => {
        async function loadQuiz() {
            if (!params || !params.id) return;
            try {
                const quizzes = await fetchQuizzes();
                const selectedQuiz = quizzes.find((q: any) => q.id === parseInt(params.id as string));

                if (selectedQuiz) {
                    setQuiz(selectedQuiz);

                    // Set up timer if quiz has time limit
                    if (selectedQuiz.time_limit_minutes) {
                        setTimeRemaining(selectedQuiz.time_limit_minutes * 60);
                    }
                }
            } catch (error) {
                console.error("Error loading quiz:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadQuiz();
    }, [params]);

    // Timer effect
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (timeRemaining > 0 && quizStarted && !quizCompleted) {
            timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleTimeUp();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [timeRemaining, quizStarted, quizCompleted]);

    const startQuizHandler = async () => {
        try {
            const response = await startQuiz(parseInt(params.id as string), 1); // Using student ID 1 for demo
            setSubmissionId(response.id);
            setQuizStarted(true);
        } catch (error) {
            console.error("Error starting quiz:", error);
        }
    };

    const handleAnswerChange = (value: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: value
        }));
    };

    const handleNextQuestion = async () => {
        if (!currentQuestion || !submissionId) return;

        // Submit current answer
        if (answers[currentQuestion.id]) {
            await submitQuizAnswer(
                parseInt(params.id as string),
                submissionId,
                currentQuestion.id,
                answers[currentQuestion.id]
            );
        }

        if (currentQuestionIndex < (quiz.questions?.length || 0) - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Last question, complete the quiz
            await handleSubmitQuiz();
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmitQuiz = async () => {
        if (!submissionId) return;

        setIsSubmitting(true);
        try {
            await completeQuiz(parseInt(params.id as string), submissionId);
            const submission = await getQuizSubmission(parseInt(params.id as string), submissionId);
            setFinalScore(submission.score);
            setQuizCompleted(true);
        } catch (error) {
            console.error("Error submitting quiz:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTimeUp = async () => {
        await handleSubmitQuiz();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <h2 className="text-2xl font-black">Quiz Not Found</h2>
                <Link href="/exercises" className="text-primary hover:underline font-bold uppercase tracking-widest text-xs">Back to Syllabus</Link>
            </div>
        );
    }

    if (!quizStarted) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <Card className="shadow-xl border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Target className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-black">Ready for the Challenge?</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                            <div className="bg-card p-4 rounded-xl border">
                                <div className="text-2xl font-black text-primary">{quiz.questions?.length || 0}</div>
                                <div className="text-xs uppercase tracking-widest text-muted-foreground">Questions</div>
                            </div>
                            {quiz.time_limit_minutes && (
                                <div className="bg-card p-4 rounded-xl border">
                                    <div className="text-2xl font-black text-primary">{quiz.time_limit_minutes} min</div>
                                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Time Limit</div>
                                </div>
                            )}
                        </div>

                        <p className="text-muted-foreground max-w-md mx-auto">
                            {quiz.description}
                        </p>

                        <div className="pt-4">
                            <Button
                                onClick={startQuizHandler}
                                className="w-full max-w-xs mx-auto"
                                size="lg"
                            >
                                Start Quiz
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (quizCompleted && finalScore !== null) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <Card className="shadow-xl border-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                            {finalScore >= (quiz.passing_score || 70) ? (
                                <Trophy className="h-8 w-8 text-emerald-600" />
                            ) : (
                                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                            )}
                        </div>
                        <CardTitle className="text-3xl font-black">
                            {finalScore >= (quiz.passing_score || 70) ? "Quiz Completed Successfully!" : "Quiz Completed"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                        <div className="bg-card p-6 rounded-xl border">
                            <div className="text-4xl font-black text-primary mb-2">{finalScore}%</div>
                            <div className="text-muted-foreground">
                                {finalScore >= (quiz.passing_score || 70) ? "Passed" : "Completed"}
                            </div>

                            {finalScore >= (quiz.passing_score || 70) ? (
                                <div className="mt-4 text-emerald-600 font-bold">Congratulations! You passed the quiz.</div>
                            ) : (
                                <div className="mt-4 text-amber-600 font-bold">You need {quiz.passing_score || 70}% to pass. Keep practicing!</div>
                            )}
                        </div>

                        <div className="pt-4 space-x-4">
                            <Button
                                onClick={() => router.push('/exercises')}
                                variant="outline"
                                size="lg"
                            >
                                Back to Exercises
                            </Button>
                            <Button
                                onClick={() => window.location.reload()}
                                size="lg"
                            >
                                Take Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Quiz Header */}
            <div className="flex items-center justify-between mb-8">
                <Link
                    href="/exercises"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border bg-card transition-all hover:bg-muted hover:scale-105"
                >
                    <ChevronLeft size={20} />
                </Link>

                <div className="text-center">
                    <h1 className="text-2xl font-black">{quiz.title}</h1>
                    <p className="text-sm text-muted-foreground">{quiz.description}</p>
                </div>

                <div className="flex items-center gap-4">
                    {quiz.time_limit_minutes && (
                        <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className={`font-black ${timeRemaining < 60 ? 'text-red-600' : 'text-foreground'}`}>
                                {formatTime(timeRemaining)}
                            </span>
                        </div>
                    )}
                    <div className="text-sm font-black text-muted-foreground">
                        {currentQuestionIndex + 1} / {quiz.questions?.length || 0}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <Progress
                    value={((currentQuestionIndex + 1) / (quiz.questions?.length || 1)) * 100}
                    className="h-2"
                />
            </div>

            {/* Question Card */}
            <Card className="mb-8 shadow-lg">
                <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-black">
                            {currentQuestionIndex + 1}
                        </div>
                        <div>
                            <h2 className="text-xl font-black mb-4">{currentQuestion?.question_text}</h2>

                            {currentQuestion?.question_type === 'multiple_choice' && (
                                <RadioGroup
                                    value={answers[currentQuestion.id] || ""}
                                    onValueChange={handleAnswerChange}
                                >
                                    {currentQuestion.options?.map((option: string, idx: number) => (
                                        <div key={idx} className="flex items-center space-x-2 mb-3">
                                            <RadioGroupItem value={option} id={`option-${idx}`} />
                                            <Label htmlFor={`option-${idx}`} className="font-normal cursor-pointer flex-1">
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            )}

                            {currentQuestion?.question_type === 'true_false' && (
                                <RadioGroup
                                    value={answers[currentQuestion.id] || ""}
                                    onValueChange={handleAnswerChange}
                                >
                                    {currentQuestion.options?.map((option: string, idx: number) => (
                                        <div key={idx} className="flex items-center space-x-2 mb-3">
                                            <RadioGroupItem value={option} id={`tf-option-${idx}`} />
                                            <Label htmlFor={`tf-option-${idx}`} className="font-normal cursor-pointer flex-1">
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            )}

                            {(currentQuestion?.question_type === 'short_answer' ||
                              currentQuestion?.question_type === 'code') && (
                                <Textarea
                                    value={answers[currentQuestion.id] || ""}
                                    onChange={(e) => handleAnswerChange(e.target.value)}
                                    placeholder="Type your answer here..."
                                    className="min-h-[120px]"
                                />
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    onClick={handlePreviousQuestion}
                    variant="outline"
                    disabled={currentQuestionIndex === 0}
                >
                    Previous
                </Button>

                <Button
                    onClick={handleNextQuestion}
                    disabled={!answers[currentQuestion.id]}
                    className="ml-auto"
                >
                    {currentQuestionIndex === (quiz.questions?.length || 0) - 1 ? 'Submit Quiz' : 'Next Question'}
                </Button>
            </div>
        </div>
    );
}