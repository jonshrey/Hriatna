import type { AnalysisMode, AwarenessResult } from "@/types";
import { createMockAwarenessResult } from "@/data/createMockAwarenessResult";

export async function analyzeAwareness(
  input: string,
  mode: AnalysisMode
): Promise<AwarenessResult> {
  return createMockAwarenessResult(input, mode);
}