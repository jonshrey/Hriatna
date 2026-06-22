import { AwarenessResult } from "@/types";
export default function ResultPanel({
  result,
  isLoading,
}: {
  result: AwarenessResult | null;
  sessionMemory: string[];
  isLoading: boolean;
}) {
  return (
    <section className="bg-white border-l border-slate-200 p-6 overflow-y-auto">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Analysis Result
      </h3>

      {isLoading ? (
        <p className="text-sm text-slate-500">Analyzing...</p>
      ) : result ? (
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
          <p>
            <strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%
          </p>
          <section className="mt-4">
            {result.observations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Observations:</h4>
                <ul className="list-disc list-inside">
                  {result.observations.map((obs) => (
                    <li key={obs.id} className="text-sm">
                      <strong>{obs.label}:</strong> {obs.description}{" "}
                      (Confidence: {(obs.confidence * 100).toFixed(1)}%)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
          <section className="mt-4">
            {result.suggestedActions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Suggested Actions:</h4>
                <ul className="list-disc list-inside">
                  {result.suggestedActions.map((action) => (
                    <li key={action.id} className="text-sm">
                      <strong>{action.title}:</strong> {action.description}{" "}
                      (Priority: {action.priority})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
          <section className="mt-4">
            <h4 className="font-semibold mb-2">Memory Update:</h4>
            <p className="text-sm bg-white p-2 rounded border border-slate-200">
              {result.memoryUpdate}
            </p>
          </section>
        </div>
      ) : (
        <p className="text-sm text-slate-500">No analysis yet.</p>
      )}
    </section>
  );
}
