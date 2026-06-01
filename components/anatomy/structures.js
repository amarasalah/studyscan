export const STRUCTURE_META = {
  "Femur.r":                    { label: "Femur",                type: "Bone" },
  "Tibia.r":                    { label: "Tibia",                type: "Bone" },
  "Fibula.r":                   { label: "Fibula",               type: "Bone" },
  "Patella.r":                  { label: "Patella",              type: "Bone" },
  "Hip bone.r":                 { label: "Hip bone",             type: "Bone" },
  "Vastus lateralis muscle.r":  { label: "Vastus lateralis",     type: "Muscle" },
  "Vastus medialis muscle.r":   { label: "Vastus medialis",      type: "Muscle" },
  "Tibialis anterior muscle.r": { label: "Tibialis anterior",    type: "Muscle" },
  "Fascia lata.r":              { label: "Fascia lata",          type: "Fascia" },
  "Iliotibial tract.r":         { label: "Iliotibial tract",     type: "Fascia" },
  "Femoral artery.r":           { label: "Femoral artery",       type: "Artery" },
  "Popliteal artery.r":         { label: "Popliteal artery",     type: "Artery" },
  "Great saphenous vein.r":     { label: "Great saphenous vein", type: "Vein" },
  "Femoral vein.r":             { label: "Femoral vein",         type: "Vein" },
  "Schiatic nerve.r":           { label: "Sciatic nerve",        type: "Nerve" },
  "Femoral nerve.r":            { label: "Femoral nerve",        type: "Nerve" },
  "Tibial nerve.r":             { label: "Tibial nerve",         type: "Nerve" },
  "Common fibular nerve.r":     { label: "Common fibular nerve", type: "Nerve" },
};

export const TYPE_COLORS = {
  Bone:     "#cdb98f",
  Muscle:   "#e0857a",
  Fascia:   "#e6cf7e",
  Nerve:    "#f0dd79",
  Artery:   "#e0726a",
  Vein:     "#6f8fe0",
  Ligament: "#bcd07e",
  Bursa:    "#9ad0c0",
  Unknown:  "#9aa3b5",
};

export const HIGHLIGHT_COLOR = "#43e35b";

const SIDE_SUFFIX = /\s*\.[rl]$/i;

export function prettyName(raw) {
  return String(raw).replace(SIDE_SUFFIX, "").replace(/\s+/g, " ").trim();
}

const TYPE_KEYWORDS = [
  ["Muscle",   ["muscle", "vastus", "gastrocnemius", "soleus", "femoris", "semitendinosus", "semimembranosus", "gluteus", "sartorius", "gracilis", "adductor", "pectineus", "tensor fasciae", "rectus", "tibialis", "fibularis", "peroneus", "popliteus", "plantaris", "piriformis", "gemellus", "iliacus", "psoas", "extensor", "flexor", "abductor", "lumbrical", "interossei", "quadriceps"]],
  ["Nerve",    ["nerve", "plexus", "rami", "ramus"]],
  ["Artery",   ["artery", "arteries", "arterial", "aorta"]],
  ["Vein",     ["vein", "venous"]],
  ["Fascia",   ["fascia", "tract", "septum", "aponeurosis", "retinaculum"]],
  ["Ligament", ["ligament"]],
  ["Bursa",    ["bursa", "sheath", "recess"]],
  ["Bone",     ["bone", "femur", "tibia", "fibula", "patella", "phalanx", "metatarsal", "calcaneus", "talus", "cuboid", "cuneiform", "navicular", "sacrum", "coccyx", "vertebra", "sesamoid"]],
];

export function inferType(raw) {
  const n = String(raw).toLowerCase();
  for (const [type, kws] of TYPE_KEYWORDS) {
    if (kws.some((k) => n.includes(k))) return type;
  }
  return "Unknown";
}

export function metaFor(name) {
  if (!name) return { label: "", type: "Unknown" };
  return STRUCTURE_META[name] || { label: prettyName(name), type: inferType(name) };
}
