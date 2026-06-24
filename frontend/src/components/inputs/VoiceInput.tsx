"use client";

import { useRef, useState } from "react";

type SpeechRecognitionConstructor = new () => SpeechRecognition;

type SpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult:
    | ((event: {
        results: {
          [index: number]: {
            [index: number]: {
              transcript: string;
            };
            isFinal: boolean;
          };
          length: number;
        };
      }) => void)
    | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default function VoiceInput({
  onTranscriptChange,
}: {
  onTranscriptChange: (transcript: string) => void;
}) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function startListening() {
    const SpeechRecognitionApi =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionApi) {
      setErrorMessage(
        "Speech recognition is not supported in this browser. Try Chrome."
      );
      return;
    }

    setErrorMessage(null);

    const recognition = new SpeechRecognitionApi();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      let currentTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }

      setTranscript(currentTranscript);
      onTranscriptChange(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setErrorMessage("Unable to use microphone/speech recognition.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    setIsListening(false);
  }

  return (
    <div className="mb-4 rounded border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={startListening}
          disabled={isListening}
          className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Listening
        </button>

        <button
          type="button"
          onClick={stopListening}
          disabled={!isListening}
          className="rounded border px-3 py-2 text-sm text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Stop Listening
        </button>
      </div>

      <p className="text-xs text-slate-500">
        {isListening
          ? "Listening... speak your question."
          : "Voice input is off."}
      </p>

      {transcript && (
        <p className="mt-3 rounded bg-white p-3 text-sm text-slate-700">
          {transcript}
        </p>
      )}

      {errorMessage && (
        <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}