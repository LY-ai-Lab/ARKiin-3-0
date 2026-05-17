import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

// Resolving __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware to parse JSON bodies (increased limit for base64 images)
  app.use(express.json({ limit: '20mb' }));

  // Initialize Gemini AI
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  const MODEL = 'gemini-2.5-flash';
  // --- API routes ---

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", model: MODEL });
  });

  // POST /api/generateTasteDNA
  app.post("/api/generateTasteDNA", async (req, res) => {
    try {
      const { preferences } = req.body;
      const prompt = `You are an expert interior design AI called ARK. Analyze the following style preferences and generate a UserTasteDNA JSON object.

Preferences (array of {styleId, styleName, imageType, rating}):
${JSON.stringify(preferences)}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "primaryStyle": "string describing the dominant style",
  "elements": { "key": "value description" },
  "aesthifyScores": { "Minimalism": 0.8, "Warmth": 0.6, "Luxury": 0.4, "Nature": 0.5, "Modernity": 0.7 },
  "confidence": 0.85
}`;
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });
      const text = response.text || '{}';
      const clean = text.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
      res.json(JSON.parse(clean));
    } catch (err: any) {
      console.error('generateTasteDNA error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/analyzeSpace
  app.post("/api/analyzeSpace", async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;
      const prompt = `You are ARK, an expert architectural AI. Analyze this floor plan or room photo and return ONLY a valid JSON object (no markdown, no explanation) with this structure:
{
  "inputType": "FLOOR PLAN" | "ROOM PHOTO" | "BLUEPRINT",
  "totalArea": number,
  "rooms": [
    {
      "id": "string",
      "name": "string",
      "type": "LIVING" | "BEDROOM" | "KITCHEN" | "BATHROOM" | "OFFICE" | "OTHER",
      "area": number,
      "dimensions": { "width": number, "length": number },
      "features": ["string"]
    }
  ],
  "architecturalStyle": "string",
  "condition": "string",
  "recommendations": ["string"]
}`;
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { mimeType, data: imageBase64 } },
              { text: prompt }
            ]
          }
        ]
      });
      const text = response.text || '{}';
      const clean = text.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
      res.json(JSON.parse(clean));
    } catch (err: any) {
      console.error('analyzeSpace error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/generateDesignConcepts
  app.post("/api/generateDesignConcepts", async (req, res) => {
    try {
      const { taste, confirmedRooms } = req.body;
      const prompt = `You are ARK, an expert interior designer AI. Based on the user's taste DNA and confirmed rooms, generate 3 distinct design concepts.

Taste DNA: ${JSON.stringify(taste)}
Rooms: ${JSON.stringify(confirmedRooms)}

Return ONLY a valid JSON array of 3 design concept objects (no markdown, no explanation):
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "style": "string",
    "colorPalette": ["#hex1", "#hex2", "#hex3"],
    "materials": ["string"],
    "estimatedCost": { "min": number, "max": number, "currency": "EUR" },
    "keyFeatures": ["string"]
  }
]`;
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });
      const text = response.text || '[]';
      const clean = text.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
      res.json(JSON.parse(clean));
    } catch (err: any) {
      console.error('generateDesignConcepts error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/generateProjectPlan
  app.post("/api/generateProjectPlan", async (req, res) => {
    try {
      const { concept, rooms } = req.body;
      const prompt = `You are ARK, an expert project management AI for interior design. Create a detailed implementation plan.

Design Concept: ${JSON.stringify(concept)}
Rooms: ${JSON.stringify(rooms)}

Return ONLY a valid JSON object (no markdown, no explanation):
{
  "phases": [
    {
      "id": "string",
      "name": "string",
      "duration": "string",
      "tasks": ["string"],
      "estimatedCost": number
    }
  ],
  "totalDuration": "string",
  "totalCost": number,
  "materials": [
    { "name": "string", "quantity": "string", "estimatedCost": number }
  ],
  "professionals": ["string"]
}`;
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });
      const text = response.text || '{}';
      const clean = text.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
      res.json(JSON.parse(clean));
    } catch (err: any) {
      console.error('generateProjectPlan error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/generateIsometricRender
  app.post("/api/generateIsometricRender", async (req, res) => {
    try {
      const { concept, confirmedRooms } = req.body;
      const prompt = `You are ARK, an expert interior design visualizer. Create a detailed textual description of an isometric render for this design concept.

Concept: ${JSON.stringify(concept)}
Rooms: ${JSON.stringify(confirmedRooms)}

Return ONLY a valid JSON object (no markdown):
{
  "description": "detailed visual description of the isometric render",
  "viewpoint": "string",
  "lightingDescription": "string",
  "furnitureArrangement": "string",
  "colorHighlights": ["string"]
}`;
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });
      const text = response.text || '{}';
      const clean = text.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
      res.json(JSON.parse(clean));
    } catch (err: any) {
      console.error('generateIsometricRender error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Serve static files from dist directory
  app.use(express.static(path.join(__dirname, 'dist')));

  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), level: 'LOG', message: `Server running on http://0.0.0.0:${PORT}` }));
  });
}

startServer().catch(console.error);
