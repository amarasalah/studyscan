"use client";

import { useState } from "react";
import { AnalysisResult } from "@/lib/types";
import {
  CheckCircle2,
  AlertCircle,
  BookOpen,
  FlaskConical,
  Stethoscope,
  Package,
  TrendingUp,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Calendar,
  Users,
  Hash,
  Lightbulb,
  Microscope,
  MessageSquareQuote,
  Presentation,
  HeartPulse,
  Zap,
  Target,
  ChevronRight,
} from "lucide-react";

interface ResultCardProps {
  result: AnalysisResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  return (
    <div className="w-full space-y-5 animate-fade-in-up">
      {/* Publication Status */}
      <div className={`rounded-2xl border-2 p-6 ${
        result.isPublished
          ? "border-emerald-200 bg-emerald-50"
          : "border-orange-200 bg-orange-50"
      }`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            result.isPublished ? "bg-emerald-500 text-white" : "bg-orange-400 text-white"
          }`}>
            {result.isPublished ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-lg ${result.isPublished ? "text-emerald-800" : "text-orange-800"}`}>
              {result.isPublished ? "Published Study" : "Not Published / Unverified"}
            </h3>
            {result.isPublished && result.publishingReference && (
              <p className="text-emerald-700 text-sm mt-1 leading-relaxed">{result.publishingReference}</p>
            )}
            {!result.isPublished && (
              <p className="text-orange-700 text-sm mt-1">
                This document does not appear to be a peer-reviewed published study.
              </p>
            )}
          </div>
        </div>

        {result.isPublished && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {result.journalName && (
              <div className="bg-white/70 rounded-xl px-4 py-3 flex items-start gap-2">
                <BookOpen size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Journal</p>
                  <p className="text-sm text-slate-700 font-medium mt-0.5">{result.journalName}</p>
                </div>
              </div>
            )}
            {result.publicationYear && (
              <div className="bg-white/70 rounded-xl px-4 py-3 flex items-start gap-2">
                <Calendar size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Year</p>
                  <p className="text-sm text-slate-700 font-medium mt-0.5">{result.publicationYear}</p>
                </div>
              </div>
            )}
            {result.doi && (
              <div className="bg-white/70 rounded-xl px-4 py-3 flex items-start gap-2">
                <Hash size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">DOI</p>
                  <a
                    href={`https://doi.org/${result.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-emerald-700 font-medium mt-0.5 flex items-center gap-1 hover:underline"
                  >
                    {result.doi} <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            )}
            {result.authors && (
              <div className="bg-white/70 rounded-xl px-4 py-3 flex items-start gap-2 sm:col-span-3">
                <Users size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Authors</p>
                  <p className="text-sm text-slate-700 mt-0.5">{result.authors}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RegenLab Verdict */}
      <div className={`rounded-2xl border-2 p-6 ${
        result.inFavorOfRegenLab === true
          ? "border-blue-200 bg-blue-50"
          : result.inFavorOfRegenLab === false
          ? "border-red-200 bg-red-50"
          : "border-slate-200 bg-slate-50"
      }`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            result.inFavorOfRegenLab === true
              ? "bg-blue-500 text-white"
              : result.inFavorOfRegenLab === false
              ? "bg-red-500 text-white"
              : "bg-slate-400 text-white"
          }`}>
            {result.inFavorOfRegenLab === true ? (
              <ThumbsUp size={24} />
            ) : result.inFavorOfRegenLab === false ? (
              <ThumbsDown size={24} />
            ) : (
              <Minus size={24} />
            )}
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-lg ${
              result.inFavorOfRegenLab === true
                ? "text-blue-800"
                : result.inFavorOfRegenLab === false
                ? "text-red-800"
                : "text-slate-700"
            }`}>
              {result.inFavorOfRegenLab === true
                ? "In Favor of RegenLab / RegenPRP"
                : result.inFavorOfRegenLab === false
                ? "Not in Favor of RegenLab / RegenPRP"
                : "Not Related to RegenLab / RegenPRP"}
            </h3>
            {result.inFavorOfRegenLab === true && result.favorReason && (
              <p className="text-blue-700 text-sm mt-1 leading-relaxed">{result.favorReason}</p>
            )}
            {result.inFavorOfRegenLab === false && result.againstReason && (
              <p className="text-red-700 text-sm mt-1 leading-relaxed">{result.againstReason}</p>
            )}
            {result.inFavorOfRegenLab === null && (
              <p className="text-slate-600 text-sm mt-1">
                This study does not specifically evaluate RegenLab or RegenPRP products.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {result.summary && (
        <div>
          <SectionHeader icon={<FlaskConical size={18} />} color="emerald" title="Study Summary" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SummaryCard icon={<Stethoscope size={18} />} label="Pathology / Indication" color="purple" content={result.summary.pathology} />
            <SummaryCard icon={<Package size={18} />} label="Product Used" color="amber" content={result.summary.productUsed} />
            <SummaryCard icon={<FlaskConical size={18} />} label="Protocol" color="teal" content={result.summary.protocol} />
            <SummaryCard icon={<TrendingUp size={18} />} label="Results" color="indigo" content={result.summary.results} />
          </div>
        </div>
      )}

      {/* Why → Evidence → Clinical Impact → Take Home Message */}
      {result.whyEvidenceImpact && (
        <div className="rounded-2xl border border-violet-200 bg-violet-50 overflow-hidden">
          <div className="px-5 py-4 bg-violet-600 flex items-center gap-3">
            <Lightbulb size={18} className="text-white" />
            <span className="font-bold text-white text-sm uppercase tracking-wider">Why → Evidence → Impact → Take Home</span>
          </div>
          <div className="p-5 space-y-4">
            <FrameworkRow num="1" label="Pourquoi cette étude est importante ?" color="violet">
              <p className="text-slate-700 text-sm leading-relaxed">{result.whyEvidenceImpact.whyImportant}</p>
            </FrameworkRow>
            <FrameworkRow num="2" label="Quelle est la preuve ?" color="violet">
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  { k: "Type", v: result.whyEvidenceImpact.studyDesign.type },
                  { k: "Patients", v: result.whyEvidenceImpact.studyDesign.patientCount },
                  { k: "Population", v: result.whyEvidenceImpact.studyDesign.population },
                  { k: "Critère principal", v: result.whyEvidenceImpact.studyDesign.primaryEndpoint },
                ].map(({ k, v }) => (
                  <div key={k} className="bg-white rounded-xl p-3 border border-violet-100">
                    <p className="text-xs text-violet-500 font-semibold uppercase tracking-wide">{k}</p>
                    <p className="text-sm text-slate-700 mt-0.5 font-medium">{v || "—"}</p>
                  </div>
                ))}
              </div>
            </FrameworkRow>
            <FrameworkRow num="3" label="Résultats clés" color="violet">
              <ul className="space-y-1.5 mt-1">
                {(result.whyEvidenceImpact.keyFindings || []).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <ChevronRight size={14} className="text-violet-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </FrameworkRow>
            <FrameworkRow num="4" label="Impact clinique" color="violet">
              <p className="text-slate-700 text-sm leading-relaxed">{result.whyEvidenceImpact.clinicalImpact}</p>
            </FrameworkRow>
            <div className="bg-violet-600 rounded-xl px-4 py-3 flex items-start gap-3">
              <MessageSquareQuote size={18} className="text-white flex-shrink-0 mt-0.5" />
              <p className="text-white text-sm font-semibold italic leading-relaxed">&quot;{result.whyEvidenceImpact.takeHomeMessage}&quot;</p>
            </div>
          </div>
        </div>
      )}

      {/* Pain → Evidence → Solution → Benefit */}
      {result.painEvidenceSolution && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 overflow-hidden">
          <div className="px-5 py-4 bg-rose-600 flex items-center gap-3">
            <HeartPulse size={18} className="text-white" />
            <span className="font-bold text-white text-sm uppercase tracking-wider">Pain → Evidence → Solution → Benefit</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Pain", icon: <HeartPulse size={16} />, value: result.painEvidenceSolution.pain, color: "bg-rose-100 text-rose-700 border-rose-200" },
              { label: "Evidence", icon: <Microscope size={16} />, value: result.painEvidenceSolution.evidence, color: "bg-orange-100 text-orange-700 border-orange-200" },
              { label: "Solution", icon: <Zap size={16} />, value: result.painEvidenceSolution.solution, color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
              { label: "Benefit", icon: <TrendingUp size={16} />, value: result.painEvidenceSolution.benefit, color: "bg-blue-100 text-blue-700 border-blue-200" },
            ].map(({ label, icon, value, color }) => (
              <div key={label} className={`rounded-xl border p-4 bg-white`}>
                <div className={`flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider ${color.split(" ")[1]}`}>
                  {icon} {label}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{value || "—"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* So What? */}
      {result.soWhat && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 overflow-hidden">
          <div className="px-5 py-4 bg-amber-500 flex items-center gap-3">
            <Target size={18} className="text-white" />
            <span className="font-bold text-white text-sm uppercase tracking-wider">The &quot;So What?&quot; Model</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-amber-200 p-4">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Study Result</p>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{result.soWhat.studyResult}</p>
            </div>
            <div className="bg-amber-500 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-100 uppercase tracking-wider mb-2">So What?</p>
              <p className="text-sm text-white leading-relaxed font-medium">{result.soWhat.soWhat}</p>
            </div>
          </div>
        </div>
      )}

      {/* Impacting Scientific Communication */}
      {result.impactingCommunication && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 overflow-hidden">
          <div className="px-5 py-4 bg-sky-700 flex items-center gap-3">
            <Presentation size={18} className="text-white" />
            <span className="font-bold text-white text-sm uppercase tracking-wider">Impacting Scientific Communication</span>
          </div>
          <div className="p-5 space-y-3">
            {[
              { label: "Why This Study Matters", value: result.impactingCommunication.whyMatters, icon: <Lightbulb size={15} /> },
              { label: "Study Design", value: result.impactingCommunication.studyDesign, icon: <Microscope size={15} /> },
              { label: "Key Findings", value: result.impactingCommunication.keyFindings, icon: <TrendingUp size={15} /> },
              { label: "Clinical Relevance", value: result.impactingCommunication.clinicalRelevance, icon: <Stethoscope size={15} /> },
              { label: "What Should Clinicians Do Differently Tomorrow?", value: result.impactingCommunication.clinicianAction, icon: <Target size={15} /> },
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-white rounded-xl border border-sky-100 p-4 flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">{icon}</span>
                <div>
                  <p className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{value || "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Upload Section */}
      <VideoUploadSection result={result} />
    </div>
  );
}

// Video Upload Component
function VideoUploadSection({ result }: { result: AnalysisResult }) {
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(result.videoUrl || "");

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      alert("Please upload a video file");
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      alert("Video file too large. Max 100MB allowed.");
      return;
    }

    setUploading(true);
    try {
      // Get upload signature from server
      const sigRes = await fetch("/api/upload-signature", { method: "POST" });
      if (!sigRes.ok) throw new Error("Failed to get upload signature");
      const { signature, timestamp, folder, cloudName, apiKey } = await sigRes.json();

      // Upload directly to Cloudinary (bypasses Vercel 4.5MB limit)
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("api_key", apiKey);
      uploadData.append("timestamp", timestamp.toString());
      uploadData.append("signature", signature);
      uploadData.append("folder", folder);

      const uploadRes = await fetch(cloudinaryUrl, {
        method: "POST",
        body: uploadData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.text();
        throw new Error(`Cloudinary upload failed: ${errorData}`);
      }

      const uploadResult = await uploadRes.json();

      // Update Firestore with video URL
      const { doc, updateDoc, db } = await import("@/lib/firebase");
      await updateDoc(doc(db, "analyses", result.id), {
        videoUrl: uploadResult.secure_url,
      });

      setVideoUrl(uploadResult.secure_url);
      alert("Video uploaded successfully!");
    } catch (err) {
      console.error("Video upload error:", err);
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      alert(`Failed to upload video: ${errorMsg}. Check console for details.`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span className="text-rose-600">🎥</span>
        <span>Video Summary</span>
      </h3>

      {videoUrl ? (
        <div className="space-y-3">
          <video
            src={videoUrl}
            controls
            className="w-full rounded-lg max-h-64 object-cover"
            preload="metadata"
          />
          <p className="text-xs text-slate-500">Video uploaded successfully</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-rose-400 hover:bg-rose-50/30 transition-colors">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              disabled={uploading}
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                {uploading ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <span className="text-xl">🎥</span>
                )}
              </div>
              <span className="text-sm font-medium text-slate-700">
                {uploading ? "Uploading..." : "Click to upload video summary"}
              </span>
              <span className="text-xs text-slate-400">
                MP4, WebM, MOV up to 100MB
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

const colorMap: Record<string, { bg: string; border: string; icon: string; label: string }> = {
  purple: { bg: "bg-purple-50", border: "border-purple-200", icon: "text-purple-600 bg-purple-100", label: "text-purple-700" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", icon: "text-amber-600 bg-amber-100", label: "text-amber-700" },
  teal: { bg: "bg-teal-50", border: "border-teal-200", icon: "text-teal-600 bg-teal-100", label: "text-teal-700" },
  indigo: { bg: "bg-indigo-50", border: "border-indigo-200", icon: "text-indigo-600 bg-indigo-100", label: "text-indigo-700" },
};

function SummaryCard({
  icon,
  label,
  color,
  content,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  content?: string;
}) {
  const c = colorMap[color];
  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-5`}>
      <div className="flex items-center gap-3 mb-3">
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.icon}`}>{icon}</span>
        <p className={`text-xs font-bold uppercase tracking-wider ${c.label}`}>{label}</p>
      </div>
      <p className="text-sm text-slate-700 leading-relaxed">
        {content || <span className="text-slate-400 italic">Not specified</span>}
      </p>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    emerald: "text-emerald-600",
    violet: "text-violet-600",
    rose: "text-rose-600",
    amber: "text-amber-600",
    sky: "text-sky-600",
  };
  return (
    <h3 className={`text-base font-bold text-slate-800 mb-3 flex items-center gap-2 ${colors[color] || ""}`}>
      {icon}
      <span className="text-slate-800">{title}</span>
    </h3>
  );
}

function FrameworkRow({
  num,
  label,
  color,
  children,
}: {
  num: string;
  label: string;
  color: string;
  children: React.ReactNode;
}) {
  const colors: Record<string, { num: string; label: string }> = {
    violet: { num: "bg-violet-600 text-white", label: "text-violet-800" },
    rose: { num: "bg-rose-600 text-white", label: "text-rose-800" },
    sky: { num: "bg-sky-700 text-white", label: "text-sky-800" },
  };
  const c = colors[color] || colors.violet;
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4">
      <div className="flex items-center gap-3 mb-2">
        <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${c.num}`}>
          {num}
        </span>
        <p className={`text-xs font-bold uppercase tracking-wider ${c.label}`}>{label}</p>
      </div>
      {children}
    </div>
  );
}
