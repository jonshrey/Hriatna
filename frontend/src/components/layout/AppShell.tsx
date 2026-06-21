"use client";

import React from "react";
import { useState } from "react";

export default function AppShell() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<string[]>([]);
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
          <p className="text-slate-600">
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
          </p>
        </section>
      </main>

      {/* 3. RIGHT PANEL */}
      <section className="bg-white border-l border-slate-200 p-6 overflow-y-auto">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Analysis Result
        </h3>

        {result ? (
          <div className="p-4 bg-slate-50 rounded text-slate-700">{result}</div>
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

    const mockResult = `Mock analysis: "${trimmedInput}" looks like something Hriatna can analyze.`;

    setResult(mockResult);
    setHistory((prevHistory) => [...prevHistory, trimmedInput]);

    setInput("");
    setIsLoading(false);
  }
}
