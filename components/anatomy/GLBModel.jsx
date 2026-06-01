"use client";

import { useMemo, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { HIGHLIGHT_COLOR } from "./structures";

const KNEE_MESHES = new Set([
  "Patella.r", "Femur.r", "Tibia.r",
  "Art cart of femur distal end.r", "Art cart of patella.r",
  "Art cart of tibia proximal end.r", "Anterior cruciate ligament.r",
  "Posterior cruciate ligament.r", "Lateral meniscus.r", "Medial meniscus.r",
  "Synovial membranes of knee.r", "Articular capsule of knee joint.r",
  "Lateral patellar retinaculum (horizontal part).r",
  "Lateral patellar retinaculum (vertical part).r",
  "Medial patellar retinaculum (horizontal part).r",
  "Medial patellar retinaculum (vertical part).r",
  "Fibular collateral ligament.r", "Infrapatellar fat pad.r",
  "Quadriceps common tendon and patellar ligament.r",
]);

const KNEE_TINT = new THREE.Color("#00e5ff");
const HIGHLIGHT = new THREE.Color(HIGHLIGHT_COLOR);
const BLACK = new THREE.Color(0x000000);

export default function GLBModel({ url, selected, hovered, xray, kneeMode, onSelect, onHover }) {
  const { scene } = useGLTF(url);

  const root = useMemo(() => {
    const r = scene.clone(true);
    r.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(r);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = 6 / maxDim;
    r.scale.setScalar(s);
    r.position.set(-center.x * s, -center.y * s + 0.4, -center.z * s);
    return r;
  }, [scene]);

  const meshes = useMemo(() => {
    const list = [];
    root.traverse((o) => {
      if (!o.isMesh) return;
      o.material = Array.isArray(o.material)
        ? o.material.map((mm) => mm.clone())
        : o.material.clone();
      const first = Array.isArray(o.material) ? o.material[0] : o.material;
      o.userData.baseColor = first.color ? first.color.clone() : new THREE.Color("#cccccc");
      o.userData.baseOpacity = first.opacity ?? 1;
      list.push(o);
    });
    return list;
  }, [root]);

  useEffect(() => {
    meshes.forEach((m) => {
      const isSel  = m.name === selected;
      const isHov  = m.name === hovered;
      const isKnee = KNEE_MESHES.has(m.name);
      const base   = m.userData.baseColor;
      const baseOp = m.userData.baseOpacity ?? 1;
      const mats   = Array.isArray(m.material) ? m.material : [m.material];
      mats.forEach((mat) => {
        if (mat.color) {
          if (isSel)                   mat.color.copy(HIGHLIGHT);
          else if (isHov)              mat.color.copy(base).lerp(HIGHLIGHT, 0.35);
          else if (kneeMode && isKnee) mat.color.copy(base).lerp(KNEE_TINT, 0.4);
          else                         mat.color.copy(base);
        }
        if (mat.emissive) {
          if (isSel)                   { mat.emissive.copy(HIGHLIGHT); mat.emissiveIntensity = 0.45; }
          else if (kneeMode && isKnee) { mat.emissive.copy(KNEE_TINT); mat.emissiveIntensity = 0.25; }
          else                         { mat.emissive.copy(BLACK);     mat.emissiveIntensity = 0; }
        }
        if (kneeMode && !isKnee && !isSel) {
          mat.transparent = true; mat.opacity = 0.08; mat.depthWrite = false;
        } else if (xray && !isSel) {
          mat.transparent = true; mat.opacity = 0.18; mat.depthWrite = false;
        } else {
          mat.opacity = baseOp; mat.transparent = baseOp < 1; mat.depthWrite = true;
        }
        mat.needsUpdate = true;
      });
    });
  }, [meshes, selected, hovered, xray, kneeMode]);

  return (
    <primitive
      object={root}
      onPointerDown={(e) => { e.stopPropagation(); onSelect(e.object.name || null); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(e.object.name || null); document.body.style.cursor = "pointer"; }}
      onPointerOut={(e) => { e.stopPropagation(); onHover(null); document.body.style.cursor = "auto"; }}
    />
  );
}
