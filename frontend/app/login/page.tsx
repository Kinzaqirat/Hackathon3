"use client";

import {
    Lock,
    Mail,
    ArrowRight,
    Github,
    Chrome,
    GraduationCap,
    ChevronLeft,
    User,
    Users,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react"; // Added Suspense here
import { useAuth } from "@/lib/auth-context";

// Renamed the main logic to LoginContent
function LoginContent() {
    const searchParams = useSearchParams();
    // Changed 'return' to 'callbackUrl' as per the snippet, and removed the old returnUrl
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // Kept loading state as it's used
    const [error, setError] = useState("");
    const [role, setRole] = useState<'student' | 'teacher'>('student'); // Default to student
    const { login } = useAuth(); // Kept original destructuring for login
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const success = await login(email, password, role);
            if (success) {
                // Wait for the cookie to be set before redirecting
                await new Promise(resolve => setTimeout(resolve, 300));

                // If there's a callback URL, redirect to it; otherwise, redirect based on role
                if (callbackUrl && callbackUrl !== '/') {
                    router.push(callbackUrl);
                } else {
                    router.push(role === 'teacher' ? "/teacher-dashboard" : "/");
                }
            } else {
                setError("Invalid email or password. Please try again.");
            }
        } catch (err) {
            setError("An error occurred during login. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-[440px] px-6">
                <div className="mb-8 text-center flex flex-col items-center">
                    <Link href="/" className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-4">
                        <GraduationCap size={28} />
                    </Link>
                    <h1 className="text-3xl font-black tracking-tighter">Welcome Back</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Log in to your LearnFlow account to continue learning.</p>
                </div>

                {/* Role selection */}
                <div className="flex mb-6 bg-muted rounded-xl p-1">
                    <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all ${role === 'student'
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
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all ${role === 'teacher'
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
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</label>
                                <button type="button" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Forgot?</button>
                            </div>
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-xl transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground font-bold tracking-widest">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            className="flex h-12 items-center justify-center gap-2 rounded-xl border bg-muted/10 px-4 text-sm font-bold transition-all hover:bg-muted/30"
                            onClick={() => alert("Google login not implemented yet")}
                        >
                            <Chrome size={18} />
                            Google
                        </button>
                        <button
                            type="button"
                            className="flex h-12 items-center justify-center gap-2 rounded-xl border bg-muted/10 px-4 text-sm font-bold transition-all hover:bg-muted/30"
                            onClick={() => alert("GitHub login not implemented yet")}
                        >
                            <Github size={18} />
                            GitHub
                        </button>
                    </div>

                    <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/register" className="font-bold text-primary hover:underline">
                            Sign up free
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

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}