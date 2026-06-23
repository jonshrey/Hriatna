import type { AnalysisMode, AwarenessResult, InputType } from "@/types";
import { createMockAwarenessResult } from "@/data/mockAwarenessResult";

type AnalyzeAwarenessRequest = {
  input: string;
  mode: AnalysisMode;
  inputType: InputType;
  latestCameraFrame?: string | null;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function analyzeAwareness({
  input,
  mode,
  inputType,
  latestCameraFrame,
}: AnalyzeAwarenessRequest): Promise<AwarenessResult> {
  await sleep(1000);

  if (input.toLowerCase().includes("fail")) {
    throw new Error("Mock analysis failure");
  }

  const result = createMockAwarenessResult(input, mode);

  if (inputType === "camera") {
    return {
      ...result,
      sceneSummary: latestCameraFrame
        ? `Camera context detected. Analyzing latest visual frame for: "${input}"`
        : `Camera mode selected, but no camera frame is available yet.`,
      explanation: latestCameraFrame
        ? "Hriatna is using the latest auto-captured camera frame along with your question."
        : "Start the camera and wait a moment before analyzing.",
      memoryUpdate: latestCameraFrame
        ? `Used latest camera frame for question: ${input}`
        : `Camera question asked without available frame: ${input}`,
    };
  }

  return result;
}