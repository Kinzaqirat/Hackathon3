"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreateExercisePage() {
  const router = useRouter();
  const { user, isTeacher, isLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [topic, setTopic] = useState("");
  const [starterCode, setStarterCode] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if not teacher
  if (!isLoading && (!isTeacher || !user)) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !topic.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-ID": localStorage.getItem("session_token") || "",
        },
        body: JSON.stringify({
          title,
          description,
          difficulty_level: difficulty,
          topic,
          starter_code: starterCode,
          expected_output: expectedOutput,
        }),
      });

      if (response.ok) {
        router.push("/teacher-dashboard");
      } else {
        alert("Failed to create exercise");
      }
    } catch (error) {
      console.error("Error creating exercise:", error);
      alert("Error creating exercise");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/teacher-dashboard" className="p-2 hover:bg-muted rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold">Create Exercise</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Exercise Details */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Exercise Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter exercise title"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter exercise description"
                rows={4}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Difficulty Level *
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Topic *</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Variables, Loops, Functions"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
          </div>

          {/* Code Section */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Starter Code (Optional)
              </label>
              <textarea
                value={starterCode}
                onChange={(e) => setStarterCode(e.target.value)}
                placeholder="# Write your code here"
                rows={6}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Expected Output (Optional)
              </label>
              <textarea
                value={expectedOutput}
                onChange={(e) => setExpectedOutput(e.target.value)}
                placeholder="Enter the expected output"
                rows={4}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 justify-end">
            <Link
              href="/teacher-dashboard"
              className="px-6 py-2 border border-border rounded-lg hover:bg-muted"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Exercise
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
