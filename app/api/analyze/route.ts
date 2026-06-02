import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function fetchAsBase64(url: string, forceMime?: string): Promise<{ base64: string; mimeType: string }> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Fetch failed: ${response.status} ${url}`);
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const contentType = forceMime || response.headers.get("content-type") || "image/jpeg";
  return { base64, mimeType: contentType };
}

async function fetchPdfAsBase64(cloudinaryUrl: string): Promise<{ base64: string; mimeType: string }> {
  return fetchAsBase64(cloudinaryUrl, "application/pdf");
}

async function fetchPdfPagesAsImages(cloudinaryUrl: string): Promise<{ base64: string; mimeType: string }[]> {
  const pageImages: { base64: string; mimeType: string }[] = [];

  for (let page = 0; page <= 4; page++) {
    try {
      const transform = page === 0
        ? "f_jpg,q_80,w_1400"
        : `f_jpg,q_80,w_1400,pg_${page}`;
      const pageUrl = cloudinaryUrl
        .replace("/upload/", `/upload/${transform}/`)
        .replace(/\.pdf$/i, ".jpg");
      const img = await fetchAsBase64(pageUrl, "image/jpeg");
      if (img.base64.length > 1000) {
        pageImages.push(img);
      }
    } catch {
      if (page > 0) break;
    }
  }

  return pageImages;
}

export async function POST(req: NextRequest) {
  try {
    const { fileUrl, format } = await req.json();

    if (!fileUrl) {
      return NextResponse.json({ error: "No file URL provided" }, { status: 400 });
    }

    const isPdf = format === "pdf" || fileUrl.toLowerCase().includes(".pdf");
    let imageParts: { inlineData: { data: string; mimeType: string } }[] = [];

    if (isPdf) {
      try {
        const pdf = await fetchPdfAsBase64(fileUrl);
        imageParts = [{ inlineData: { data: pdf.base64, mimeType: "application/pdf" } }];
      } catch {
        const pages = await fetchPdfPagesAsImages(fileUrl);
        if (pages.length === 0) {
          return NextResponse.json({ error: "Could not extract content from PDF" }, { status: 400 });
        }
        imageParts = pages.map((p: { base64: string; mimeType: string }) => ({
          inlineData: { data: p.base64, mimeType: p.mimeType },
        }));
      }
    } else {
      const img = await fetchAsBase64(fileUrl);
      imageParts = [{ inlineData: { data: img.base64, mimeType: img.mimeType } }];
    }

    const prompt = `You are an expert scientific communication analyst specialized in regenerative medicine, PRP (Platelet-Rich Plasma), wound care, and RegenLab/RegenPRP clinical evidence.

Analyze the provided study/document carefully and respond ONLY with a valid JSON object. No markdown, no code fences, no explanation — pure JSON only.

Use this exact structure:

{
  "isPublished": true or false,
  "publishingReference": "Full citation string if published, null if not",
  "journalName": "Journal name if available, null otherwise",
  "doi": "DOI if available, null otherwise",
  "authors": "Authors list if available, null otherwise",
  "publicationYear": "Year as string if available, null otherwise",
  "inFavorOfRegenLab": true, false, or null,
  "favorReason": "Why it supports RegenLab/RegenPRP, null otherwise",
  "againstReason": "Why it does NOT support RegenLab/RegenPRP, null otherwise",
  "summary": {
    "protocol": "PRP/treatment protocol (injection frequency, volume, preparation method, centrifugation, etc.)",
    "pathology": "Medical condition or pathology treated",
    "productUsed": "Specific product or system (RegenPRP, RegenBCT, competitor kit, etc.)",
    "results": "Key clinical outcomes reported"
  },
  "whyEvidenceImpact": {
    "whyImportant": "The clinical problem this study addresses and why it matters (1-2 sentences)",
    "studyDesign": {
      "type": "RCT / prospective / retrospective / multicentrique / case series / meta-analysis / etc.",
      "patientCount": "Number of patients included (e.g. n=45)",
      "population": "Patient population description (age, condition, inclusion criteria)",
      "primaryEndpoint": "Primary outcome measure used in the study"
    },
    "keyFindings": ["finding 1 with number", "finding 2 with number", "finding 3 with number"],
    "clinicalImpact": "What this changes for the clinician in daily practice (1-2 sentences)",
    "takeHomeMessage": "One powerful sentence summarizing the clinical message"
  },
  "painEvidenceSolution": {
    "pain": "The unmet medical need or clinical problem (1 sentence)",
    "evidence": "What the clinical evidence demonstrates (1 sentence)",
    "solution": "What RegenPRP / the treatment provides as a solution (1 sentence)",
    "benefit": "The patient and clinician benefit (1 sentence)"
  },
  "soWhat": {
    "studyResult": "The main quantitative result of the study (1 sentence with numbers)",
    "soWhat": "The concrete real-world meaning for patients and clinicians (1-2 sentences)"
  },
  "impactingCommunication": {
    "whyMatters": "Why this study matters scientifically and clinically",
    "studyDesign": "Study design summary (type, n, population, duration)",
    "keyFindings": "The 3-5 most impactful findings with data",
    "clinicalRelevance": "How these findings translate to clinical practice",
    "clinicianAction": "What should clinicians do differently tomorrow based on this study?"
  },
  "confidence": "high", "medium", or "low"
}

Rules:
- "isPublished": true if the document has clear signs of peer-review (journal name, ISSN, DOI, abstract, methods, references).
- "inFavorOfRegenLab": true if study positively evaluates RegenLab/RegenPRP/RegenBCT products. false if it negatively evaluates them or shows competitors as superior. null if unrelated.
- If not a scientific study: isPublished=false, all analysis fields=null.
- Always fill all fields for medical/scientific studies even if not RegenLab-related.
- keyFindings must be an array of strings (3 to 5 items with concrete numbers when available).
- Respond with pure JSON only — no markdown, no code blocks, no explanation.`;

    const requestBody = {
      contents: [
        {
          parts: [
            ...imageParts,
            { text: prompt },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
      },
    };

    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "gemini-flash-latest",
      "gemini-2.5-flash-lite",
    ];
    const apisToTry = ["v1beta"];

    let geminiResponse: Response | null = null;
    let usedModel = "";
    let lastError = "";

    outer: for (const apiVer of apisToTry) {
      for (const model of modelsToTry) {
        const url = `https://generativelanguage.googleapis.com/${apiVer}/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        if (res.ok) {
          geminiResponse = res;
          usedModel = `${apiVer}/${model}`;
          break outer;
        }
        const errBody = await res.text();
        lastError = `${res.status} - ${errBody}`;
        console.warn(`Model ${apiVer}/${model} failed:`, lastError);
        if (res.status === 429 || res.status === 403) break outer;
      }
    }

    if (!geminiResponse) {
      console.error("All Gemini models failed. Last error:", lastError);
      return NextResponse.json(
        { error: `Gemini API error: ${lastError}` },
        { status: 500 }
      );
    }
    console.log("Used Gemini model:", usedModel);

    const geminiData = await geminiResponse.json();
    const candidate = geminiData?.candidates?.[0];
    const rawText = candidate?.content?.parts?.[0]?.text || "";
    const finishReason = candidate?.finishReason || "";

    if (finishReason === "MAX_TOKENS") {
      console.warn("Gemini response truncated (MAX_TOKENS). Raw:", rawText);
    }

    const stripped = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parsed: any = {};
    try {
      const jsonMatch = stripped.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (e) {
      console.error("JSON parse error:", e, "Raw:", rawText);
      return NextResponse.json(
        { error: "Failed to parse Gemini response", rawText },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...parsed,
      rawGeminiResponse: rawText,
    });
  } catch (error: unknown) {
    console.error("Analyze error:", error);
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
