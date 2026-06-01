"use client";

import { AnalysisResult } from "@/lib/types";
import { FileText, CheckCircle2, XCircle, ThumbsUp, ThumbsDown, Minus, Trash2, ExternalLink } from "lucide-react";

interface HistoryListProps {
  items: AnalysisResult[];
  onSelect: (item: AnalysisResult) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
}

export default function HistoryList({ items, onSelect, onDelete, selectedId }: HistoryListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <FileText size={24} className="text-slate-400" />
        </div>
        <p className="text-slate-500 text-sm font-medium">No analyses yet</p>
        <p className="text-slate-400 text-xs mt-1">Upload a study to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className={`w-full text-left rounded-xl border p-3.5 transition-all duration-200 group
            ${selectedId === item.id
              ? "border-emerald-400 bg-emerald-50 shadow-sm"
              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
            }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">{item.fileName}</p>
              <p className="text-xs text-slate-400 mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</p>
              <div className="flex items-center gap-2 mt-2">
                {/* Published badge */}
                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                  item.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                }`}>
                  {item.isPublished ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                  {item.isPublished ? "Published" : "Unpublished"}
                </span>
                {/* RegenLab badge */}
                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                  item.inFavorOfRegenLab === true
                    ? "bg-blue-100 text-blue-700"
                    : item.inFavorOfRegenLab === false
                    ? "bg-red-100 text-red-700"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {item.inFavorOfRegenLab === true ? <ThumbsUp size={10} /> : item.inFavorOfRegenLab === false ? <ThumbsDown size={10} /> : <Minus size={10} />}
                  {item.inFavorOfRegenLab === true ? "Pro-Regen" : item.inFavorOfRegenLab === false ? "Against" : "N/A"}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
              className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </button>
      ))}
    </div>
  );
}
