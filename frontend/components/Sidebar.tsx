"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
    LayoutDashboard,
    BookOpen,
    MessageSquare,
    User,
    BarChart3,
    Settings,
    GraduationCap,
    Users,
    Target
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
    const pathname = usePathname();
    const { isAuthenticated, isTeacher, isStudent } = useAuth();

    // Define protected routes that require authentication
    const protectedRoutes = ["/exercises", "/quizzes", "/chat", "/analytics", "/profile", "/settings"];
    const teacherRoutes = ["/teacher-dashboard", "/create-quiz", "/create-exercise"];

    // If user is not authenticated and tries to access a protected route, redirect to login
    if (!isAuthenticated && [...protectedRoutes, ...teacherRoutes].includes(pathname)) {
        // We can't redirect here since we're in a component, so we'll just render a message
        // The actual redirect will happen in a layout or page component
    }

    // Navigation based on user role
    const studentNavigation = [
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
        { name: "Exercises", href: "/exercises", icon: BookOpen },
        { name: "Quizzes", href: "/quizzes", icon: GraduationCap },
        { name: "AI Assistant", href: "/chat", icon: MessageSquare },
        { name: "Analytics", href: "/analytics", icon: BarChart3 },
        { name: "Profile", href: "/profile", icon: User },
    ];

    const teacherNavigation = [
        { name: "Dashboard", href: "/teacher-dashboard", icon: LayoutDashboard },
        { name: "Students", href: "/teacher-dashboard", icon: Users },
        { name: "Analytics", href: "/analytics", icon: BarChart3 },
        { name: "Create Quiz", href: "/create-quiz", icon: Target },
        { name: "Create Exercise", href: "/create-exercise", icon: BookOpen },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    const navigation = isTeacher ? teacherNavigation : studentNavigation;

    return (
        <div className="flex h-full w-64 flex-col border-r bg-card text-card-foreground">
            <div className="flex h-16 items-center px-6">
                <Link href={isTeacher ? "/teacher-dashboard" : "/"} className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <GraduationCap size={20} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">LearnFlow</span>
                </Link>
            </div>

            <nav className="flex-1 space-y-1 px-4 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;

                    // Check if the route is protected
                    const isProtectedRoute = [...protectedRoutes, ...teacherRoutes].includes(item.href);

                    return (
                        <Link
                            key={item.name}
                            href={isProtectedRoute && !isAuthenticated ? "/login" : item.href}
                            className={cn(
                                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive && isAuthenticated
                                    ? "bg-primary text-primary-foreground"
                                    : isProtectedRoute && !isAuthenticated
                                    ? "text-muted-foreground hover:bg-muted hover:text-foreground cursor-not-allowed opacity-50"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0",
                                    isActive && isAuthenticated
                                        ? "text-primary-foreground"
                                        : isProtectedRoute && !isAuthenticated
                                        ? "text-muted-foreground group-hover:text-foreground"
                                        : "text-muted-foreground group-hover:text-foreground"
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t p-4">
                <Link
                    href={isAuthenticated ? "/settings" : "/login"}
                    className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isAuthenticated
                            ? "text-muted-foreground hover:bg-muted hover:text-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground cursor-not-allowed opacity-50"
                    )}
                >
                    <Settings className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isAuthenticated
                            ? "text-muted-foreground group-hover:text-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    Settings
                </Link>
            </div>
        </div>
    );
}
