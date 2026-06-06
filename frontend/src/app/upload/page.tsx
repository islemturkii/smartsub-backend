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
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStatus("error");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Upload Transactions</h1>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`bg-white border-2 border-dashed rounded-xl p-8 text-center space-y-4 transition ${
          dragOver ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
        }`}
      >
        <p className="text-gray-500 text-sm">
          Drag &amp; drop a CSV file here, or use the file picker below.
        </p>
        <p className="text-gray-400 text-xs">
          Expected columns: <code className="bg-gray-100 px-1 rounded">date</code>,{" "}
          <code className="bg-gray-100 px-1 rounded">description</code>,{" "}
          <code className="bg-gray-100 px-1 rounded">amount</code>
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
          className="block mx-auto text-sm"
        />
        {file && <p className="text-sm text-gray-700">Selected: {file.name}</p>}
        <button
          onClick={handleUpload}
          disabled={!file || status === "uploading" || status === "detecting"}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-indigo-700 transition"
        >
          {status === "uploading" ? "Uploading…" : status === "detecting" ? "Detecting…" : "Upload & Detect"}
        </button>
      </div>

      {status === "success" && result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
          <p className="font-medium">Import successful!</p>
          <p>{result.transactions_count} transactions imported</p>
          <p>{result.detected_count} subscriptions detected</p>
          <p className="text-xs mt-1">Redirecting to dashboard…</p>
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
          {error}
        </div>
      )}
    </div>
  );
}
