"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple_choice" | "true_false" | "short_answer";
  options?: string[];
  correct_answer: string | number | boolean | undefined;
  points: number;
}

export default function CreateQuizPage() {
  const router = useRouter();
  const { user, isTeacher, isLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  // Redirect if not teacher
  if (!isLoading && (!isTeacher || !user)) {
    router.push("/login");
    return null;
  }

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: "",
      type: "multiple_choice",
      options: ["", "", "", ""],
      correct_answer: 0,
      points: 10,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<QuizQuestion>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || questions.length === 0) {
      alert("Please fill in title and add at least one question");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-ID": localStorage.getItem("session_token") || "",
        },
        body: JSON.stringify({
          title,
          description,
          questions: questions.map((q) => ({
            question: q.question,
            type: q.type,
            options: q.options,
            correct_answer: q.correct_answer,
            points: q.points,
          })),
        }),
      });

      if (response.ok) {
        router.push("/teacher-dashboard");
      } else {
        alert("Failed to create quiz");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Error creating quiz");
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
          <h1 className="text-3xl font-bold">Create Quiz</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Details */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Quiz Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter quiz title"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter quiz description"
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Questions ({questions.length})</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>

            {questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-card border border-border rounded-lg p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Question {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => deleteQuestion(question.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Question Text
                  </label>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(question.id, { question: e.target.value })
                    }
                    placeholder="Enter question"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                      value={question.type}
                      onChange={(e) =>
                        updateQuestion(question.id, {
                          type: e.target.value as QuizQuestion["type"],
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="true_false">True/False</option>
                      <option value="short_answer">Short Answer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Points</label>
                    <input
                      type="number"
                      value={question.points}
                      onChange={(e) =>
                        updateQuestion(question.id, {
                          points: parseInt(e.target.value),
                        })
                      }
                      min="1"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {question.type === "multiple_choice" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Options</label>
                    {question.options?.map((option, optIndex) => (
                      <input
                        key={optIndex}
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(question.options || [])];
                          newOptions[optIndex] = e.target.value;
                          updateQuestion(question.id, { options: newOptions });
                        }}
                        placeholder={`Option ${optIndex + 1}`}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ))}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Correct Answer
                      </label>
                      <select
                        value={String(question.correct_answer)}
                        onChange={(e) =>
                          updateQuestion(question.id, {
                            correct_answer: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {question.options?.map((_, idx) => (
                          <option key={idx} value={idx}>
                            Option {idx + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {question.type === "true_false" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Correct Answer
                    </label>
                    <select
                      value={String(question.correct_answer)}
                      onChange={(e) =>
                        updateQuestion(question.id, {
                          correct_answer: e.target.value === "true",
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                )}

                {question.type === "short_answer" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Correct Answer
                    </label>
                    <input
                      type="text"
                      value={String(question.correct_answer)}
                      onChange={(e) =>
                        updateQuestion(question.id, {
                          correct_answer: e.target.value,
                        })
                      }
                      placeholder="Enter correct answer"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}
              </div>
            ))}
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
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
