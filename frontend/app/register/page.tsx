"use client";

import {
    Lock,
    Mail,
    ArrowRight,
    User,
    GraduationCap,
    ChevronLeft,
    CheckCircle2,
    Users,
    Building2,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('return') || '';

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gradeLevel, setGradeLevel] = useState("Grade 12"); // For students
    const [department, setDepartment] = useState(""); // For teachers
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [role, setRole] = useState<'student' | 'teacher'>('student'); // Default to student
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Prepare user data based on role
            const userData = role === 'student'
                ? { email, name, password, grade_level: gradeLevel }
                : { email, name, password, department };

            const success = await register(userData, role);

            if (success) {
                // If there's a return URL, redirect to it; otherwise, redirect based on role
                if (returnUrl && returnUrl !== '/') {
                    router.push(returnUrl);
                } else {
                    router.push(role === 'teacher' ? "/teacher-dashboard" : "/");
                }
                router.refresh(); // Refresh to update the UI
            } else {
                setError("Registration failed. Please try again.");
            }
        } catch (err) {
            setError("An error occurred during registration. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-[480px] px-6">
                <div className="mb-8 text-center flex flex-col items-center">
                    <Link href="/" className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-4">
                        <GraduationCap size={28} />
                    </Link>
                    <h1 className="text-3xl font-black tracking-tighter">Join LearnFlow</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Start your personalized learning journey today.</p>
                </div>

                {/* Role selection */}
                <div className="flex mb-6 bg-muted rounded-xl p-1">
                    <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
                            role === 'student'
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <User size={16} />
                        Student
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('teacher')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
                            role === 'teacher'
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Users size={16} />
                        Teacher
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <div className="rounded-3xl border bg-card p-8 shadow-2xl space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="flex h-12 w-full rounded-xl border border-input bg-muted/30 px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex h-12 w-full rounded-xl border border-input bg-muted/30 px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        {/* Conditional fields based on role */}
                        {role === 'student' ? (
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Grade Level</label>
                                <select 
                                    value={gradeLevel}
                                    onChange={(e) => setGradeLevel(e.target.value)}
                                    className="flex h-12 w-full rounded-xl border border-input bg-muted/30 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-medium"
                                >
                                    <option>Grade 10</option>
                                    <option>Grade 11</option>
                                    <option selected>Grade 12</option>
                                    <option>University</option>
                                </select>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Department</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Mathematics, Science, etc."
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        className="flex h-12 w-full rounded-xl border border-input bg-muted/30 px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Create Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex h-12 w-full rounded-xl border border-input bg-muted/30 px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3 py-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                                Over 1,000+ interactive exercises
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                                Personalized AI learning assistant
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-xl transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create {role === 'student' ? 'Student' : 'Teacher'} Account
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-bold text-primary hover:underline">
                            Log in instead
                        </Link>
                    </p>
                </div>

                <Link href="/" className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
                    <ChevronLeft size={14} />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}