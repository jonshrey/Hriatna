import { AnalysisMode } from "@/types";

export default function MainWorkspace({
  input,
  selectedMode,
  isLoading,
  errorMessage,
  onInputChange,
  onModeChange,
  onAnalyze,
}: {
  input: string;
  selectedMode: AnalysisMode;
  isLoading: boolean;
  errorMessage: string | null;
  onInputChange: (value: string) => void;
  onModeChange: (mode: AnalysisMode) => void;
  onAnalyze: () => void;
}) {
  return (
    <main className="bg-slate-50 p-6 overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Main Screen Title</h1>
      </header>
      <section className="bg-white p-6 rounded-lg shadow-sm min-h-[1000px]">
        <div className="text-slate-600">
          <select
            value={selectedMode}
            onChange={(e) => onModeChange(e.target.value as AnalysisMode)}
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
            onChange={(e) => onInputChange(e.target.value)}
            className="border p-2 rounded w-full mb-4"
            placeholder="Type something..."
          />
          <button
            onClick={onAnalyze}
            disabled={isLoading}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {isLoading ? "Analyzing..." : "Submit"}
          </button>
          {errorMessage && (
            <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
          )}
        </div>
      </section>
    </main>
  );
}
