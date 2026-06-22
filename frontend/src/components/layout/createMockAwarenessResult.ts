import type { AnalysisMode, AwarenessResult } from "@/types";

export function createMockAwarenessResult(
  input: string,
  mode: AnalysisMode
): AwarenessResult {
  return {
    detectedIntent: mode,
    sceneSummary: `Summary for "${input}"`,
    explanation: `Explanation for "${input}"`,
    observations: [
      {
        id: "1",
        type: "object",
        label: "this right here",
        description: "A description of the observed object",
        confidence: 0.8,
      },
      {
        id: "2",
        type: "text",
        label: "some text",
        description: "A description of the observed text",
        confidence: 0.7,
      },
    ],
    suggestedActions: [
      {
        id: "1",
        title: "Suggested Action 1",
        description: "Description for suggested action 1",
        priority: "medium",
      },
      {
        id: "2",
        title: "Suggested Action 2",
        description: "Description for suggested action 2",
        priority: "high",
      },
    ],
    memoryUpdate: `Remembered context from this session: ${input}`,
    confidence: 0.8,
  };
}