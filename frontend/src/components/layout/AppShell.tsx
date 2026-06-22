"use client";

import { useState } from "react";
import type { AnalysisMode, AwarenessResult, HistoryItem } from "@/types";
import ResultPanel from "./ResultPanel";
import Sidebar from "./Sidebar";
import MainWorkspace from "./MainWorkspace";
import { createMockAwarenessResult } from "./createMockAwarenessResult";

export default function AppShell() {
  const [input, setInput] = useState("");
  const [selectedMode, setSelectedMode] = useState<AnalysisMode>("auto");
  const [result, setResult] = useState<AwarenessResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionMemory, setSessionMemory] = useState<string[]>([]);
  return (
    <div className="grid grid-cols-[260px_1fr_300px] h-screen w-screen overflow-hidden font-sans">
      {/* 1. LEFT SIDEBAR */}
      <Sidebar history={history} />
      {/* 2. CENTER MAIN SCREEN */}
      <MainWorkspace
        input={input}
        selectedMode={selectedMode}
        isLoading={isLoading}
        onInputChange={setInput}
        onModeChange={setSelectedMode}
        onAnalyze={buttonClick}
      />
      {/* 3. RIGHT PANEL */}
      <ResultPanel result={result} sessionMemory={sessionMemory} />{" "}
    </div>
  );

  function buttonClick() {
    const trimmedInput = input.trim();

    if (trimmedInput.length === 0) {
      return;
    }

    setIsLoading(true);
    const mode: AnalysisMode =
      selectedMode === "auto" ? "surrounding" : selectedMode;

    const mockResult = createMockAwarenessResult(trimmedInput, mode);

    setResult(mockResult);
    setHistory((prevHistory) => [
      {
        id: Date.now().toString(),
        input: trimmedInput,
        mode: mode,
        summary: mockResult.sceneSummary,
        createdAt: new Date().toISOString(),
      },
      ...prevHistory,
    ]);

    setSessionMemory((prevMemory) => [mockResult.memoryUpdate, ...prevMemory]);

    setInput("");
    setIsLoading(false);
  }
}
