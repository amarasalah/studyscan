"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { AnalysisResult } from "@/lib/types";
import UploadZone from "@/components/UploadZone";
import ResultCard from "@/components/ResultCard";
import HistoryList from "@/components/HistoryList";
import { FlaskConical, History, Plus, FileSearch, ScanLine } from "lucide-react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

type View = "upload" | "result";

export default function Home() {
  const [view, setView] = useState<View>("upload");
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"analyze" | "history">("analyze");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const snapshot = await getDocs(collection(db, "analyses"));
      const items = snapshot.docs
        .map((d) => ({ ...d.data(), id: d.id } as AnalysisResult))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setHistory(items);
    } catch (e) {
      console.error("Failed to load history:", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAnalysisComplete = async (rawData: any) => {
    const result: AnalysisResult = {
      id: uuidv4(),
      fileName: rawData.fileName,
      fileUrl: rawData.fileUrl,
      cloudinaryPublicId: rawData.publicId,
      createdAt: new Date().toISOString(),
      isPublished: rawData.isPublished ?? false,
      publishingReference: rawData.publishingReference || null,
      journalName: rawData.journalName || null,
      doi: rawData.doi || null,
      authors: rawData.authors || null,
      publicationYear: rawData.publicationYear || null,
      inFavorOfRegenLab: rawData.inFavorOfRegenLab ?? null,
      favorReason: rawData.favorReason || null,
      againstReason: rawData.againstReason || null,
      summary: rawData.summary || null,
      whyEvidenceImpact: rawData.whyEvidenceImpact || null,
      painEvidenceSolution: rawData.painEvidenceSolution || null,
      soWhat: rawData.soWhat || null,
      impactingCommunication: rawData.impactingCommunication || null,
      rawGeminiResponse: rawData.rawGeminiResponse ?? "",
    };

    setCurrentResult(result);
    setView("result");

    setSaving(true);
    try {
      console.log("Saving to Firestore:", result);
      const docRef = await addDoc(collection(db, "analyses"), result);
      console.log("Saved successfully with ID:", docRef.id);
      const saved = { ...result, id: docRef.id };
      setCurrentResult(saved);
      setHistory((prev) => [saved, ...prev]);
    } catch (e) {
      console.error("Failed to save to Firestore:", e);
      const errorMsg = e instanceof Error ? e.message : String(e);
      console.error("Error message:", errorMsg);
      alert(`Failed to save study: ${errorMsg}. Check Firestore rules in Firebase Console.`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "analyses", id));
      setHistory((prev) => prev.filter((h) => h.id !== id));
      if (currentResult?.id === id) {
        setCurrentResult(null);
        setView("upload");
      }
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  const handleSelectHistory = (item: AnalysisResult) => {
    setCurrentResult(item);
    setView("result");
    setActiveTab("analyze");
  };

  const handleNewAnalysis = () => {
    setCurrentResult(null);
    setView("upload");
    setActiveTab("analyze");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
              <FileSearch size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">RegenScan</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Scientific Study Analyzer</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm">
              <ScanLine size={14} />
              Scanner
            </Link>
            <Link href="/anatomy" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
              🦴 3D Anatomy
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8 items-start">
          {/* Sidebar */}
          <aside className="w-72 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-700">
                  <History size={16} />
                  <span className="font-semibold text-sm">Analysis History</span>
                  {history.length > 0 && (
                    <span className="ml-auto bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      {history.length}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                {loadingHistory ? (
                  <div className="space-y-2 p-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 rounded-xl shimmer" />
                    ))}
                  </div>
                ) : (
                  <HistoryList
                    items={history}
                    onSelect={handleSelectHistory}
                    onDelete={handleDelete}
                    selectedId={currentResult?.id}
                  />
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile tabs */}
            <div className="flex gap-2 mb-6 lg:hidden">
              <button
                onClick={() => setActiveTab("analyze")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "analyze"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                Analyze
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "history"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                History ({history.length})
              </button>
            </div>

            {/* Mobile history tab */}
            {activeTab === "history" && (
              <div className="lg:hidden bg-white rounded-2xl border border-slate-200 p-4">
                <HistoryList
                  items={history}
                  onSelect={handleSelectHistory}
                  onDelete={handleDelete}
                  selectedId={currentResult?.id}
                />
              </div>
            )}

            {/* Analyze tab */}
            <div className={activeTab === "history" ? "hidden lg:block" : ""}>
                {view === "upload" ? (
                  <div>
                    {/* Hero */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                        <FlaskConical size={16} />
                        RegenLab Clinical Evidence Scanner
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
                        Scan Any Scientific Study
                      </h2>
                      <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
                        Upload a PDF or image of a study. Our system will check if it{"'"}s published,
                        identify the publishing reference, and evaluate its stance on RegenLab & RegenPRP.
                      </p>
                    </div>
                    <UploadZone onAnalysisComplete={handleAnalysisComplete} />

                    {/* Feature pills */}
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                      {[
                        "Publication verification",
                        "DOI & journal detection",
                        "RegenLab relevance scoring",
                        "Protocol extraction",
                        "Clinical results summary",
                      ].map((f) => (
                        <span
                          key={f}
                          className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Result header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-slate-800">Analysis Result</h2>
                        {currentResult && (
                          <p className="text-sm text-slate-500 mt-0.5 truncate max-w-md">{currentResult.fileName}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {saving && (
                          <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full animate-pulse">
                            Saving...
                          </span>
                        )}
                        <button
                          onClick={handleNewAnalysis}
                          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                        >
                          <Plus size={16} />
                          New Analysis
                        </button>
                      </div>
                    </div>

                    {/* File preview link */}
                    {currentResult?.fileUrl && (
                      <a
                        href={currentResult.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 bg-white border border-slate-200 rounded-xl px-4 py-2.5 mb-5 transition-colors w-fit"
                      >
                        <FileSearch size={16} />
                        View original document
                      </a>
                    )}

                    {currentResult && <ResultCard result={currentResult} />}
                  </div>
                )}
              </div>
          </main>
        </div>
      </div>
    </div>
  );
}
