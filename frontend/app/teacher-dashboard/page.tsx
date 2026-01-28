"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  GraduationCap,
  Trophy,
  BarChart3,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  TrendingUp,
  User as UserIcon
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

import { fetchStudents, fetchTeacherQuizzes } from "@/lib/api";

export default function TeacherDashboard() {
  const { user, isAuthenticated, isTeacher, isLoading: authLoading } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Redirect if not authenticated or not a teacher
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isTeacher)) {
      router.push('/login');
    }
  }, [isAuthenticated, isTeacher, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated || !isTeacher || authLoading) return;

    const fetchData = async () => {
      try {
        const [studentsData, quizzesData] = await Promise.all([
          fetchStudents(),
          fetchTeacherQuizzes()
        ]);

        setStudents(studentsData);
        setQuizzes(quizzesData);
      } catch (error) {
        console.error("Error fetching teacher dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, isTeacher, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isTeacher) {
    return null; // Redirect happens in useEffect
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground/90">Teacher Dashboard 🧑‍🏫</h1>
          <p className="mt-2 text-muted-foreground font-medium">
            Welcome back, {user?.name}. Monitor your students' progress and assignments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold">{user?.name}</span>
              <span className="text-[10px] text-muted-foreground">Teacher</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted border border-border">
              <UserIcon size={20} className="text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <div className="flex items-center justify-between">
            <div className="rounded-xl p-3 shadow-sm bg-blue-50">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Students</p>
            <h3 className="text-2xl font-black">{Array.isArray(students) ? students.length : 0}</h3>
          </div>
          <TrendingUp className="absolute bottom-6 right-6 h-5 w-5 text-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        <div className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <div className="flex items-center justify-between">
            <div className="rounded-xl p-3 shadow-sm bg-emerald-50">
              <BookOpen className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Exercises Completed</p>
            <h3 className="text-2xl font-black">{Array.isArray(students) ? students.reduce((sum, student) => sum + (student.exercises_completed || 0), 0) : 0}</h3>
          </div>
          <TrendingUp className="absolute bottom-6 right-6 h-5 w-5 text-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        <div className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <div className="flex items-center justify-between">
            <div className="rounded-xl p-3 shadow-sm bg-amber-50">
              <GraduationCap className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quizzes Graded</p>
            <h3 className="text-2xl font-black">{quizzes.reduce((sum, quiz) => sum + (quiz.completed_count || 0), 0)}</h3>
          </div>
          <TrendingUp className="absolute bottom-6 right-6 h-5 w-5 text-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        <div className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <div className="flex items-center justify-between">
            <div className="rounded-xl p-3 shadow-sm bg-violet-50">
              <Trophy className="h-6 w-6 text-violet-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Avg. Score</p>
            <h3 className="text-2xl font-black">{Math.round(quizzes.reduce((sum, quiz) => sum + (quiz.avg_score || 0), 0) / quizzes.length || 0)}%</h3>
          </div>
          <TrendingUp className="absolute bottom-6 right-6 h-5 w-5 text-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl border bg-card shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black tracking-tight">Student Roster</h2>
              <button className="text-xs font-bold text-primary hover:underline uppercase tracking-tighter">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Student</th>
                    <th className="pb-3 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Grade</th>
                    <th className="pb-3 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Exercises</th>
                    <th className="pb-3 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Quizzes</th>
                    <th className="pb-3 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Last Active</th>
                    <th className="pb-3 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(students) ? students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-muted/50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted border border-border">
                            <UserIcon size={16} className="text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-muted">
                          {student.grade_level}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1">
                          <CheckCircle size={16} className="text-emerald-500" />
                          <span>{student.exercises_completed}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1">
                          <Trophy size={16} className="text-amber-500" />
                          <span>{student.quizzes_passed}</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">{student.last_active}</td>
                      <td className="py-4">
                        <Link href={`/profile/${student.id}`}>
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg border bg-muted transition-colors hover:bg-primary hover:text-white">
                            <Eye size={16} />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        Loading student data...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border bg-card shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black tracking-tight">Recent Submissions</h2>
              <button className="text-xs font-bold text-primary hover:underline uppercase tracking-tighter">View All</button>
            </div>
            <div className="space-y-4">
              {quizzes.slice(0, 4).map((quiz, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <GraduationCap size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{quiz.title}</div>
                      <div className="text-sm text-muted-foreground">by {students[index]?.name || 'Multiple Students'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-medium">
                        {quiz.avg_score}%
                      </div>
                      <div className="text-xs text-muted-foreground">avg score</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        {quiz.completed_count}/{quiz.student_count} completed
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        quiz.avg_score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                        quiz.avg_score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {quiz.avg_score >= 80 ? 'Excellent' : quiz.avg_score >= 60 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                    <Link href={`/quiz/${quiz.id}/review`}>
                      <button className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted transition-colors hover:bg-primary hover:text-white">
                        <Eye size={18} />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {/* Quick Stats */}
          <div className="rounded-3xl border bg-card shadow-sm p-6">
            <h2 className="text-xl font-black tracking-tight mb-4">Class Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm font-bold">{Math.round((quizzes.reduce((sum, quiz) => sum + (quiz.completed_count || 0), 0) / Math.max(1, quizzes.reduce((sum, quiz) => sum + (quiz.student_count || 0), 0))) * 100)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min(100, Math.round((quizzes.reduce((sum, quiz) => sum + (quiz.completed_count || 0), 0) / Math.max(1, quizzes.reduce((sum, quiz) => sum + (quiz.student_count || 0), 0))) * 100))}%` }}></div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm font-medium">Engagement</span>
                <span className="text-sm font-bold">{Math.round(quizzes.reduce((sum, quiz) => sum + (quiz.avg_score || 0), 0) / quizzes.length || 0)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min(100, Math.round(quizzes.reduce((sum, quiz) => sum + (quiz.avg_score || 0), 0) / quizzes.length || 0))}%` }}></div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm font-medium">Active Students</span>
                <span className="text-sm font-bold">{Array.isArray(students) ? students.filter(s => s.last_active.includes('hour') || s.last_active.includes('min')).length : 0}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${Math.min(100, Math.round(((Array.isArray(students) ? students.filter(s => s.last_active.includes('hour') || s.last_active.includes('min')).length : 0) / (Array.isArray(students) ? students.length : 1)) * 100))}%` }}></div>
              </div>
            </div>
          </div>

          {/* Upcoming Activities */}
          <div className="rounded-3xl border bg-card shadow-sm p-6">
            <h2 className="text-xl font-black tracking-tight mb-4">Upcoming Activities</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                  <Target size={18} />
                </div>
                <div>
                  <div className="font-medium">Midterm Exam</div>
                  <div className="text-sm text-muted-foreground">Feb 15, 2024 • 2 days left</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <BookOpen size={18} />
                </div>
                <div>
                  <div className="font-medium">Project Deadline</div>
                  <div className="text-sm text-muted-foreground">Feb 20, 2024 • 1 week left</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-violet-100 text-violet-700">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <div className="font-medium">Final Quiz</div>
                  <div className="text-sm text-muted-foreground">Feb 25, 2024 • 1 week left</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-3xl border bg-card shadow-sm p-6">
            <h2 className="text-xl font-black tracking-tight mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/create-quiz" className="block">
                <button className="w-full rounded-xl border bg-muted py-2 text-xs font-black uppercase tracking-widest transition-all hover:bg-muted/80">
                  <div className="flex flex-col items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    Create Quiz
                  </div>
                </button>
              </Link>
              <Link href="/create-exercise" className="block">
                <button className="w-full rounded-xl border bg-muted py-2 text-xs font-black uppercase tracking-widest transition-all hover:bg-muted/80">
                  <div className="flex flex-col items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    Add Exercise
                  </div>
                </button>
              </Link>
              <Link href="/analytics" className="block col-span-2">
                <button className="w-full rounded-xl bg-primary py-2 text-xs font-black uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90">
                  <div className="flex items-center justify-center gap-1">
                    <BarChart3 className="h-4 w-4" />
                    View Analytics
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