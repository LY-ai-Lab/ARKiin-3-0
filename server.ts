import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseJSON(text: string): any {
  const clean = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  return JSON.parse(clean);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  app.use(express.json({ limit: '25mb' }));

  const ai = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY || '', vertexai: false });
  const MODEL = 'gemini-1.5-flash';

  // ── Health ──────────────────────────────────────────────────────────────────
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', model: MODEL });
  });

  // ── Step 1: Generate Taste DNA ───────────────────────────────────────────────
  app.post('/api/generateTasteDNA', async (req, res) => {
    try {
      const { preferences } = req.body;
      const prompt = `You are ARK, an expert interior design AI. Analyze these style preferences and return ONLY valid JSON matching this TypeScript interface - no markdown, no explanation:

interface UserTasteDNA {
  primaryStyle: string;
  elements: Record<string, string>;
  aesthifyScores: Record<string, number>; // e.g. { "Minimalism": 0.8, "Warmth": 0.6, "Luxury": 0.4, "Nature": 0.5, "Modernity": 0.7 }
  confidence: number; // 0.0 to 1.0
}

Preferences data:
${JSON.stringify(preferences, null, 2)}

Respond with ONLY the JSON object:`;

      const response = await ai.models.generateContent({ model: MODEL, contents: prompt });
      const dna = parseJSON(response.text ?? '{}');
      res.json(dna);
    } catch (err: any) {
      console.error('generateTasteDNA error:', err?.message ?? err);
      res.status(500).json({ error: err?.message ?? 'Internal error' });
    }
  });

  // ── Step 2: Analyse Space (floor plan / room photo) ──────────────────────────
  app.post('/api/analyzeSpace', async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;
      const prompt = `You are ARK, an expert architectural AI. Analyse this floor plan or room photo.

Return ONLY valid JSON matching this interface - no markdown, no explanation:

interface SpatialAnalysisReport {
  inputType: 'FLOOR_PLAN' | 'ROOM_PHOTO' | 'BLUEPRINT';
  roomSegments: Array<{
    id: string;             // e.g. "room_1"
    type: 'Living Room' | 'Bedroom' | 'Kitchen' | 'Bathroom' | 'Dining Room' | 'Entrance' | 'Hallway' | 'Balcony' | 'Home Office' | 'Storage';
    area: string;           // e.g. "18.5 m²"
    dimensions: { width: number; length: number }; // metres
    ceilingHeight: number;  // metres, default 2.5
    bounds: { x: number; y: number; w: number; h: number }; // percentage 0-100 of image dimensions
  }>;
  estimatedDimensions: { width: string; length: string; area: string };
}

Respond with ONLY the JSON object:`;

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: [{
          role: 'user',
          parts: [
            { inlineData: { mimeType, data: imageBase64 } },
            { text: prompt }
          ]
        }]
      });
      const report = parseJSON(response.text ?? '{}');
      res.json(report);
    } catch (err: any) {
      console.error('analyzeSpace error:', err?.message ?? err);
      res.status(500).json({ error: err?.message ?? 'Internal error' });
    }
  });

  // ── Step 3: Generate Design Concepts ────────────────────────────────────────
  app.post('/api/generateDesignConcepts', async (req, res) => {
    try {
      const { taste, confirmedRooms } = req.body;
      const prompt = `You are ARK, an expert interior designer AI. Create 3 distinct design concepts.

Return ONLY a valid JSON array of 3 objects matching this interface - no markdown, no explanation:

interface DesignConcept {
  id: string;              // "concept_1", "concept_2", "concept_3"
  title: string;
  rationale: string;       // 2-3 sentences
  furnitureLayout: string; // brief description
  colorPalette: string[];  // 3-5 hex codes e.g. ["#F5F0EB","#8B6F5E"]
  lightingPlan: string;
  isometricImages?: Record<string, string>; // optional, leave as {}
}

User Taste DNA:
${JSON.stringify(taste, null, 2)}

Confirmed Rooms:
${JSON.stringify(confirmedRooms, null, 2)}

Respond with ONLY the JSON array:`;

      const response = await ai.models.generateContent({ model: MODEL, contents: prompt });
      const concepts = parseJSON(response.text ?? '[]');
      res.json(concepts);
    } catch (err: any) {
      console.error('generateDesignConcepts error:', err?.message ?? err);
      res.status(500).json({ error: err?.message ?? 'Internal error' });
    }
  });

  // ── Step 4: Generate Project Plan ───────────────────────────────────────────
  app.post('/api/generateProjectPlan', async (req, res) => {
    try {
      const { concept, rooms } = req.body;
      const prompt = `You are ARK, an expert interior design project manager. Create a detailed implementation plan.

Return ONLY valid JSON matching this interface - no markdown, no explanation:

interface ProjectPlan {
  totalBudget: string;    // e.g. "€18,500"
  contingency: string;   // e.g. "€1,850 (10%)"
  timeline: {
    phases: Array<{
      title: string;
      tasks: Array<{
        id: string;
        task: string;
        duration: string;  // e.g. "3 days"
        type: 'DIY' | 'PRO';
        cost: string;      // e.g. "€450"
        completed?: boolean;
      }>;
      estimatedCost: string;
    }>;
    shoppingList: string[];
  };
}

Design Concept:
${JSON.stringify(concept, null, 2)}

Rooms:
${JSON.stringify(rooms, null, 2)}

Respond with ONLY the JSON object:`;

      const response = await ai.models.generateContent({ model: MODEL, contents: prompt });
      const plan = parseJSON(response.text ?? '{}');
      res.json(plan);
    } catch (err: any) {
      console.error('generateProjectPlan error:', err?.message ?? err);
      res.status(500).json({ error: err?.message ?? 'Internal error' });
    }
  });

  // ── Step 5: Generate Isometric Render Description ───────────────────────────
  app.post('/api/generateIsometricRender', async (req, res) => {
    try {
      const { concept, confirmedRooms } = req.body;
      const prompt = `You are ARK, an expert interior design visualiser. Generate isometric render descriptions for each room.

Return ONLY a valid JSON object where each key is a room id and value is a rich visual description string (2-4 sentences) - no markdown, no explanation.

Example: { "room_1": "A sunlit open-plan living area with oak floors...", "room_2": "..." }

Design Concept:
${JSON.stringify(concept, null, 2)}

Rooms:
${JSON.stringify(confirmedRooms, null, 2)}

Respond with ONLY the JSON object:`;

      const response = await ai.models.generateContent({ model: MODEL, contents: prompt });
      const renders = parseJSON(response.text ?? '{}');
      res.json(renders);
    } catch (err: any) {
      console.error('generateIsometricRender error:', err?.message ?? err);
      res.status(500).json({ error: err?.message ?? 'Internal error' });
    }
  });

  // ── Static files & SPA fallback ─────────────────────────────────────────────
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'LOG',
      message: `ARKiin 3.0 server running on http://0.0.0.0:${PORT} | model: ${MODEL}`
    }));
  });
}

startServer().catch(console.error);
