"use client";

import { useState, useEffect } from "react";
import {
    BarChart3,
    TrendingUp,
    Target,
    Zap,
    Layers,
    Award,
    ArrowUpRight,
    ShieldCheck,
    BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchStats, fetchProgress } from "@/lib/api";

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [progress, setProgress] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [statsData, progressData] = await Promise.all([
                    fetchStats(1),
                    fetchProgress(1)
                ]);
                setStats(statsData);
                setProgress(progressData);
            } catch (error) {
                console.error("Error loading analytics data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const performanceMetrics = [
        {
            name: "Mastery Level",
            value: stats?.completed_exercises > 10 ? "Advanced" : "Beginner",
            icon: ShieldCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            name: "Success Rate",
            value: `${Math.round(stats?.average_score || 0)}%`,
            icon: BrainCircuit,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            name: "Python XP",
            value: stats?.completed_exercises * 150 || 0,
            icon: Zap,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            name: "Exercises",
            value: stats?.completed_exercises || 0,
            icon: Target,
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground/90">Performance Analytics 📊</h1>
                    <p className="text-muted-foreground font-medium mt-1">Real-time insights from your Python learning journey.</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl border bg-card p-1 shadow-sm">
                    <button className="rounded-lg bg-primary px-5 py-2 text-xs font-black text-primary-foreground shadow-sm uppercase tracking-widest">Global Live</button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {performanceMetrics.map((metric) => (
                    <div key={metric.name} className="group rounded-3xl border bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:border-primary/20">
                        <div className="flex items-center justify-between">
                            <div className={cn("rounded-2xl p-3 shadow-md", metric.bg)}>
                                <metric.icon className={cn("h-6 w-6", metric.color)} />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                +12% Trend
                                <ArrowUpRight className="h-3 w-3" />
                            </div>
                        </div>
                        <div className="mt-6">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{metric.name}</p>
                            <h3 className="text-2xl font-black mt-1">{isLoading ? "..." : metric.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-12 rounded-3xl border bg-card shadow-sm overflow-hidden">
                    <div className="border-b p-8 flex items-center justify-between bg-muted/30">
                        <h2 className="text-xl font-black flex items-center gap-3 tracking-tight">
                            <Layers className="h-6 w-6 text-primary" />
                            Live Syllabus Progress
                        </h2>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Syncing with Backend...</div>
                    </div>
                    <div className="p-8 space-y-10">
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted rounded-xl animate-pulse" />)}
                            </div>
                        ) : progress.length > 0 ? (
                            progress.map((item: any) => (
                                <div key={item.id} className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-lg font-black text-foreground/90 leading-none">Exercise #{item.exercise_id}</h4>
                                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-2">Status: {item.status} • Attempts: {item.attempts}</p>
                                        </div>
                                        <span className="text-xl font-black text-primary">{item.best_score}%</span>
                                    </div>
                                    <div className="relative h-4 w-full rounded-full bg-muted overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-in-out"
                                            style={{ width: `${item.best_score}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground italic font-medium">
                                No progress found yet. Start an exercise to see your live stats!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
