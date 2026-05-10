
import { 
  StylePreference, 
  UserTasteDNA, 
  SpatialAnalysisReport, 
  DesignConcept, 
  ProjectPlan,
  RoomSegment
} from "./types";

// --- API Functions ---

export const generateTasteDNA = async (preferences: StylePreference[]): Promise<UserTasteDNA> => {
  const res = await fetch('/api/generateTasteDNA', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ preferences })
  });
  if (!res.ok) throw new Error("Failed to generate Taste DNA");
  return res.json();
};

export const analyzeSpace = async (imageBase64: string, mimeType: string): Promise<SpatialAnalysisReport> => {
  const res = await fetch('/api/analyzeSpace', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType })
  });
  if (!res.ok) throw new Error("Failed to analyze space");
  return res.json();
};

export const generateDesignConcepts = async (
  taste: UserTasteDNA,
  confirmedRooms: RoomSegment[]
): Promise<DesignConcept[]> => {
  const res = await fetch('/api/generateDesignConcepts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taste, confirmedRooms })
  });
  if (!res.ok) throw new Error("Failed to generate concepts");
  return res.json();
};

export const generateProjectPlan = async (concept: DesignConcept, rooms: RoomSegment[]): Promise<ProjectPlan> => {
  const res = await fetch('/api/generateProjectPlan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ concept, rooms })
  });
  if (!res.ok) throw new Error("Failed to generate plan");
  return res.json();
};

export const generateIsometricRender = async (
  concept: DesignConcept, 
  confirmedRooms: RoomSegment[]
): Promise<string> => {
  const res = await fetch('/api/generateIsometricRender', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ concept, confirmedRooms })
  });
  if (!res.ok) throw new Error("Failed to generate render");
  const data = await res.json();
  return data.image;
};
