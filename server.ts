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

  // --- API routes ---

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
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
        model: 'gemini-2.0-flash',
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
  "inputType": "FLOOR_PLAN" | "ROOM_PHOTO" | "BLUEPRINT",
  "roomSegments": [
    { "roomType": "Living Room", "estimatedArea": "25 sqm", "features": ["window", "open plan"] }
  ],
  "estimatedDimensions": { "width": "8m", "length": "10m", "area": "80 sqm" }
}`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          { role: 'user', parts: [
            { text: prompt },
            { inlineData: { mimeType, data: imageBase64 } }
          ]}
        ],
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
      const prompt = `You are ARK, an expert interior design AI. Based on the user's taste DNA and confirmed room segments, generate 2 distinct design concepts. Return ONLY a valid JSON array (no markdown) with this structure:
[
  {
    "id": "concept-1",
    "title": "string",
    "rationale": "string",
    "furnitureLayout": "string",
    "colorPalette": ["#hex1", "#hex2", "#hex3"],
    "lightingPlan": "string"
  }
]

Taste DNA: ${JSON.stringify(taste)}
Rooms: ${JSON.stringify(confirmedRooms)}`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
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
      const prompt = `You are ARK, an expert interior design project manager. Create a detailed project plan for this design concept. Return ONLY a valid JSON object (no markdown) with this structure:
{
  "totalBudget": "string e.g. €15,000 - €25,000",
  "contingency": "string e.g. 10% (€1,500 - €2,500)",
  "timeline": {
    "phases": [
      {
        "name": "Phase name",
        "duration": "2-3 weeks",
        "tasks": [
          { "name": "Task", "duration": "1 week", "cost": "€500", "notes": "note" }
        ]
      }
    ],
    "shoppingList": ["item1", "item2"]
  }
}

Concept: ${JSON.stringify(concept)}
Rooms: ${JSON.stringify(rooms)}`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
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
      const prompt = `You are ARK, an interior design visualization AI. Generate isometric render descriptions for the following design concept and rooms. Return ONLY a valid JSON object (no markdown) with room keys and description values:
{
  "Living Room": "Detailed isometric render description",
  "Bedroom": "Detailed isometric render description"
}

Concept: ${JSON.stringify(concept)}
Rooms: ${JSON.stringify(confirmedRooms)}`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
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

  // Vite middleware for development (dynamic import so vite is not required in prod)
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));

    // SPA Fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
