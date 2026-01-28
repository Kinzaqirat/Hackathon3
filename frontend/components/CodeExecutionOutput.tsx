import { Terminal, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeExecutionOutputProps {
    output: string;
    error?: string;
    isLoading?: boolean;
    onClose?: () => void;
}

export function CodeExecutionOutput({
    output,
    error,
    isLoading = false,
    onClose
}: CodeExecutionOutputProps) {
    return (
        <div className={cn(
            "border rounded-xl bg-card shadow-sm overflow-hidden transition-all duration-300",
            isLoading ? "animate-pulse" : ""
        )}>
            <div className="flex items-center justify-between bg-muted px-4 py-2 border-b">
                <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Output</span>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
            <div className="p-4 font-mono text-sm">
                {isLoading ? (
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-muted rounded"></div>
                        <div className="h-4 w-3/4 bg-muted rounded"></div>
                        <div className="h-4 w-1/2 bg-muted rounded"></div>
                    </div>
                ) : (
                    <pre className={cn(
                        "whitespace-pre-wrap break-words",
                        error ? "text-red-600" : "text-foreground"
                    )}>
                        {error || output || "Run your code to see output here..."}
                    </pre>
                )}
            </div>
        </div>
    );
}