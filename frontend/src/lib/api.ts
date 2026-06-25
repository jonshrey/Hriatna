import type { AwarenessResult, AnalyzeAwarenessRequest } from "@/types";
import { createMockAwarenessResult } from "@/data/createMockAwarenessResult";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function analyzeAwareness({
  input,
  mode,
  inputType,
  recentCameraFrames,
}: AnalyzeAwarenessRequest): Promise<AwarenessResult> {
  const response = await fetch("http://localhost:8080/api/ask", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: input,
  });

  if (!response.ok) {
    throw new Error("Failed to get answer from backend");
  }

  const backendAnswer = await response.text();

  return {
    detectedIntent: mode,
    sceneSummary: "Backend response received.",
    explanation: backendAnswer,
    observations: [
      {
        id: crypto.randomUUID(),
        type: "task",
        label: "Question processed",
        description: `Input type: ${inputType}. Camera frames available: ${
          recentCameraFrames?.length ?? 0
        }`,
        confidence: 1,
      },
    ],
    suggestedActions: [],
    memoryUpdate: "Asked backend a question through Spring Boot.",
    confidence: 1,
  };
}
