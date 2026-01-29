"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Loader2, Play, Square, Copy, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CodeEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    language?: string;
    defaultValue?: string;
    readOnly?: boolean;
    onRun?: (code: string) => void;
    onStop?: () => void;
    showControls?: boolean;
}

export function CodeEditor({
    value,
    onChange,
    language = "python",
    defaultValue = "",
    readOnly = false,
    onRun,
    onStop,
    showControls = true
}: CodeEditorProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [isEditorReady, setIsEditorReady] = useState(false);

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

    return (
        <div className="h-full w-full overflow-hidden rounded-xl border bg-card shadow-inner flex flex-col">
            {showControls && (
                <div className="flex items-center justify-between p-2 bg-muted border-b">
                    <div className="text-xs font-mono text-muted-foreground ml-2">
                        {language.toUpperCase()} Editor
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
                    </div>
                </div>
            )}
            <div className={`${showControls ? "h-[calc(100%-2rem)]" : "h-full"}`}>
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
                    }}
                    onMount={(editor) => {
                        setIsEditorReady(true);
                        // Add Ctrl/Cmd+Enter shortcut for running code
                        const monaco = (window as any).monaco;
                        if (monaco) {
                            editor.addCommand(
                                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                                () => {
                                    if (!readOnly && value) {
                                        handleRun();
                                    }
                                }
                            );
                        }
                    }}
                    loading={
                        <div className="flex h-full items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    }
                />
            </div>
        </div>
    );
}
