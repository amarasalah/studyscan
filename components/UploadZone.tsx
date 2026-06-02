"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Image, X, Loader2 } from "lucide-react";

interface UploadZoneProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAnalysisComplete: (result: any, fileUrl: string, fileName: string) => void;
}

type Stage = "idle" | "uploading" | "analyzing" | "done" | "error";

export default function UploadZone({ onAnalysisComplete }: UploadZoneProps) {
  const [stage, setStage] = useState<Stage>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const processFile = useCallback(async (file: File) => {
    setSelectedFile(file);
    setErrorMsg("");
    setStage("uploading");
    setProgress(20);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

      setProgress(55);
      setStage("analyzing");

      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: uploadData.url,
          fileName: file.name,
          publicId: uploadData.publicId,
          format: uploadData.format,
        }),
      });

      const analyzeData = await analyzeRes.json();
      if (!analyzeRes.ok) throw new Error(analyzeData.error || "Analysis failed");

      setProgress(100);
      setStage("done");
      onAnalysisComplete(
        { ...analyzeData, fileUrl: uploadData.url, publicId: uploadData.publicId, fileName: file.name },
        uploadData.url,
        file.name
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setErrorMsg(msg);
      setStage("error");
    }
  }, [onAnalysisComplete]);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) processFile(accepted[0]);
    },
    [processFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    },
    maxFiles: 1,
    disabled: stage === "uploading" || stage === "analyzing",
  });

  const reset = () => {
    setStage("idle");
    setSelectedFile(null);
    setErrorMsg("");
    setProgress(0);
  };

  const _isLoading = stage === "uploading" || stage === "analyzing";
  void _isLoading; // used for derived state

  return (
    <div className="w-full">
      {stage === "idle" || stage === "error" ? (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 group
            ${isDragActive
              ? "border-emerald-500 bg-emerald-50 scale-[1.02]"
              : "border-slate-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/30"
            }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
              ${isDragActive ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600"}`}>
              <Upload size={32} />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-700">
                {isDragActive ? "Drop your study here" : "Upload a Scientific Study"}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Drag & drop or click to browse — PDF, JPG, PNG, WEBP
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
                <FileText size={12} /> PDF
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
                <Image size={12} aria-label="Image icon" /> Images
              </span>
            </div>
          </div>
          {stage === "error" && (
            <div className="mt-6 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
              <X size={16} />
              <span>{errorMsg}</span>
              <button onClick={(e) => { e.stopPropagation(); reset(); }} className="ml-auto text-red-400 hover:text-red-600">
                Retry
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-slate-200 rounded-2xl p-10 bg-white text-center">
          <div className="flex flex-col items-center gap-5">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                <circle
                  cx="40" cy="40" r="34"
                  stroke="#10b981" strokeWidth="8" fill="none"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={24} className="text-emerald-500 animate-spin" />
              </div>
            </div>
            <div>
              <p className="font-semibold text-slate-700 text-lg">
                {stage === "uploading" ? "Uploading document..." : "Analyzing study..."}
              </p>
              {selectedFile && (
                <p className="text-sm text-slate-400 mt-1 truncate max-w-xs mx-auto">{selectedFile.name}</p>
              )}
              <p className="text-xs text-slate-400 mt-2">
                {stage === "uploading"
                  ? "Securely uploading your document..."
                  : "Scanning for publication status and RegenLab relevance..."}
              </p>
            </div>
            <div className="w-full max-w-xs bg-slate-100 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
