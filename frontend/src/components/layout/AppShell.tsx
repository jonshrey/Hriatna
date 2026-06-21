"use client";

import { useState } from "react";
import type { AnalysisMode, AwarenessResult, HistoryItem } from "@/types";

export default function AppShell() {
  const [input, setInput] = useState("");
  const [selectedMode, setSelectedMode] = useState<AnalysisMode>("auto");
  const [result, setResult] = useState<AwarenessResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="grid grid-cols-[260px_1fr_300px] h-screen w-screen overflow-hidden font-sans">
      {/* 1. LEFT SIDEBAR */}
      <aside className="bg-slate-900 text-slate-100 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">App Logo</h2>
          <nav className="space-y-2">
            <a href="#" className="block p-2 rounded hover:bg-slate-800">
              Dashboard
            </a>
            <a href="#" className="block p-2 rounded hover:bg-slate-800">
              Analytics
            </a>
            <a href="#" className="block p-2 rounded hover:bg-slate-800">
              Settings
            </a>
          </nav>
          <section className="mt-6">{history.length > 0 && <h3 className="text-sm font-semibold mb-2">History</h3>}
          <div className="space-y-1">
            {history.map((item) => (
              <div key={item.id} className="p-2 bg-slate-800 rounded">
                <p className="text-sm">{item.input}</p>
                <p className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
          </section>
        </div>
        <div className="text-sm text-slate-400">User Profile</div>
      </aside>

      {/* 2. CENTER MAIN SCREEN */}
      <main className="bg-slate-50 p-6 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Main Screen Title
          </h1>
        </header>
        <section className="bg-white p-6 rounded-lg shadow-sm min-h-[1000px]">
          <div className="text-slate-600">
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value as AnalysisMode)}
              className="border p-2 rounded mb-4"
            >
              <option value="auto">Auto</option>
              <option value="surrounding">Surrounding</option>
              <option value="screen">Screen</option>
              <option value="document">Document</option>
              <option value="code">Code</option>
              <option value="sre">SRE</option>
            </select>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border p-2 rounded w-full mb-4"
              placeholder="Type something..."
            />
            <button
              onClick={buttonClick}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              {isLoading ? "Analyzing..." : "Submit"}
            </button>
          </div>
        </section>
      </main>

      {/* 3. RIGHT PANEL */}
      <section className="bg-white border-l border-slate-200 p-6 overflow-y-auto">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Analysis Result
        </h3>

        {result ? (
          <div className="p-4 bg-slate-50 rounded text-slate-700">
            <p>
              <strong>Detected Intent:</strong> {result.detectedIntent}
            </p>
            <p>
              <strong>Scene Summary:</strong> {result.sceneSummary}
            </p>
            <p>
              <strong>Explanation:</strong> {result.explanation}
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No analysis yet.</p>
        )}
      </section>
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

    const mockResult: AwarenessResult = {
      detectedIntent: "unknown",
      sceneSummary: `Summary for "${trimmedInput}"`,
      explanation: `Explanation for "${trimmedInput}"`,
      observations: [],
      suggestedActions: [],
      memoryUpdate: "",
      confidence: 0.8,
    };

    setResult(mockResult);
    setHistory((prevHistory) => [
      {
        id: Date.now().toString(),
        input: trimmedInput,
        mode: selectedMode,
        summary: mockResult.sceneSummary,
        createdAt: new Date().toISOString(),
      },
      ...prevHistory,
    ]);

    setInput("");
    setIsLoading(false);
  }
}
