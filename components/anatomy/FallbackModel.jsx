"use client";

import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { HIGHLIGHT_COLOR } from "./structures";

const HIGHLIGHT = new THREE.Color(HIGHLIGHT_COLOR);

const PARTS = [
  { name: "Pelvis",        geo: ["ell"],        pos: [0, 3.05, -0.05],  scale: [0.95, 0.6, 0.72],  color: "#ece4d2" },
  { name: "Femur",         geo: ["bone", 0.13, 2.7], pos: [0.05, 1.5, -0.04],                      color: "#ece4d2" },
  { name: "Patella",       geo: ["ell"],        pos: [0.05, 0.12, 0.4], scale: [0.18, 0.2, 0.14],  color: "#f1ead9" },
  { name: "Tibia",         geo: ["bone", 0.12, 2.45], pos: [0.0, -1.18, 0.03],                     color: "#ece4d2" },
  { name: "Foot",          geo: ["ell"],        pos: [0.0, -2.52, 0.42], scale: [0.3, 0.2, 0.78],  rot: [0.22, 0, 0], color: "#ece4d2" },
  { name: "Quadriceps",    geo: ["ell"],        pos: [0.06, 1.55, 0.2],  scale: [0.52, 1.2, 0.5],  color: "#bf5a4b" },
  { name: "Hamstrings",    geo: ["ell"],        pos: [-0.02, 1.5, -0.34], scale: [0.46, 1.18, 0.42], color: "#a84d40" },
  { name: "Gastrocnemius", geo: ["ell"],        pos: [0.0, -0.92, -0.24], scale: [0.42, 0.95, 0.4], color: "#bf5a4b" },
  { name: "FasciaLata",    geo: ["limb"],       pos: [0, 0, 0],           color: "#c9a24b", opacity: 0.2 },
];

function profileGeo(profile, segs) {
  const pts = profile.map(([y, r]) => new THREE.Vector2(Math.max(r, 0.001), y));
  return new THREE.LatheGeometry(pts, segs);
}

function buildGeo([kind, a, b]) {
  if (kind === "ell") return new THREE.SphereGeometry(1, 32, 24);
  if (kind === "bone") {
    const r = a, h = b / 2;
    return profileGeo(
      [[-h, 0.001], [-h, r*1.7], [-h+0.18, r*1.45], [-h+0.45, r], [0, r*0.9],
       [h-0.45, r], [h-0.18, r*1.45], [h, r*1.7], [h, 0.001]], 24);
  }
  return profileGeo(
    [[-2.5, 0.001], [-2.42, 0.3], [-1.95, 0.34], [-1.0, 0.58], [-0.25, 0.42],
     [0.1, 0.46], [0.65, 0.64], [1.5, 0.84], [2.6, 0.8], [3.15, 0.6], [3.25, 0.001]], 48);
}

export default function FallbackModel({ selected, hovered, xray, onSelect, onHover }) {
  const group = useRef();
  const parts = useMemo(() => PARTS.map((p) => {
    const mesh = new THREE.Mesh(buildGeo(p.geo), new THREE.MeshStandardMaterial({
      color: new THREE.Color(p.color), roughness: 0.78, metalness: 0.05,
      transparent: p.opacity != null, opacity: p.opacity ?? 1, side: THREE.DoubleSide,
    }));
    mesh.name = p.name;
    mesh.position.set(...p.pos);
    if (p.scale) mesh.scale.set(...p.scale);
    if (p.rot) mesh.rotation.set(...p.rot);
    mesh.userData.baseColor = new THREE.Color(p.color);
    mesh.userData.baseOpacity = p.opacity ?? 1;
    return mesh;
  }), []);

  useEffect(() => {
    parts.forEach((m) => {
      const isSel = m.name === selected, isHov = m.name === hovered;
      const base = m.userData.baseColor;
      if (isSel) m.material.color.copy(HIGHLIGHT);
      else if (isHov) m.material.color.copy(base).lerp(HIGHLIGHT, 0.35);
      else m.material.color.copy(base);
      m.material.emissive.copy(isSel ? HIGHLIGHT : new THREE.Color(0x000000));
      m.material.emissiveIntensity = isSel ? 0.45 : 0;
      const baseOp = m.userData.baseOpacity;
      if (xray && !isSel) { m.material.transparent = true; m.material.opacity = Math.min(baseOp, 0.16); }
      else { m.material.opacity = baseOp; m.material.transparent = baseOp < 1; }
    });
  }, [parts, selected, hovered, xray]);

  return (
    <group ref={group}>
      {parts.map((m) => (
        <primitive key={m.name} object={m}
          onPointerDown={(e) => { e.stopPropagation(); onSelect(m.name); }}
          onPointerOver={(e) => { e.stopPropagation(); onHover(m.name); document.body.style.cursor = "pointer"; }}
          onPointerOut={(e) => { e.stopPropagation(); onHover(null); document.body.style.cursor = "auto"; }}
        />
      ))}
    </group>
  );
}
