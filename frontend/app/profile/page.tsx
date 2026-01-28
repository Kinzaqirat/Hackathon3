"use client";

import {
    User,
    Mail,
    GraduationCap,
    Shield,
    Bell,
    Camera,
    MapPin,
    Calendar,
    Save
} from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Student Profile</h1>
                <p className="text-muted-foreground">Manage your personal information and learning preferences.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Profile Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="rounded-2xl border bg-card p-6 shadow-sm text-center">
                        <div className="relative mx-auto h-32 w-32 mb-4 group">
                            <div className="h-full w-full rounded-full border-4 border-primary/20 overflow-hidden bg-muted">
                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                    <User size={64} />
                                </div>
                            </div>
                            <button className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95">
                                <Camera size={18} />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold">Student User</h2>
                        <p className="text-sm text-muted-foreground mt-1 text-primary font-medium">Pre-Engineering Student</p>
                        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <MapPin size={14} />
                            <span>San Francisco, CA</span>
                        </div>
                        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <Calendar size={14} />
                            <span>Joined Jan 2026</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-card p-6 shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Learning Stats</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Global Rank</span>
                                <span className="text-sm font-bold text-primary">#1,240</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Skill Score</span>
                                <span className="text-sm font-bold text-primary">8,420</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Certificates</span>
                                <span className="text-sm font-bold text-primary">4</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="md:col-span-2 space-y-6">
                    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
                        <div className="border-b px-6 py-4 bg-muted/30">
                            <h3 className="font-bold flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                Account Settings
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            defaultValue="Student User"
                                            className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            defaultValue="student@example.com"
                                            className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Bio / About You</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us about your learning goals..."
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Current Grade</label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <select defaultValue="Grade 12" className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                                            <option>Grade 10</option>
                                            <option>Grade 11</option>
                                            <option>Grade 12</option>
                                            <option>Undergraduate</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Study Interests</label>
                                    <input
                                        defaultValue="Physics, Computer Science"
                                        className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between border-t">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Bell className="h-4 w-4" />
                                    Email notifications are enabled
                                </div>
                                <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90">
                                    <Save size={16} />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
