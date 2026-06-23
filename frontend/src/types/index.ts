export type AnalysisMode =
  | "auto"
  | "surrounding"
  | "screen"
  | "document"
  | "code"
  | "sre";

export type ObservationType =
  | "object"
  | "text"
  | "environment"
  | "issue"
  | "task"
  | "unknown";

export type InputType = "text" | "image" | "document" | "code" | "log" | "camera" | "screenshot" | "other";  

export interface Observation {
  id: string;
  type: ObservationType;
  label: string;
  description: string;
  confidence: number;
}

export interface SuggestedAction {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
}

export interface AwarenessResult {
  detectedIntent: string;
  sceneSummary: string;
  explanation: string;
  observations: Observation[];
  suggestedActions: SuggestedAction[];
  memoryUpdate: string;
  confidence: number;
}

export interface HistoryItem {
  id: string;
  input: string;
  mode: AnalysisMode;
  summary: string;
  createdAt: string;
}

