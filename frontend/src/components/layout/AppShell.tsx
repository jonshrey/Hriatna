"use client";

import { useState } from "react";
import type { AnalysisMode, AwarenessResult, HistoryItem, inputType } from "@/types";
import ResultPanel from "./ResultPanel";
import Sidebar from "./Sidebar";
import MainWorkspace from "./MainWorkspace";
import { analyzeAwareness } from "@/lib/api";

export default function AppShell() {
  const [input, setInput] = useState("");
  const [selectedMode, setSelectedMode] = useState<AnalysisMode>("auto");
  const [result, setResult] = useState<AwarenessResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionMemory, setSessionMemory] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const[inputType, setInputType] = useState<inputType>("text");
  return (
    <div className="grid grid-cols-[260px_1fr_300px] h-screen w-screen overflow-hidden font-sans">
      {/* 1. LEFT SIDEBAR */}
      <Sidebar history={history} />
      {/* 2. CENTER MAIN SCREEN */}
      <MainWorkspace
        input={input}
        inputType={inputType}
        selectedMode={selectedMode}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onInputChange={setInput}
        onModeChange={setSelectedMode}
        onAnalyze={buttonClick}
        oninputTypeChange={setInputType}
      />
      {/* 3. RIGHT PANEL */}
      <ResultPanel result={result} sessionMemory={sessionMemory} isLoading={isLoading} />
    </div>
  );

  async function buttonClick() {
    const trimmedInput = input.trim();

    if (trimmedInput.length === 0) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const mode: AnalysisMode =
        selectedMode === "auto" ? "surrounding" : selectedMode;

      const analysisResult = await analyzeAwareness(trimmedInput, mode);

      setResult(analysisResult);

      setHistory((prevHistory) => [
        {
          id: Date.now().toString(),
          input: createHistoryTitle(trimmedInput),
          mode: mode,
          summary: analysisResult.sceneSummary,
          createdAt: new Date().toISOString(),
        },
        ...prevHistory,
      ]);

      setSessionMemory((prevMemory) => [
        analysisResult.memoryUpdate,
        ...prevMemory,
      ]);

      setInput("");
    } catch (error) {
      console.error("Failed to analyze awareness:", error);
      setErrorMessage(
        "Something went wrong while analyzing. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }
  function createHistoryTitle(input: string) {
    return input.length > 45 ? `${input.slice(0, 45)}...` : input;
  }
}
