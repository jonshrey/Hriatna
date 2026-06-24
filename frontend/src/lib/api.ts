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
  await sleep(1000);

  if (input.toLowerCase().includes("fail")) {
    throw new Error("Mock analysis failure");
  }

  const result = createMockAwarenessResult(input, mode);

  if (inputType === "camera") {
    const frameCount = recentCameraFrames?.length ?? 0;

    if (frameCount === 0) {
      return {
        ...result,
        sceneSummary:
          "Camera mode selected, but no visual context is available yet.",
        explanation:
          "Start the camera and wait a few seconds so Hriatna can collect recent visual frames before analyzing your question.",
        observations: [],
        suggestedActions: [
          {
            id: "start-camera",
            title: "Start camera",
            description:
              "Turn on the camera and wait for recent frames to be captured.",
            priority: "high",
          },
        ],
        memoryUpdate: `Camera question asked without visual context: ${input}`,
        confidence: 0.3,
      };
    }

    return {
      ...result,
      sceneSummary: `Using recent visual context from ${frameCount} camera frame${
        frameCount > 1 ? "s" : ""
      } for: "${input}"`,
      explanation:
        "Hriatna is combining your question with a short rolling buffer of recent camera frames. This is currently mocked, but the frontend flow is ready for a vision backend.",
      observations: [
        {
          id: "recent-camera-context",
          type: "environment",
          label: "Recent camera context",
          description: `${frameCount} recent camera frame${
            frameCount > 1 ? "s were" : " was"
          } available during analysis.`,
          confidence: 0.9,
        },
      ],
      suggestedActions: [
        {
          id: "ask-visual-follow-up",
          title: "Ask a visual follow-up",
          description:
            "Ask what changed, what object was visible earlier, or what action to take next.",
          priority: "medium",
        },
      ],
      memoryUpdate: `Used recent camera context from ${frameCount} frame${
        frameCount > 1 ? "s" : ""
      } while answering: ${input}`,
      confidence: 0.85,
    };
  }

  return result;
}