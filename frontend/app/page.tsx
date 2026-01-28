"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  CheckCircle,
  Trophy,
  Clock,
  ArrowRight,
  TrendingUp,
  Code2,
  GraduationCap,
  MessageSquare,
  Star,
  Flame
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { fetchStats, fetchTopics, fetchLevels, fetchExercises, fetchQuizzes } from "@/lib/api";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [recentExercises, setRecentExercises] = useState<any[]>([]);
  const [availableQuizzes, setAvailableQuizzes] = useState<any[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [streak, setStreak] = useState(5); // Example streak

  useEffect(() => {
    async function loadData() {
      if (!isAuthenticated || !user || authLoading) return;

      try {
        const [statsData, topicsData, levelsData, exercisesData, quizzesData] = await Promise.all([
          fetchStats(user.id).catch(() => null), // Use actual user ID
          fetchTopics().catch(() => []),
          fetchLevels().catch(() => []),
          fetchExercises().catch(() => []),
          fetchQuizzes().catch(() => [])
        ]);

        if (statsData) setStats(statsData);
        if (topicsData) setTopics(topicsData);
        if (levelsData) setLevels(levelsData);
        if (exercisesData) setRecentExercises(exercisesData.slice(0, 3));
        if (quizzesData) setAvailableQuizzes(quizzesData.slice(0, 2));
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setDashboardLoading(false);
      }
    }
    loadData();
  }, [isAuthenticated, user, authLoading]);

  const statCards = [
    { name: "Total XP Earned", value: stats?.total_xp || "0", icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
    { name: "Current Streak", value: `${streak} days`, icon: Flame, color: "text-orange-600", bg: "bg-orange-50" },
    { name: "Exercises Completed", value: `${stats?.completed_exercises || "0"}/${stats?.total_exercises || "0"}`, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "Quizzes Passed", value: `${stats?.passed_quizzes || "0"}/${stats?.total_quizzes || "0"}`, icon: Trophy, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  if (authLoading || dashboardLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-3xl font-black tracking-tight text-foreground/90">Python Mastery Dashboard 🐍</h1>
        <p className="text-muted-foreground font-medium text-center max-w-md">
          Please log in to view your personalized learning dashboard and track your progress.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-xl transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
        >
          Log In to Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground/90">Python Mastery Dashboard 🐍</h1>
          <p className="mt-2 text-muted-foreground font-medium">
            Welcome back, {user?.name}! You're currently mastering Python Data Structures.
          </p>
        </div>
        <Link
          href="/exercises"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-xl transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
        >
          Continue Learning
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
            <div className="flex items-center justify-between">
              <div className={cn("rounded-xl p-3 shadow-sm", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn("h-full rounded-full bg-emerald-500")}
                  style={{
                    width: stat.name.includes("Exercises") && stats?.total_exercises ? `${(stats.completed_exercises / stats.total_exercises) * 100}%` :
                          stat.name.includes("Quizzes") && stats?.total_quizzes ? `${(stats.passed_quizzes / stats.total_quizzes) * 100}%` : '65%'
                  }}
                />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.name}</p>
              <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
            </div>
            <TrendingUp className="absolute bottom-6 right-6 h-5 w-5 text-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight">Personalized Path: Python Elite</h2>
            <button className="text-xs font-bold text-primary hover:underline uppercase tracking-tighter">View Roadmap</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-1">
            {topics.map((topic) => {
              const level = levels.find(l => l.id === topic.level_id);
              return (
                <div key={topic.id} className="group flex items-center justify-between gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:translate-x-1">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Code2 className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">{topic.name}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-medium">
                        <span className="rounded-full bg-muted px-2 py-0.5">{level?.name || "Topic"}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 45m</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-black text-foreground">+150</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Points</p>
                    </div>
                    <Link
                      href={`/exercises?topic_id=${topic.id}`}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted transition-colors hover:bg-primary hover:text-white"
                    >
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Exercises */}
          <div className="mt-8">
            <h2 className="text-xl font-black tracking-tight mb-4">Continue Learning</h2>
            <div className="space-y-3">
              {recentExercises.map((exercise) => (
                <Link key={exercise.id} href={`/exercises/${exercise.id}`} className="block">
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors">
                    <div>
                      <div className="font-medium">{exercise.title}</div>
                      <div className="text-sm text-muted-foreground">{exercise.topic}</div>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-muted">
                      {exercise.difficulty_level}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {/* Weekly Progress */}
          <div className="rounded-3xl border bg-card shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black tracking-tight">Weekly Progress</h2>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black text-emerald-700 uppercase tracking-widest">On Track</span>
            </div>
            <div className="flex items-center justify-center py-6">
              <div className="relative flex h-32 w-32 items-center justify-center">
                <svg className="h-full w-full rotate-[-90deg]">
                  <circle className="text-muted/20" stroke="currentColor" strokeWidth="10" fill="transparent" r="55" cx="65" cy="65" />
                  <circle
                    className="text-primary transition-all duration-1000 ease-in-out"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={345}
                    strokeDashoffset={345 - (345 * 0.75)}
                    strokeLinecap="round"
                    fill="transparent"
                    r="55"
                    cx="65"
                    cy="65"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black">75%</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Goal Met</span>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground font-medium px-4">
              Great job! You've completed <span className="text-foreground font-bold">12</span> Python exercises this week.
            </p>
          </div>

          {/* Upcoming Challenges */}
          <div className="rounded-3xl border bg-card shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black tracking-tight">Upcoming Challenges</h2>
            </div>
            <div className="space-y-3">
              {availableQuizzes.map((quiz) => (
                <Link key={quiz.id} href={`/quizzes/${quiz.id}`} className="block">
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors">
                    <div>
                      <div className="font-medium">{quiz.title}</div>
                      <div className="text-sm text-muted-foreground">{quiz.description}</div>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-muted">
                      {quiz.questions?.length || 0} Qs
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/quizzes" className="mt-4 inline-block w-full">
              <button className="w-full rounded-xl bg-muted py-2 text-xs font-black uppercase tracking-widest transition-all hover:bg-muted/80">
                View All Quizzes
              </button>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="rounded-3xl border bg-card shadow-sm p-6">
            <h2 className="text-xl font-black tracking-tight mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/exercises" className="block">
                <button className="w-full rounded-xl border bg-muted py-2 text-xs font-black uppercase tracking-widest transition-all hover:bg-muted/80">
                  <div className="flex flex-col items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    Exercises
                  </div>
                </button>
              </Link>
              <Link href="/quizzes" className="block">
                <button className="w-full rounded-xl border bg-muted py-2 text-xs font-black uppercase tracking-widest transition-all hover:bg-muted/80">
                  <div className="flex flex-col items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    Quizzes
                  </div>
                </button>
              </Link>
              <Link href="/chat" className="block col-span-2">
                <button className="w-full rounded-xl bg-primary py-2 text-xs font-black uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90">
                  <div className="flex items-center justify-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    AI Assistant
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
