"use client";

import { useEffect, useRef, useState } from "react";

export default function CameraInput({
  onFrameCapture,
}: {
  onFrameCapture: (frameDataUrl: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastCapturedAt, setLastCapturedAt] = useState<string | null>(null);

  async function startCamera() {
    try {
      setErrorMessage(null);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setIsCameraOn(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setErrorMessage("Unable to access camera. Please check permissions.");
    }
  }

  function cleanupCamera(videoElement: HTMLVideoElement | null) {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoElement) {
      videoElement.srcObject = null;
    }
  }

  function stopCamera() {
    cleanupCamera(videoRef.current);
    setIsCameraOn(false);
  }

  function captureCurrentFrame() {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;

    if (!videoElement || !canvasElement) {
      return;
    }

    if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      return;
    }

    const context = canvasElement.getContext("2d");

    if (!context) {
      return;
    }

    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    context.drawImage(
      videoElement,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    const frameDataUrl = canvasElement.toDataURL("image/jpeg", 0.7);

    onFrameCapture(frameDataUrl);
    setLastCapturedAt(new Date().toLocaleTimeString());
  }

  useEffect(() => {
    if (!isCameraOn) {
      return;
    }

    const intervalId = window.setInterval(() => {
      captureCurrentFrame();
    }, 2000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isCameraOn]);

  useEffect(() => {
    const videoElement = videoRef.current;

    return () => {
      cleanupCamera(videoElement);
    };
  }, []);

  return (
    <div className="mb-4 rounded border border-dashed border-slate-300 bg-slate-50 p-4">
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={startCamera}
          disabled={isCameraOn}
          className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Camera
        </button>

        <button
          type="button"
          onClick={stopCamera}
          disabled={!isCameraOn}
          className="rounded border px-3 py-2 text-sm text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Stop Camera
        </button>
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="min-h-[220px] w-full rounded bg-black object-cover"
      />

      <canvas ref={canvasRef} className="hidden" />

      <p className="mt-3 text-xs text-slate-500">
        {isCameraOn
          ? lastCapturedAt
            ? `Latest frame captured at ${lastCapturedAt}`
            : "Camera running. Waiting for first frame..."
          : "Camera is off."}
      </p>

      {errorMessage && (
        <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}