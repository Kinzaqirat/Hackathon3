"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    Clock,
    Target,
    ChevronRight,
    Code2,
    Lock,
    Zap,
    Sparkles
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { fetchExercises, fetchLevels } from "@/lib/api";
import { useAuthRedirect } from "@/lib/use-auth-redirect";

import { Suspense } from "react";

function ExercisesContent() {
    const searchParams = useSearchParams();
    const topicId = searchParams.get("topic_id");

    const [exercises, setExercises] = useState<any[]>([]);
    const [levels, setLevels] = useState<any[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [selectedLevel, setSelectedLevel] = useState("All");

    // Combine auth loading and page loading states
    const isLoading = pageLoading;

    useEffect(() => {
        async function loadData() {
            try {
                const [exercisesData, levelsData] = await Promise.all([
                    fetchExercises().catch(() => []), // Return empty array if API fails
                    fetchLevels().catch(() => [])     // Return empty array if API fails
                ]);

                // Check if we received valid data
                let validExercises = exercisesData;
                if (!Array.isArray(exercisesData) || exercisesData.length === 0) {
                    // Provide mock data when API is not available by calling the same API function
                    // This ensures consistency with the exercise detail page
                    // Since we can't await here, we'll use the same mock data structure as in the API
                    validExercises = [
                        {
                            id: 1,
                            title: "Hello, World!",
                            description: "Write a Python program that prints 'Hello, World!' to the console. This is your first Python program and introduces you to basic syntax.",
                            difficulty_level: "beginner",
                            topic: "Introduction to Python",
                            starter_code: "# Write your first Python program\n# Print a greeting message\nprint('Hello, World!')",
                            expected_output: "Hello, World!",
                            hints: [
                                "Use the print() function to display output",
                                "Remember to use quotes for string literals",
                                "Python uses indentation for code blocks"
                            ]
                        },
                        {
                            id: 2,
                            title: "Variables and Data Types",
                            description: "Create variables for name, age, and city, then print them. Learn about different data types in Python.",
                            difficulty_level: "beginner",
                            topic: "Variables and Data Types",
                            starter_code: "# Create variables\nname = 'John'\nage = 25\ncity = 'New York'\n\n# Print variables\nprint(f'Name: {name}, Age: {age}, City: {city}')",
                            expected_output: "Name: John, Age: 25, City: New York",
                            hints: [
                                "Use meaningful variable names",
                                "F-strings allow embedding variables in strings",
                                "Different data types: str, int, float, bool"
                            ]
                        },
                        {
                            id: 3,
                            title: "Simple Calculator",
                            description: "Create a calculator that adds two numbers. Learn about user input and basic arithmetic operations.",
                            difficulty_level: "beginner",
                            topic: "Operators and Expressions",
                            starter_code: "# Read two numbers\nnum1 = float(input('Enter first number: '))\nnum2 = float(input('Enter second number: '))\n\n# Add them\nresult = num1 + num2\nprint(f'Sum: {result}')",
                            expected_output: "Sum: 15.0",
                            hints: [
                                "Use input() to get user input",
                                "Convert string input to number with int() or float()",
                                "Use the + operator for addition"
                            ]
                        }
                    ];
                }

                let validLevels = levelsData;
                if (!Array.isArray(levelsData) || levelsData.length === 0) {
                    // Provide mock levels when API is not available
                    validLevels = [
                        { id: 'all', name: 'All' },
                        { id: 1, name: 'Beginner' },
                        { id: 2, name: 'Intermediate' },
                        { id: 3, name: 'Advanced' },
                        { id: 4, name: 'Expert' }
                    ];
                }

                let filtered = validExercises;
                if (topicId) {
                    filtered = validExercises.filter((ex: any) => ex.topic_id === parseInt(topicId));
                }

                setExercises(filtered);
                setLevels(validLevels);
            } catch (error) {
                console.error("Error loading exercises data:", error);

                // Set mock data as fallback
                setExercises([
                    {
                        id: 1,
                        title: "Hello, World!",
                        description: "Write a Python program that prints 'Hello, World!' to the console. This is your first Python program and introduces you to basic syntax.",
                        difficulty_level: "beginner",
                        topic: "Introduction to Python",
                        starter_code: "# Write your first Python program\n# Print a greeting message\nprint('Hello, World!')",
                        expected_output: "Hello, World!",
                        hints: [
                            "Use the print() function to display output",
                            "Remember to use quotes for string literals",
                            "Python uses indentation for code blocks"
                        ]
                    },
                    {
                        id: 2,
                        title: "Variables and Data Types",
                        description: "Create variables for name, age, and city, then print them. Learn about different data types in Python.",
                        difficulty_level: "beginner",
                        topic: "Variables and Data Types",
                        starter_code: "# Create variables\nname = 'John'\nage = 25\ncity = 'New York'\n\n# Print variables\nprint(f'Name: {name}, Age: {age}, City: {city}')",
                        expected_output: "Name: John, Age: 25, City: New York",
                        hints: [
                            "Use meaningful variable names",
                            "F-strings allow embedding variables in strings",
                            "Different data types: str, int, float, bool"
                        ]
                    },
                    {
                        id: 3,
                        title: "Simple Calculator",
                        description: "Create a calculator that adds two numbers. Learn about user input and basic arithmetic operations.",
                        difficulty_level: "beginner",
                        topic: "Operators and Expressions",
                        starter_code: "# Read two numbers\nnum1 = float(input('Enter first number: '))\nnum2 = float(input('Enter second number: '))\n\n# Add them\nresult = num1 + num2\nprint(f'Sum: {result}')",
                        expected_output: "Sum: 15.0",
                        hints: [
                            "Use input() to get user input",
                            "Convert string input to number with int() or float()",
                            "Use the + operator for addition"
                        ]
                    }
                ]);
                setLevels([
                    { id: 'all', name: 'All' },
                    { id: 1, name: 'Beginner' },
                    { id: 2, name: 'Intermediate' },
                    { id: 3, name: 'Advanced' },
                    { id: 4, name: 'Expert' }
                ]);
            } finally {
                setPageLoading(false);
            }
        }
        loadData();
    }, [topicId]);

    const filteredExercises = exercises.filter(ex =>
        selectedLevel === "All" || ex.difficulty_level?.toLowerCase() === selectedLevel?.toLowerCase() ||
        (levels.find(l => l.name === selectedLevel)?.id === ex.level_id)
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground/90 flex items-center gap-3">
                        Python Syllabus 🎓
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase tracking-widest">Live Updates</span>
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">
                        {topicId ? `Category: ${exercises[0]?.topic || 'Filtered Topics'}` : 'Master Python from basic syntax to professional architecture.'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search Python topics..."
                            className="h-12 w-64 rounded-xl border border-input bg-card pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                        />
                    </div>
                    <button className="flex h-12 w-12 items-center justify-center rounded-xl border bg-card transition-colors hover:bg-muted shadow-sm">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                    <button
                        key={level.id}
                        onClick={() => setSelectedLevel(level.name)}
                        className={cn(
                            "rounded-xl px-6 py-2 text-xs font-black uppercase tracking-widest transition-all shadow-sm",
                            selectedLevel === level.name
                                ? "bg-primary text-primary-foreground scale-105 shadow-primary/25"
                                : "bg-card border text-muted-foreground hover:bg-muted"
                        )}
                    >
                        {level.name}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 rounded-2xl border bg-muted/50 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredExercises.map((exercise) => {
                        const level = levels.find(l => l.id === exercise.level_id);
                        const levelName = level?.name || exercise.difficulty_level || "General";

                        return (
                            <div
                                key={exercise.id}
                                className="group relative flex flex-col rounded-3xl border bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary/50"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className={cn(
                                        "flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                                        levelName.toLowerCase() === "beginner" ? "bg-emerald-100 text-emerald-700" :
                                            levelName.toLowerCase() === "intermediate" ? "bg-blue-100 text-blue-700" :
                                                "bg-purple-100 text-purple-700"
                                    )}>
                                        <Zap size={10} className="fill-current" />
                                        {levelName}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/50 px-2 py-1 rounded-lg">
                                        <Target className="h-3 w-3" />
                                        250 XP
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-foreground/90 group-hover:text-primary transition-colors">{exercise.title}</h3>
                                <p className="mt-3 text-sm text-muted-foreground font-medium leading-relaxed line-clamp-3">
                                    {exercise.description}
                                </p>

                                <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-5">
                                    <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        <span className="flex items-center gap-1.5 text-primary">
                                            <Code2 className="h-3.5 w-3.5" />
                                            Python
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            20m
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/exercises/${exercise.id}`}
                                            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:scale-110 active:scale-95"
                                        >
                                            <ChevronRight size={22} />
                                        </Link>
                                        <Link
                                            href="/ai-demo"
                                            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-110 active:scale-95"
                                        >
                                            <Sparkles size={22} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function ExercisesPage() {
    useAuthRedirect('any', '/login');
    return (
        <Suspense fallback={<div>Loading exercises...</div>}>
            <ExercisesContent />
        </Suspense>
    );
}
