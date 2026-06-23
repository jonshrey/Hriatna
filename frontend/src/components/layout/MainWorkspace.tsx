import type { AnalysisMode, InputType } from "@/types";
import CameraInput from "@/components/inputs/CameraInput";

const inputSourceOptions = [
  {
    type: "text",
    label: "Text",
    description: "Paste or type text",
  },
  {
    type: "camera",
    label: "Camera",
    description: "Use live camera input",
  },
  {
    type: "image",
    label: "Image",
    description: "Upload an image",
  },
] satisfies {
  type: InputType;
  label: string;
  description: string;
}[];

export default function MainWorkspace({
  input,
  inputType,
  selectedMode,
  isLoading,
  errorMessage,
  onInputChange,
  onModeChange,
  onAnalyze,
  onInputTypeChange,
  onCameraFrameCapture,
}: {
  input: string;
  inputType: InputType;
  selectedMode: AnalysisMode;
  isLoading: boolean;
  errorMessage: string | null;
  onInputChange: (value: string) => void;
  onModeChange: (mode: AnalysisMode) => void;
  onAnalyze: () => void;
  onInputTypeChange: (type: InputType) => void;
  onCameraFrameCapture: (frameDataUrl: string) => void;
}) {
  const styleMap: Record<AnalysisMode, string> = {
    auto: "border p-3 rounded w-full mb-4 min-h-[120px] resize-none bg-gray-50",
    surrounding:
      "border-2 border-blue-400 p-3 rounded-lg w-full mb-4 min-h-[120px] resize-none bg-white",
    screen:
      "border p-3 rounded w-full mb-4 min-h-[250px] resize-none bg-gray-900 text-white",
    document:
      "border border-yellow-600 p-6 rounded w-full mb-4 min-h-[300px] resize-none bg-yellow-50 text-black font-serif",
    code: "border border-gray-700 p-3 rounded w-full mb-4 min-h-[160px] resize-none bg-neutral-900 text-green-400 font-mono",
    sre: "border border-red-500 p-3 rounded w-full mb-4 min-h-[160px] resize-none shadow-[0_0_10px_rgba(239,68,68,0.5)]",
  };

  const placeholderMap: Record<AnalysisMode, string> = {
    auto: "Describe what you see, paste text, logs, code, or ask Hriatna to analyze your context...",
    surrounding:
      "Describe your surroundings or situation. Example: I am looking at my desk and I need help organizing what to do next...",
    screen:
      "Describe your screen or paste visible text from a screenshot. Example: I see an error popup and a failed payment screen...",
    document:
      "Paste document text here. Hriatna will summarize, extract key points, and suggest next actions...",
    code: "Paste code, stack trace, or error logs here. Hriatna will explain the issue and suggest a fix...",
    sre: "Paste production logs, alerts, traces, or incident notes here. Hriatna will look for root cause and next steps...",
  };

  const modeDescriptionMap: Record<AnalysisMode, string> = {
    auto: "Automatically detects whether your input is code, document, logs, or general context.",
    surrounding:
      "Use this for describing your physical surroundings or situation.",
    screen: "Use this for explaining what is visible on your screen.",
    document:
      "Use this for summarizing or extracting action points from document text.",
    code: "Use this for code, stack traces, and debugging help.",
    sre: "Use this for logs, alerts, incidents, and root-cause analysis.",
  };

  function renderInputArea() {
    if (inputType === "text") {
      return (
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          className={styleMap[selectedMode]}
          placeholder={placeholderMap[selectedMode]}
        />
      );
    }

    if (inputType === "camera") {
      return <CameraInput onFrameCapture={onCameraFrameCapture} />;
    }

    const selectedSource = inputSourceOptions.find(
      (option) => option.type === inputType
    );

    return (
      <div className="mb-4 flex min-h-[220px] items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
        {selectedSource?.label} input will appear here
      </div>
    );
  }

  return (
    <main className="bg-slate-50 p-6 overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Context Awareness
        </h1>
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

          <p className="mb-4 text-sm text-slate-500">
            {modeDescriptionMap[selectedMode]}
          </p>

          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-slate-700">
              Input Source
            </p>

            <div className="flex gap-2">
              {inputSourceOptions.map((option) => (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => onInputTypeChange(option.type)}
                  className={
                    inputType === option.type
                      ? "rounded bg-slate-900 px-3 py-2 text-sm text-white"
                      : "rounded border px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {renderInputArea()}

          <button
            onClick={onAnalyze}
            disabled={isLoading}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Analyzing..." : "Analyze"}
          </button>

          {errorMessage && (
            <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
          )}
        </div>
      </section>
    </main>
  );
}