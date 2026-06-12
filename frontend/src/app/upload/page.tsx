"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { uploadCsv, detectSubscriptions } from "@/services/api";

type Status = "idle" | "uploading" | "detecting" | "success" | "error";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<{ transactions_count: number; detected_count: number } | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File | null) => {
    if (f && f.name.endsWith(".csv")) setFile(f);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0] || null);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    setError("");
    try {
      const importRes = await uploadCsv(file);
      setStatus("detecting");
      const detectRes = await detectSubscriptions(importRes.import_id);
      setResult({
        transactions_count: importRes.transactions_count,
        detected_count: detectRes.detected_count,
      });
      setStatus("success");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStatus("error");
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Upload Transactions</h1>
        <p className="text-sm text-gray-500">Import a CSV file from your bank to detect recurring subscriptions.</p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-10 text-center space-y-4 transition cursor-pointer ${
          dragOver ? "border-indigo-500 bg-indigo-50" : file ? "border-green-300 bg-green-50" : "border-gray-300 bg-white"
        }`}
        onClick={() => document.getElementById("csv-input")?.click()}
      >
        <div className="text-4xl">{file ? "✅" : "📄"}</div>
        {file ? (
          <div>
            <p className="font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500 mt-1">Ready to upload</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 font-medium">Drop your CSV file here</p>
            <p className="text-sm text-gray-400 mt-1">or click to browse</p>
          </div>
        )}
        <input
          id="csv-input"
          type="file"
          accept=".csv"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
          className="hidden"
        />
      </div>

      {/* Format hint */}
      <div className="bg-gray-50 border rounded-lg p-3 text-xs text-gray-500">
        <p className="font-medium text-gray-700 mb-1">Expected CSV format:</p>
        <code className="text-xs">date, description, amount</code>
        <p className="mt-1">Example: <code>2025-01-05, Netflix, 15.99</code></p>
      </div>

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!file || status === "uploading" || status === "detecting"}
        className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-indigo-700 transition shadow-md shadow-indigo-200"
      >
        {status === "uploading" ? "⏳ Uploading…" : status === "detecting" ? "🔍 Detecting subscriptions…" : "Upload & Detect Subscriptions"}
      </button>

      {/* Success */}
      {status === "success" && result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-1">
          <p className="font-semibold text-green-800">✓ Import successful!</p>
          <p className="text-sm text-green-700">{result.transactions_count} transactions imported</p>
          <p className="text-sm text-green-700">{result.detected_count} subscriptions detected</p>
          <p className="text-xs text-green-600 mt-2">Redirecting to dashboard…</p>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="font-semibold text-red-800">✗ Import failed</p>
          <p className="text-sm text-red-700 mt-1">{error}</p>
          <button onClick={() => setStatus("idle")} className="text-xs text-red-600 underline mt-2">
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
