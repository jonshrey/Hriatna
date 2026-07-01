import type { AwarenessResult, AnalyzeAwarenessRequest } from "@/types";

type AskBackendResponse = {
  answer: string;
  model: string;
  status: string;
  latencyMs: number;
};
type AskBackendErrorResponse = {
  status: string;
  message: string;
  code: string;
};

export async function analyzeAwareness({
  input,
  mode,
  inputType,
  recentCameraFrames,
  messages,
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
      messages: messages?.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      recentCameraFrames,
    }),
  });

  if (!response.ok) {
    const errorResponse: AskBackendErrorResponse = await response.json();
    throw new Error(
      errorResponse.message || "Failed to get answer from backend",
    );
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
        }. Backend status: ${backendResponse.status}. Latency: ${backendResponse.latencyMs} ms.`,
        confidence: 1,
      },
    ],
    suggestedActions: [],
    memoryUpdate: "Asked backend a question through Spring Boot.",
    confidence: 1,
    latencyMs: backendResponse.latencyMs,
  };
}
