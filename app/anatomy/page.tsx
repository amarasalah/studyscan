"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { FileSearch, ScanLine } from "lucide-react";

const AnatomyViewer = dynamic(() => import("@/components/anatomy/AnatomyViewer"), {
  ssr: false,
  loading: () => (
    <div style={{ display: "grid", placeItems: "center", height: "calc(100vh - 57px)", background: "#2b2d44", color: "#fff", fontSize: 16 }}>
      Loading 3D model…
    </div>
  ),
});

export default function AnatomyPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Shared header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", height: 57, flexShrink: 0, zIndex: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg,#10b981,#0d9488)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FileSearch size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>RegenScan</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Scientific Study Analyzer</div>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 4 }}>
          <Link href="/" style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 16px", borderRadius: 8, textDecoration: "none",
            fontSize: 13, fontWeight: 600, color: "#64748b",
            transition: "all .15s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#1e293b"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#64748b"; }}
          >
            <ScanLine size={15} />
            Scanner
          </Link>
          <Link href="/anatomy" style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 16px", borderRadius: 8, textDecoration: "none",
            fontSize: 13, fontWeight: 600,
            background: "linear-gradient(135deg,#10b981,#0d9488)",
            color: "#fff",
          }}>
            🦴 3D Anatomy
          </Link>
        </nav>
      </header>

      {/* Full-screen 3D viewer */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <AnatomyViewer />
      </div>
    </div>
  );
}
