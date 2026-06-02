export interface AnalysisResult {
  id: string;
  fileName: string;
  fileUrl: string;
  cloudinaryPublicId: string;
  createdAt: string;
  isPublished: boolean;
  publishingReference?: string;
  journalName?: string;
  doi?: string;
  authors?: string;
  publicationYear?: string;
  inFavorOfRegenLab: boolean | null;
  favorReason?: string;
  againstReason?: string;
  summary?: {
    protocol: string;
    pathology: string;
    productUsed: string;
    results: string;
  };
  whyEvidenceImpact?: {
    whyImportant: string;
    studyDesign: {
      type: string;
      patientCount: string;
      population: string;
      primaryEndpoint: string;
    };
    keyFindings: string[];
    clinicalImpact: string;
    takeHomeMessage: string;
  };
  painEvidenceSolution?: {
    pain: string;
    evidence: string;
    solution: string;
    benefit: string;
  };
  soWhat?: {
    studyResult: string;
    soWhat: string;
  };
  impactingCommunication?: {
    whyMatters: string;
    studyDesign: string;
    keyFindings: string;
    clinicalRelevance: string;
    clinicianAction: string;
  };
  rawGeminiResponse: string;
  videoUrl?: string;
}
