"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Loader2, Play, Square, Copy, Download, Sparkles, Bug, Lightbulb, Wrench, Code } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { sendChatMessage, fetchChatMessages, createChatSession } from "@/lib/api";
import { AICodeService, CodeSuggestion } from "@/lib/ai-code-service";

interface AIInsight {
    type: 'suggestion' | 'warning' | 'error' | 'optimization';
    message: string;
    line?: number;
    position?: number;
}

interface AiCodeEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    language?: string;
    defaultValue?: string;
    readOnly?: boolean;
    onRun?: (code: string) => void;
    onStop?: () => void;
    showControls?: boolean;
    exerciseId?: number;
    exerciseTitle?: string;
    currentCode?: string;
    onCodeChange?: (code: string) => void;
}

export function AiCodeEditor({
    value,
    onChange,
    language = "python",
    defaultValue = "",
    readOnly = false,
    onRun,
    onStop,
    showControls = true,
    exerciseId,
    exerciseTitle,
    currentCode,
    onCodeChange
}: AiCodeEditorProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [completionSuggestions, setCompletionSuggestions] = useState<CodeSuggestion[]>([]);
    const [showCompletionDropdown, setShowCompletionDropdown] = useState(false);
    const [selectedCompletionIndex, setSelectedCompletionIndex] = useState(0);
    const [debuggingInfo, setDebuggingInfo] = useState<{ line: number, message: string }[]>([]);
    const [showDebugger, setShowDebugger] = useState(false);
    const editorRef = useRef<any>(null);
    const aiService = useRef<AICodeService>(AICodeService.getInstance());

    // Initialize AI session when component mounts
    useEffect(() => {
        const initAiSession = async () => {
            try {
                const mockUserId = 1; // In a real app, get actual user ID
                await aiService.current.initializeSession(mockUserId, "code-completion");
            } catch (error) {
                console.error("Error initializing AI session:", error);
            }
        };

        if (exerciseId) {
            initAiSession();
        }
    }, [exerciseId]);

    const handleRun = () => {
        if (onRun && value) {
            setIsRunning(true);
            onRun(value);
        }
    };

    const handleStop = () => {
        if (onStop) {
            onStop();
            setIsRunning(false);
        }
    };

    const handleCopy = () => {
        if (value) {
            navigator.clipboard.writeText(value);
        }
    };

    const handleDownload = () => {
        if (value) {
            const blob = new Blob([value], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `code.${language === "python" ? "py" : "txt"}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    // Get AI suggestions for the current code
    const getAiSuggestions = useCallback(async () => {
        if (!value || aiLoading) return;

        setAiLoading(true);
        try {
            // Add completions to the global monaco instance if available
            const monaco = (window as any).monaco;
            if (monaco) {
                // Send code to AI for analysis
                const prompt = `Analyze this ${language} code and provide suggestions for improvement, potential bugs, or optimizations. Code:\n\n${value}`;

                // Use the session ID from the AI service
                const mockSessionId = 999; // In a real implementation, we'd have a proper session
                await sendChatMessage(mockSessionId, prompt);

                // For demo purposes, we'll use mock responses
                // In a real implementation, we'd get the actual response

                // Mock response for demo
                const mockResponse = `Here are some suggestions for your ${language} code:
- Consider adding comments to explain complex logic
- Use list comprehensions for simpler iterations
- Handle potential exceptions in file operations
- Follow PEP 8 naming conventions`;

                // Parse AI response for suggestions
                const suggestions = parseAiResponse(mockResponse);
                setAiSuggestions(suggestions);

                // Extract insights
                const insights = extractInsights(mockResponse);
                setAiInsights(insights);
            }
        } catch (error) {
            console.error("Error getting AI suggestions:", error);
            setAiInsights([{ type: 'error', message: 'Failed to get AI suggestions. Please try again.' }]);
        } finally {
            setAiLoading(false);
        }
    }, [value, aiLoading, language]);

    // Get AI code completions
    const getAiCompletions = useCallback(async (code: string, position: { line: number; column: number }) => {
        if (!code) return [];

        try {
            const completions = await aiService.current.getCodeCompletions({
                code,
                cursorPosition: position,
                language
            });

            setCompletionSuggestions(completions);
            setShowCompletionDropdown(completions.length > 0);
            setSelectedCompletionIndex(0);
            return completions;
        } catch (error) {
            console.error("Error getting AI completions:", error);
            return [];
        }
    }, [language]);

    // Analyze code for debugging
    const analyzeForDebugging = useCallback(async () => {
        if (!value) return;

        try {
            const prompt = `Analyze this ${language} code for potential bugs, errors, or issues. Focus on common mistakes, syntax errors, logical errors, and runtime issues. Code:\n\n${value}`;

            // Use mock session ID for demo
            const mockSessionId = 999;
            await sendChatMessage(mockSessionId, prompt);

            // Mock response for debugging
            const mockDebugResponse = `Potential issues found in your code:
- Line 5: Variable 'x' might not be defined before use
- Line 10: Possible division by zero
- Line 15: Indentation error detected
- Line 20: Missing colon after if statement`;

            // Parse debugging info
            const debugLines = mockDebugResponse.split('\n')
                .filter(line => line.startsWith('- Line'))
                .map(line => {
                    const match = line.match(/Line (\d+): (.+)/);
                    if (match) {
                        return { line: parseInt(match[1]), message: match[2] };
                    }
                    return null;
                })
                .filter(Boolean) as { line: number, message: string }[];

            setDebuggingInfo(debugLines);
            setShowDebugger(debugLines.length > 0);
        } catch (error) {
            console.error("Error analyzing code for debugging:", error);
        }
    }, [value, language]);

    // Parse AI response to extract suggestions
    const parseAiResponse = (response: string): string[] => {
        // Simple parsing - in a real app, this could be more sophisticated
        const suggestions = response.split('\n')
            .filter(line =>
                line.toLowerCase().includes('suggest') ||
                line.toLowerCase().includes('consider') ||
                line.toLowerCase().includes('recommend') ||
                line.toLowerCase().includes('improve')
            )
            .map(s => s.replace(/^[*-]\s*/, '').trim())
            .filter(s => s.length > 0);

        return suggestions.slice(0, 5); // Limit to 5 suggestions
    };

    // Extract insights from AI response
    const extractInsights = (response: string): AIInsight[] => {
        const insights: AIInsight[] = [];

        if (response.toLowerCase().includes('bug') || response.toLowerCase().includes('error')) {
            insights.push({ type: 'error', message: 'Potential bug detected in your code' });
        }

        if (response.toLowerCase().includes('optimize') || response.toLowerCase().includes('performance')) {
            insights.push({ type: 'optimization', message: 'Consider optimizing this part of your code' });
        }

        if (response.toLowerCase().includes('warning') || response.toLowerCase().includes('careful')) {
            insights.push({ type: 'warning', message: 'Potential issue to be aware of' });
        }

        if (insights.length === 0) {
            insights.push({ type: 'suggestion', message: 'Code looks good! Keep up the good work.' });
        }

        return insights;
    };

    // Auto-analyze code when it changes (with debounce)
    useEffect(() => {
        if (!value) return;

        const timer = setTimeout(() => {
            getAiSuggestions();
        }, 2000); // Debounce for 2 seconds

        return () => clearTimeout(timer);
    }, [value, getAiSuggestions]);

    // Handle editor mount
    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
        setIsEditorReady(true);

        // Add Ctrl/Cmd+Enter shortcut for running code
        const monaco = (window as any).monaco;
        editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
            () => {
                if (!readOnly && value) {
                    handleRun();
                }
            }
        );

        // Add Ctrl/Cmd+Shift+I for AI insights
        editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_I,
            () => {
                getAiSuggestions();
            }
        );

        // Listen for changes to trigger AI completions
        const disposable = editor.onDidChangeCursorPosition((e: any) => {
            // Trigger AI completion when user stops typing
            setTimeout(() => {
                const position = editor.getPosition();
                getAiCompletions(editor.getValue(), { line: position.lineNumber, column: position.column });
            }, 500);
        });

        // Cleanup
        return () => {
            if (disposable) {
                disposable.dispose();
            }
        };
    };

    // Insert selected completion
    const insertCompletion = (completion: CodeSuggestion) => {
        if (editorRef.current) {
            const editor = editorRef.current;
            const position = editor.getPosition();

            // Simple insertion - in a real implementation, this would be more sophisticated
            const model = editor.getModel();
            const monaco = (window as any).monaco;
            if (model && monaco) {
                model.pushEditOperations(
                    [],
                    [{
                        range: new monaco.Range(
                            position.lineNumber,
                            position.column,
                            position.lineNumber,
                            position.column
                        ),
                        text: completion.insertText,
                        forceMoveMarkers: true
                    }],
                    () => null
                );
            }

            setShowCompletionDropdown(false);
        }
    };

    // Navigation for completion dropdown
    const navigateCompletions = (direction: 'up' | 'down') => {
        if (!showCompletionDropdown) return;

        if (direction === 'down') {
            setSelectedCompletionIndex(prev =>
                prev < completionSuggestions.length - 1 ? prev + 1 : 0
            );
        } else {
            setSelectedCompletionIndex(prev =>
                prev > 0 ? prev - 1 : completionSuggestions.length - 1
            );
        }
    };

    // Get icon based on insight type
    const getInsightIcon = (type: string) => {
        switch (type) {
            case 'error': return <Bug className="h-4 w-4 text-red-500" />;
            case 'warning': return <Wrench className="h-4 w-4 text-yellow-500" />;
            case 'optimization': return <Sparkles className="h-4 w-4 text-blue-500" />;
            default: return <Lightbulb className="h-4 w-4 text-green-500" />;
        }
    };

    return (
        <div className="h-full w-full overflow-hidden rounded-xl border bg-card shadow-inner flex flex-col relative">
            {showControls && (
                <div className="flex items-center justify-between p-2 bg-muted border-b">
                    <div className="text-xs font-mono text-muted-foreground ml-2 flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-primary" />
                        {language.toUpperCase()} Editor with AI Assistance
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
                            disabled={!value}
                            className="h-7 w-7 p-0"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDownload}
                            disabled={!value}
                            className="h-7 w-7 p-0"
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-4 bg-border mx-1" />
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={isRunning ? handleStop : handleRun}
                            disabled={readOnly || !value}
                            className="h-7 flex items-center gap-1"
                        >
                            {isRunning ? (
                                <>
                                    <Square className="h-4 w-4" />
                                    Stop
                                </>
                            ) : (
                                <>
                                    <Play className="h-4 w-4" />
                                    Run
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={getAiSuggestions}
                            disabled={aiLoading || !value}
                            className="h-7 flex items-center gap-1"
                        >
                            {aiLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="h-4 w-4" />
                            )}
                            AI
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={analyzeForDebugging}
                            disabled={aiLoading || !value}
                            className="h-7 flex items-center gap-1"
                        >
                            <Bug className="h-4 w-4" />
                            Debug
                        </Button>
                    </div>
                </div>
            )}
            <div className={`${showControls ? "h-[calc(100%-2rem)]" : "h-full"} flex flex-col`}>
                <div className="flex-1 relative">
                    <Editor
                        height="100%"
                        defaultLanguage={language}
                        defaultValue={defaultValue}
                        value={value}
                        onChange={onChange}
                        theme={useTheme().theme === "dark" ? "vs-dark" : "vs-light"}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            wordWrap: "on",
                            automaticLayout: true,
                            readOnly: readOnly,
                            scrollBeyondLastLine: false,
                            lineNumbers: "on",
                            padding: { top: 16, bottom: 16 },
                            fontFamily: "var(--font-geist-mono)",
                            tabSize: 4,
                            insertSpaces: true,
                            autoIndent: "full",
                            formatOnPaste: true,
                            formatOnType: true,
                            quickSuggestions: true,
                            parameterHints: { enabled: true },
                            suggestOnTriggerCharacters: true,
                            // Enable AI-powered suggestions
                            suggest: {
                                showKeywords: true,
                                showSnippets: true,
                                showClasses: true,
                                showFunctions: true,
                            }
                        }}
                        onMount={handleEditorDidMount}
                        loading={
                            <div className="flex h-full items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        }
                    />

                    {/* AI Completion Dropdown */}
                    {showCompletionDropdown && completionSuggestions.length > 0 && (
                        <div
                            className="absolute z-50 bg-popover border border-border rounded-md shadow-lg w-80 max-h-60 overflow-y-auto"
                            style={{
                                top: '40px',
                                left: '10px',
                                transform: 'translateY(-100%)'
                            }}
                        >
                            <div className="p-1">
                                {completionSuggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 cursor-pointer rounded-sm text-sm ${index === selectedCompletionIndex
                                            ? 'bg-accent text-accent-foreground'
                                            : 'hover:bg-muted'
                                            }`}
                                        onClick={() => insertCompletion(suggestion)}
                                    >
                                        <div className="font-medium">{suggestion.label}</div>
                                        <div className="text-xs text-muted-foreground truncate">
                                            {suggestion.detail}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* AI Insights Panel */}
                {(aiInsights.length > 0 || aiSuggestions.length > 0) && (
                    <div className="border-t bg-muted/20 p-3 max-h-32 overflow-y-auto">
                        <div className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                {aiInsights.map((insight, index) => (
                                    <div key={index} className="flex items-start gap-2 mb-1 last:mb-0">
                                        {getInsightIcon(insight.type)}
                                        <span className={`text-xs ${insight.type === 'error' ? 'text-red-600' :
                                            insight.type === 'warning' ? 'text-yellow-600' :
                                                insight.type === 'optimization' ? 'text-blue-600' :
                                                    'text-green-600'
                                            }`}>
                                            {insight.message}
                                        </span>
                                    </div>
                                ))}

                                {aiSuggestions.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-muted-foreground/20">
                                        <p className="text-xs font-semibold text-muted-foreground mb-1">AI Suggestions:</p>
                                        <ul className="text-xs space-y-1">
                                            {aiSuggestions.map((suggestion, idx) => (
                                                <li key={idx} className="flex items-start gap-1">
                                                    <span className="text-primary">•</span>
                                                    <span>{suggestion}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Debugger Panel */}
                {showDebugger && debuggingInfo.length > 0 && (
                    <div className="border-t bg-red-50 border-red-200 p-3 max-h-32 overflow-y-auto">
                        <div className="flex items-start gap-2 text-sm">
                            <Bug className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-red-700 mb-1">Debugging Issues Found:</p>
                                <ul className="text-xs space-y-1">
                                    {debuggingInfo.map((issue, idx) => (
                                        <li key={idx} className="flex items-start gap-1">
                                            <span className="text-red-600">•</span>
                                            <span><strong>Line {issue.line}:</strong> {issue.message}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}