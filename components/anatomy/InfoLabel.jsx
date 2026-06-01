"use client";

import { metaFor, TYPE_COLORS } from "./structures";

export default function InfoLabel({ name }) {
  if (!name) return null;
  const { label, type } = metaFor(name);
  return (
    <div style={{
      position: "absolute", top: 16, left: 16, minWidth: 220,
      background: "#1577b8", borderRadius: 8, padding: "12px 18px",
      boxShadow: "0 4px 16px rgba(0,0,0,.4)", pointerEvents: "none",
    }}>
      <div style={{ fontSize: 20, fontWeight: 600, color: "#fff" }}>{label}</div>
      <div style={{ fontSize: 14, opacity: 0.9, marginTop: 2, color: TYPE_COLORS[type] || "#fff" }}>{type}</div>
    </div>
  );
}
