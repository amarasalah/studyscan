"use client";

function Btn({ children, title, active, onClick }) {
  return (
    <button title={title} onClick={onClick} style={{
      width: 48, height: 48, borderRadius: "50%", border: "none", cursor: "pointer",
      color: "#fff", fontSize: 20,
      background: active ? "#1e5fd0" : "#3a7bd5",
      boxShadow: "0 2px 6px rgba(0,0,0,.35)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {children}
    </button>
  );
}

export default function ControlRail(props) {
  return (
    <div style={{ position: "absolute", top: 16, right: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <Btn title="Reset view" onClick={props.onHome}>⌂</Btn>
      <Btn title="Auto-rotate" active={props.autoRotate} onClick={props.onToggleRotate}>↻</Btn>
      <Btn title="X-ray" active={props.xray} onClick={props.onToggleXray}>◍</Btn>
      <Btn title="Zoom in" onClick={props.onZoomIn}>＋</Btn>
      <Btn title="Zoom out" onClick={props.onZoomOut}>－</Btn>
      <Btn title="Rotate left" onClick={props.onRotateLeft}>↺</Btn>
      <Btn title="Rotate right" onClick={props.onRotateRight}>↻</Btn>
    </div>
  );
}
