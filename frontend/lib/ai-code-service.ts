// lib/ai-code-service.ts
import { sendChatMessage, fetchChatMessages, createChatSession } from './api';

export interface CodeSuggestion {
  label: string;
  insertText: string;
  detail: string;
  documentation?: string;
  sortText?: string;
}

export interface CodeCompletionRequest {
  code: string;
  cursorPosition: { line: number; column: number };
  language: string;
  context?: string;
}

export class AICodeService {
  private static instance: AICodeService;
  private sessionId: number | null = null;

  public static getInstance(): AICodeService {
    if (!AICodeService.instance) {
      AICodeService.instance = new AICodeService();
    }
    return AICodeService.instance;
  }

  public async initializeSession(userId: number, context: string = 'code-completion'): Promise<void> {
    try {
      const session = await createChatSession(userId, context, 'debug');
      this.sessionId = session.id;
    } catch (error) {
      console.error('Error initializing AI session:', error);
      // Fallback to mock session ID for demo purposes
      this.sessionId = 999;
    }
  }

  public async getCodeCompletions(request: CodeCompletionRequest): Promise<CodeSuggestion[]> {
    if (!this.sessionId) {
      await this.initializeSession(1); // Use mock user ID for demo
    }

    try {
      // Create a prompt for code completion
      const prompt = this.buildCompletionPrompt(request);

      // Send the prompt to the AI
      if (this.sessionId === null) {
        return [];
      }
      await sendChatMessage(this.sessionId, prompt);

      // Get the response
      // Add null check before calling fetchChatMessages
      if (this.sessionId === null) {
        console.warn('Session ID is null, cannot fetch chat messages.');
        return [];
      }
      const messages = await fetchChatMessages(this.sessionId);
      const aiResponse = messages[messages.length - 1];

      if (aiResponse && aiResponse.role === 'assistant') {
        return this.parseCompletionResponse(aiResponse.content);
      }

      return [];
    } catch (error) {
      console.error('Error getting AI code completions:', error);
      // Return mock completions for demo purposes
      return this.getMockCompletions(request.code);
    }
  }

  private buildCompletionPrompt(request: CodeCompletionRequest): string {
    return `Complete the following ${request.language} code at line ${request.cursorPosition.line}. 
Context: ${request.context || 'Complete the code based on the preceding lines'}
Code so far:
\`\`\`${request.language}
${request.code}
\`\`\`
Provide 3-5 relevant code completions that would logically follow.`;
  }

  private parseCompletionResponse(response: string): CodeSuggestion[] {
    // Simple parsing of AI response - in a real implementation, this would be more sophisticated
    const suggestions: CodeSuggestion[] = [];

    // Look for code blocks in the response
    const codeBlockRegex = /```(?:\w+)?\s*([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(response)) !== null) {
      const code = match[1].trim();
      if (code) {
        suggestions.push({
          label: code.split('\n')[0].substring(0, 30) + '...',
          insertText: code,
          detail: 'AI Suggestion',
          documentation: 'Suggested by AI assistant',
          sortText: '0'
        });
      }
    }

    // If no code blocks found, try to extract suggestions from plain text
    if (suggestions.length === 0) {
      const lines = response.split('\n');
      for (const line of lines) {
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          const suggestion = line.substring(2).trim();
          if (suggestion) {
            suggestions.push({
              label: suggestion,
              insertText: suggestion,
              detail: 'AI Suggestion',
              documentation: 'Suggested by AI assistant',
              sortText: '1'
            });
          }
        }
      }
    }

    return suggestions;
  }

  private getMockCompletions(code: string): CodeSuggestion[] {
    // Return mock completions for demonstration
    const mockSuggestions: CodeSuggestion[] = [
      {
        label: 'print statement',
        insertText: 'print("Hello, World!")',
        detail: 'Print statement',
        documentation: 'Basic print statement',
        sortText: '0'
      },
      {
        label: 'for loop',
        insertText: 'for i in range(10):\n    ',
        detail: 'For loop',
        documentation: 'A for loop iterating 10 times',
        sortText: '1'
      },
      {
        label: 'if statement',
        insertText: 'if condition:\n    ',
        detail: 'Conditional statement',
        documentation: 'An if statement',
        sortText: '2'
      }
    ];

    // Add more context-aware suggestions based on the current code
    if (code.includes('def ')) {
      mockSuggestions.push({
        label: 'return statement',
        insertText: 'return result',
        detail: 'Return statement',
        documentation: 'Return a value from function',
        sortText: '3'
      });
    }

    if (code.includes('import')) {
      mockSuggestions.push({
        label: 'common imports',
        insertText: 'import os\nimport sys',
        detail: 'Common imports',
        documentation: 'Commonly used imports',
        sortText: '4'
      });
    }

    return mockSuggestions;
  }
}