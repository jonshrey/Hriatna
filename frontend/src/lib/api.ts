import type { AnalysisMode, AwarenessResult } from "@/types";
import { createMockAwarenessResult } from "../data/createMockAwarenessResult";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function analyzeAwareness(
  input: string,
  mode: AnalysisMode
): Promise<AwarenessResult> {
  await sleep(1000);

  if (input.toLowerCase().includes("fail")) {
    throw new Error("Mock analysis failure");
  }

  return createMockAwarenessResult(input, mode);
}
