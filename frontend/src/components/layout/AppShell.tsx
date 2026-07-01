"use client";

import { useState } from "react";
import speakText, { stopSpeaking } from "@/lib/speech";
import type {
  AnalysisMode,
  AwarenessResult,
  ChatMessage,
  InputType,
} from "@/types";
import ResultPanel from "./ResultPanel";
import Sidebar from "./Sidebar";
import MainWorkspace from "./MainWorkspace";
import { analyzeAwareness } from "@/lib/api";

export default function AppShell() {
  const [input, setInput] = useState("");
  const [selectedMode, setSelectedMode] = useState<AnalysisMode>("auto");
  const [result, setResult] = useState<AwarenessResult | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionMemory, setSessionMemory] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recentCameraFrames, setRecentCameraFrames] = useState<string[]>([]);
  const [inputType, setInputType] = useState<InputType>("text");

  return (
    <div className="grid grid-cols-[260px_1fr_300px] h-screen w-screen overflow-hidden font-sans">
      {/* 1. LEFT SIDEBAR */}
      <Sidebar messages={messages} />

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
        onInputTypeChange={setInputType}
        onTranscriptChange={(transcript) => setInput(transcript)}
        onCameraFrameCapture={handleCameraFrameCapture}
      />

      {/* 3. RIGHT PANEL */}
      <ResultPanel
        result={result}
        sessionMemory={sessionMemory}
        isLoading={isLoading}
      />
    </div>
  );

  async function buttonClick() {
    const trimmedInput = input.trim();

    console.log(
      "Recent camera frames exist:",
      Boolean(recentCameraFrames.length),
    );

    if (trimmedInput.length === 0) {
      return;
    }

    const mode: AnalysisMode =
      selectedMode === "auto" ? "surrounding" : selectedMode;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedInput,
      createdAt: new Date().toISOString(),
    };

    setMessages((previousMessages) => [...previousMessages, userMessage]);

    setIsLoading(true);
    setErrorMessage(null);
    stopSpeaking();

    try {
      const analysisResult = await analyzeAwareness({
        input: trimmedInput,
        mode,
        inputType,
        recentCameraFrames:
          recentCameraFrames.length > 0 ? recentCameraFrames : undefined,
        messages,
      });

      setResult(analysisResult);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: analysisResult.explanation,
        latencyMs: analysisResult.latencyMs,
        createdAt: new Date().toISOString(),
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage,
      ]);

      speakText(analysisResult.explanation);

      setSessionMemory((previousMemory) => [
        analysisResult.memoryUpdate,
        ...previousMemory,
      ]);

      setInput("");
    } catch (error) {
      console.error("Failed to analyze awareness:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while analyzing. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleCameraFrameCapture(frameDataUrl: string) {
    setRecentCameraFrames((previousFrames) =>
      [frameDataUrl, ...previousFrames].slice(0, 5),
    );
  }
}