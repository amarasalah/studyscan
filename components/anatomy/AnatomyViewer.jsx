"use client";

import { useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import GLBModel from "./GLBModel";
import ControlRail from "./ControlRail";
import InfoLabel from "./InfoLabel";
import KneePopup from "./KneePopup";
import KneeMarker from "./KneeMarker";
import { metaFor, TYPE_COLORS, STRUCTURE_META } from "./structures";

const MODEL_URL = "/models/lower-limb/lower-limb.glb";

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

const KNEE_TARGET = new THREE.Vector3(0, -0.05, 0.3);

export default function AnatomyViewer() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [xray, setXray] = useState(false);
  const [kneeMode, setKneeMode] = useState(false);
  const [kneePopup, setKneePopup] = useState(false);
  const kneeTimerRef = useRef(null);
  const controlsRef = useRef();

  const handleMissed = useCallback(() => setSelected(null), []);

  const zoomToKnee = useCallback(() => {
    const c = controlsRef.current;
    if (!c) return;
    c.target.copy(KNEE_TARGET);
    c.object.position.set(2.2, -0.05, 3.2);
    c.update();
    setKneeMode(true);
    setKneePopup(false);
    clearTimeout(kneeTimerRef.current);
    kneeTimerRef.current = setTimeout(() => setKneePopup(true), 420);
  }, []);

  const rotate = (angle) => {
    const c = controlsRef.current; if (!c) return;
    const offset = c.object.position.clone().sub(c.target);
    offset.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle));
    c.object.position.copy(c.target).add(offset); c.update();
  };
  const zoom = (factor) => {
    const c = controlsRef.current; if (!c) return;
    const offset = c.object.position.clone().sub(c.target);
    const len = THREE.MathUtils.clamp(offset.length() * factor, 4, 30);
    offset.setLength(len); c.object.position.copy(c.target).add(offset); c.update();
  };
  const home = () => {
    const c = controlsRef.current; if (!c) return;
    c.object.position.set(6, 1, 9); c.target.set(0, 0.4, 0); c.update(); setSelected(null);
  };
  const closeKneeMode = () => {
    clearTimeout(kneeTimerRef.current);
    setKneeMode(false); setKneePopup(false); setSelected(null); home();
  };

  return (
    <>
      <Canvas camera={{ position: [6, 1, 9], fov: 42 }} onPointerMissed={handleMissed}
        gl={{ antialias: true }} style={{ background: "#2b2d44" }}>
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 6, 8]} intensity={0.9} />
        <directionalLight position={[-5, 2, -4]} intensity={0.35} color="#9fb4ff" />

        <GLBModel url={MODEL_URL} selected={selected} hovered={hovered} xray={xray} kneeMode={kneeMode}
          onSelect={(name) => { setSelected(name); if (KNEE_MESHES.has(name)) zoomToKnee(); }}
          onHover={setHovered}
        />

        <KneeMarker position={[KNEE_TARGET.x, KNEE_TARGET.y, KNEE_TARGET.z]} active={kneeMode} onClick={zoomToKnee} />

        {kneePopup && (
          <KneePopup
            position={[KNEE_TARGET.x + 0.25, KNEE_TARGET.y + 0.2, KNEE_TARGET.z]}
            onClose={closeKneeMode}
          />
        )}

        <OrbitControls ref={controlsRef} makeDefault enableDamping autoRotate={autoRotate}
          autoRotateSpeed={1.2} minDistance={4} maxDistance={30} target={[0, 0.4, 0]} />
      </Canvas>

      <InfoLabel name={selected || hovered} />

      <ControlRail autoRotate={autoRotate} xray={xray}
        onHome={home} onToggleRotate={() => setAutoRotate((v) => !v)}
        onToggleXray={() => setXray((v) => !v)}
        onZoomIn={() => zoom(0.85)} onZoomOut={() => zoom(1.18)}
        onRotateLeft={() => rotate(-0.25)} onRotateRight={() => rotate(0.25)}
      />

      <div style={{ position:"absolute", bottom:16, left:16, right:16, display:"flex", flexWrap:"wrap", gap:8 }}>
        {Object.keys(STRUCTURE_META).map((name) => {
          const { label, type } = metaFor(name);
          const isSel = selected === name;
          return (
            <button key={name} onClick={() => setSelected(name)}
              onMouseEnter={() => setHovered(name)} onMouseLeave={() => setHovered(null)}
              style={{
                border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
                padding:"5px 10px", borderRadius:14, color:"#13203a",
                background: isSel ? "#43e35b" : (TYPE_COLORS[type] || "#ccc"),
              }}>
              {label}
            </button>
          );
        })}
      </div>

      <a href="https://anatomytool.org/open3dmodel" target="_blank" rel="noreferrer"
        style={{ position:"absolute", top:18, right:76, maxWidth:280, textAlign:"right",
          fontSize:11, lineHeight:1.3, color:"rgba(255,255,255,.55)", textDecoration:"none" }}>
        3D model: LUMC &quot;Open 3D Man&quot; (lower limb) · CC-licensed
      </a>
    </>
  );
}
