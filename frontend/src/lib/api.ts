import type { AwarenessResult, AnalyzeAwarenessRequest } from "@/types";

type AskBackendResponse = {
  answer: string;
  model: string;
  status: string;
};

export async function analyzeAwareness({
  input,
  mode,
  inputType,
  recentCameraFrames,
}: AnalyzeAwarenessRequest): Promise<AwarenessResult> {
  const response = await fetch("http://localhost:8080/api/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: input,
      mode,
      inputType,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get answer from backend");
  }

  const backendResponse: AskBackendResponse = await response.json();

  return {
    detectedIntent: mode,
    sceneSummary: `Backend response received from ${backendResponse.model}.`,
    explanation: backendResponse.answer,
    observations: [
      {
        id: crypto.randomUUID(),
        type: "task",
        label: "Question processed",
        description: `Input type: ${inputType}. Camera frames available: ${
          recentCameraFrames?.length ?? 0
        }. Backend status: ${backendResponse.status}.`,
        confidence: 1,
      },
    ],
    suggestedActions: [],
    memoryUpdate: "Asked backend a question through Spring Boot.",
    confidence: 1,
  };
}
