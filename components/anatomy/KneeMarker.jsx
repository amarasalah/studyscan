"use client";

import { Html } from "@react-three/drei";

export default function KneeMarker({ position, active, onClick }) {
  return (
    <Html position={position} center occlude={false} zIndexRange={[10, 20]} style={{ pointerEvents: "none" }}>
      <div style={{ pointerEvents: "all", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div style={{
          width: 14, height: 14, borderRadius: "50%",
          background: active ? "#43e35b" : "#00e5ff",
          boxShadow: active
            ? "0 0 0 4px rgba(67,227,91,.35), 0 0 16px rgba(67,227,91,.6)"
            : "0 0 0 4px rgba(0,229,255,.3), 0 0 16px rgba(0,229,255,.5)",
          animation: "knee-pulse 1.6s ease-in-out infinite",
        }} />
        <button onClick={onClick} style={{
          background: active ? "linear-gradient(135deg,#43e35b,#1ecb42)" : "linear-gradient(135deg,#00c4d9,#0086a8)",
          border: "none", borderRadius: 20, padding: "5px 13px", color: "#fff",
          fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
          boxShadow: "0 2px 10px rgba(0,0,0,.5)", letterSpacing: 0.4, transition: "transform .15s",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          🦴 Knee Joint
        </button>
        <div style={{
          width: 2, height: 18,
          background: active ? "linear-gradient(#43e35b,transparent)" : "linear-gradient(#00e5ff,transparent)",
          borderRadius: 1, order: -1,
        }} />
      </div>
      <style>{`@keyframes knee-pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.35);opacity:.75} }`}</style>
    </Html>
  );
}
