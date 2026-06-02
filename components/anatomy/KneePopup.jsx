"use client";

import { useEffect, useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const ANATOMY_SECTIONS = [
  { icon: "🦴", title: "Bones", color: "#cdb98f", text: "Formed by the distal femur, proximal tibia, and patella. The patella glides in the femoral trochlear groove during flexion and extension." },
  { icon: "🔗", title: "Ligaments", color: "#bcd07e", text: "ACL, PCL, MCL and LCL stabilise the joint, preventing abnormal translation and rotation under load." },
  { icon: "🩻", title: "Menisci", color: "#9ad0c0", text: "C-shaped fibrocartilage pads that absorb shock and improve congruency between the femoral condyles and the tibial plateau." },
  { icon: "💧", title: "Synovial joint", color: "#7aa0e8", text: "The largest synovial joint in the body — synovial fluid lubricates and nourishes the articular cartilage." },
  { icon: "📐", title: "Range of motion", color: "#e0857a", text: "Flexion 0–135°, full extension (close-packed / most stable), and slight axial rotation when flexed." },
];

export default function KneePopup({ position, onClose }) {
  const cardRef = useRef(null);
  const [tab, setTab] = useState("anatomy");
  const [latestStudy, setLatestStudy] = useState(null);
  const [loadingStudy, setLoadingStudy] = useState(true);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (cardRef.current) cardRef.current.classList.add("kp-visible");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    async function fetchLatest() {
      try {
        const snapshot = await getDocs(collection(db, "analyses"));
        const items = snapshot.docs
          .map((d) => ({ ...d.data(), id: d.id }))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        if (items.length > 0) setLatestStudy(items[0]);
      } catch (e) {
        console.error("Failed to load study for popup:", e);
      } finally {
        setLoadingStudy(false);
      }
    }
    fetchLatest();
  }, []);

  const verdictColor = latestStudy?.inFavorOfRegenLab === true
    ? "#43e35b" : latestStudy?.inFavorOfRegenLab === false ? "#e05a5a" : "#7aa0e8";
  const verdictLabel = latestStudy?.inFavorOfRegenLab === true
    ? "✅ Pro-RegenLab" : latestStudy?.inFavorOfRegenLab === false ? "❌ Against" : "➖ Neutral";

  return (
    <Html position={position} occlude={false} zIndexRange={[30, 50]} style={{ pointerEvents: "none" }}>
      <style>{`
        @keyframes kp-slide-in { from{opacity:0;transform:translateX(-18px) scale(.94)} to{opacity:1;transform:translateX(0) scale(1)} }
        .kp-card { opacity:0; transform:translateX(-18px) scale(.94); transition:none; }
        .kp-card.kp-visible { animation:kp-slide-in 0.38s cubic-bezier(.22,.68,0,1.2) forwards; }
        .kp-section:hover { background:rgba(255,255,255,.07) !important; }
        .kp-close:hover { background:rgba(255,255,255,.18) !important; }
        .kp-tab { background:none; border:none; cursor:pointer; padding:6px 14px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:.5px; color:rgba(255,255,255,.5); transition:all .15s; }
        .kp-tab.active { background:rgba(0,229,255,.15); color:#00e5ff; }
        .kp-tag { display:inline-block; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:700; }
      `}</style>

      {/* Connector line */}
      <div style={{ position:"absolute", left:-48, top:"50%", width:44, height:2,
        background:"linear-gradient(to right,rgba(0,229,255,.15),rgba(0,229,255,.6))",
        transform:"translateY(-50%)", borderRadius:1, pointerEvents:"none" }} />

      <div ref={cardRef} className="kp-card" style={{
        pointerEvents:"all", width:320, maxHeight:"75vh", overflowY:"auto",
        background:"linear-gradient(145deg,rgba(20,26,54,.97) 0%,rgba(10,14,30,.97) 100%)",
        border:"1px solid rgba(0,229,255,.25)", borderRadius:14,
        boxShadow:"0 16px 48px rgba(0,0,0,.7),0 0 0 1px rgba(0,229,255,.1),0 0 32px rgba(0,229,255,.08)",
        padding:"18px 18px 14px", color:"#fff",
        fontFamily:"system-ui,-apple-system,'Segoe UI',sans-serif", fontSize:13,
      }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
          <div>
            <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#00e5ff", fontWeight:700, marginBottom:3 }}>
              RegenScan · Anatomy Focus
            </div>
            <div style={{ fontSize:18, fontWeight:800, lineHeight:1.1 }}>Knee Joint</div>
            <div style={{ marginTop:3, fontSize:11, color:"rgba(255,255,255,.45)" }}>Articulatio genus</div>
          </div>
          <button className="kp-close" onClick={onClose} style={{
            background:"rgba(255,255,255,.08)", border:"none", color:"#fff",
            width:26, height:26, borderRadius:"50%", cursor:"pointer", fontSize:13,
            display:"flex", alignItems:"center", justifyContent:"center",
            flexShrink:0, marginLeft:8, transition:"background .15s",
          }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, marginBottom:12 }}>
          <button className={`kp-tab${tab === "anatomy" ? " active" : ""}`} onClick={() => setTab("anatomy")}>
            🦴 Anatomy
          </button>
          <button className={`kp-tab${tab === "study" ? " active" : ""}`} onClick={() => setTab("study")}>
            📄 Latest Study
          </button>
        </div>

        <div style={{ height:1, background:"rgba(255,255,255,.07)", marginBottom:12 }} />

        {/* Anatomy Tab */}
        {tab === "anatomy" && (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {ANATOMY_SECTIONS.map(({ icon, title, color, text }) => (
              <div key={title} className="kp-section" style={{
                display:"flex", gap:10, background:"rgba(255,255,255,.03)",
                borderRadius:8, padding:"9px 10px", borderLeft:`2px solid ${color}`, transition:"background .15s",
              }}>
                <span style={{ fontSize:15, lineHeight:1, marginTop:1, flexShrink:0 }}>{icon}</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:11, color, marginBottom:2 }}>{title}</div>
                  <div style={{ fontSize:11, lineHeight:1.55, color:"rgba(255,255,255,.7)" }}>{text}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Latest Study Tab */}
        {tab === "study" && (
          <div>
            {loadingStudy ? (
              <div style={{ textAlign:"center", padding:"20px 0", color:"rgba(255,255,255,.4)", fontSize:12 }}>
                Loading latest study…
              </div>
            ) : !latestStudy ? (
              <div style={{ textAlign:"center", padding:"20px 0", color:"rgba(255,255,255,.4)", fontSize:12 }}>
                No studies analyzed yet.<br/>
                <span style={{ color:"#00e5ff" }}>Upload a study in the Scanner tab.</span>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {/* File name + verdict */}
                <div style={{ background:"rgba(255,255,255,.04)", borderRadius:10, padding:"10px 12px" }}>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", marginBottom:4 }}>Latest analyzed study</div>
                  <div style={{ fontSize:12, fontWeight:700, color:"#fff", lineHeight:1.3, marginBottom:6 }}>
                    {latestStudy.fileName}
                  </div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    <span className="kp-tag" style={{ background: latestStudy.isPublished ? "rgba(67,227,91,.15)" : "rgba(255,255,255,.08)", color: latestStudy.isPublished ? "#43e35b" : "rgba(255,255,255,.5)" }}>
                      {latestStudy.isPublished ? "✓ Published" : "○ Unpublished"}
                    </span>
                    <span className="kp-tag" style={{ background:`${verdictColor}20`, color: verdictColor }}>
                      {verdictLabel}
                    </span>
                  </div>
                </div>

                {/* Publishing ref */}
                {latestStudy.publishingReference && (
                  <div style={{ background:"rgba(0,229,255,.05)", borderRadius:8, padding:"8px 10px", borderLeft:"2px solid rgba(0,229,255,.4)" }}>
                    <div style={{ fontSize:10, color:"#00e5ff", fontWeight:700, marginBottom:3, textTransform:"uppercase", letterSpacing:1 }}>Reference</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,.75)", lineHeight:1.5 }}>{latestStudy.publishingReference}</div>
                  </div>
                )}

                {/* Take Home Message */}
                {latestStudy.whyEvidenceImpact?.takeHomeMessage && (
                  <div style={{ background:"rgba(139,92,246,.12)", borderRadius:8, padding:"8px 10px", borderLeft:"2px solid rgba(139,92,246,.5)" }}>
                    <div style={{ fontSize:10, color:"#a78bfa", fontWeight:700, marginBottom:3, textTransform:"uppercase", letterSpacing:1 }}>Take Home</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,.8)", lineHeight:1.5, fontStyle:"italic" }}>
                      &quot;{latestStudy.whyEvidenceImpact.takeHomeMessage}&quot;
                    </div>
                  </div>
                )}

                {/* Key Findings */}
                {latestStudy.whyEvidenceImpact?.keyFindings?.length > 0 && (
                  <div style={{ background:"rgba(255,255,255,.03)", borderRadius:8, padding:"8px 10px" }}>
                    <div style={{ fontSize:10, color:"#00e5ff", fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Key Findings</div>
                    {latestStudy.whyEvidenceImpact.keyFindings.slice(0, 3).map((f, i) => (
                      <div key={i} style={{ display:"flex", gap:6, marginBottom:4, alignItems:"flex-start" }}>
                        <span style={{ color:"#43e35b", fontSize:10, marginTop:1, flexShrink:0 }}>›</span>
                        <span style={{ fontSize:11, color:"rgba(255,255,255,.75)", lineHeight:1.45 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* So What */}
                {latestStudy.soWhat?.soWhat && (
                  <div style={{ background:"rgba(251,191,36,.08)", borderRadius:8, padding:"8px 10px", borderLeft:"2px solid rgba(251,191,36,.4)" }}>
                    <div style={{ fontSize:10, color:"#fbbf24", fontWeight:700, marginBottom:3, textTransform:"uppercase", letterSpacing:1 }}>So What?</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,.75)", lineHeight:1.5 }}>{latestStudy.soWhat.soWhat}</div>
                  </div>
                )}

                {/* Video Placeholder */}
                <div style={{ background:"rgba(0,0,0,.3)", borderRadius:8, padding:"12px", border:"1px solid rgba(0,229,255,.15)" }}>
                  <div style={{ fontSize:10, color:"#00e5ff", fontWeight:700, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Video Summary</div>
                  <div style={{ aspectRatio:"16/9", background:"linear-gradient(135deg,rgba(20,26,54,.9),rgba(10,14,30,.9))", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8 }}>
                    <div style={{ width:48, height:48, borderRadius:"50%", background:"rgba(0,229,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all .2s" }}>
                      <span style={{ fontSize:20, marginLeft:3 }}>▶</span>
                    </div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,.5)" }}>Video summary coming soon</div>
                  </div>
                </div>

                {/* Protocol */}
                {latestStudy.summary?.protocol && (
                  <div style={{ background:"rgba(255,255,255,.03)", borderRadius:8, padding:"8px 10px" }}>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,.4)", fontWeight:700, marginBottom:3, textTransform:"uppercase", letterSpacing:1 }}>Protocol</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,.7)", lineHeight:1.5 }}>{latestStudy.summary.protocol}</div>
                  </div>
                )}

                <div style={{ textAlign:"right", fontSize:10, color:"rgba(255,255,255,.2)", marginTop:2 }}>
                  {new Date(latestStudy.createdAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop:12, fontSize:10, color:"rgba(255,255,255,.25)", textAlign:"right" }}>click ✕ to close</div>
      </div>
    </Html>
  );
}
