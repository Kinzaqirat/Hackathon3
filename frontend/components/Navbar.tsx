"use client";

import { Bell, Search, User as UserIcon, LogOut, Users, GraduationCap } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function Navbar() {
    const { user, logout, isAuthenticated, isTeacher, isStudent } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="flex h-16 items-center justify-between border-b bg-card px-8 text-card-foreground shadow-sm">
            <div className="flex w-full max-w-md items-center gap-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search exercises, topics..."
                        className="h-10 w-full rounded-full border border-input bg-muted/50 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted">
                    <Bell size={20} className="text-muted-foreground" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
                </button>

                <div className="h-8 w-[1px] bg-border mx-2" />

                {isAuthenticated && user ? (
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-semibold">{user.name}</span>
                            <span className="text-[10px] text-muted-foreground">
                                {isTeacher ? "Teacher" : user.grade_level || "Student"}
                            </span>
                        </div>
                        <div className="relative group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted border border-border cursor-pointer">
                                <UserIcon size={20} className="text-muted-foreground" />
                            </div>

                            {/* Dropdown menu */}
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                {isTeacher && (
                                    <Link href="/teacher-dashboard" className="block">
                                        <button className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors">
                                            <Users size={16} className="mr-2" />
                                            Teacher Dashboard
                                        </button>
                                    </Link>
                                )}
                                {isStudent && (
                                    <Link href="/profile" className="block">
                                        <button className="flex items-center w-full px-4 py-2 text-sm text-primary hover:bg-muted transition-colors">
                                            <GraduationCap size={16} className="mr-2" />
                                            My Profile
                                        </button>
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} className="mr-2" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-semibold">Guest User</span>
                            <span className="text-[10px] text-muted-foreground">Not logged in</span>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted border border-border">
                            <UserIcon size={20} className="text-muted-foreground" />
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
