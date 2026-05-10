import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

// Resolving __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Example API if you want to shift your Vertex/GenAI calls here:
  // app.post("/api/design", async (req, res) => {
  //   // You can securely do `@google/genai` calls with Vertex AI using backend logic without exposing keys!
  // });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    // SPA Fallback: Note Express v5 changed to use *all instead of * but this is express 4/5 compatible generally via '*'. Express 5 prefers app.get('*', ...) still works or `app.get('(.*)', ...)`
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
