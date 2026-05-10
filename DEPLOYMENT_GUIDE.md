# Deployment & Migration Guide: AI Studio to Google Cloud Run

This guide provides step-by-step instructions for exporting your project from AI Studio, migrating your Gemini API calls to the Express backend (for maximum security and to prepare for Vertex AI integration), and deploying the full-stack app to Google Cloud Run.

---

## Phase 1: Exporting Your Repository from AI Studio

1. **Locate the Export Option:** In the AI Studio editor, look for the Settings menu (often a gear icon or a menu in the top right/left corner).
2. **Choose Export Method:** Select **Export to GitHub** (recommended for continuous deployment) or **Download ZIP**.
3. **Set up Locally:** 
   - If downloaded as a ZIP, extract it to a local folder and open it in your preferred IDE (like VS Code).
   - If exported to GitHub, clone the repository to your local machine:
     ```bash
     git clone https://github.com/your-username/your-repo-name.git
     cd your-repo-name
     ```
4. **Install Dependencies:**
   ```bash
   npm install
   ```

---

## Phase 2: Migrating Gemini / Vertex AI Calls to the Backend

Currently, your app calls the Gemini API directly from the frontend (`src/services/geminiService.ts`). To deploy securely and prepare for **Google Cloud Vertex AI**, you must move these calls to the Express server (`server.ts`).

### Step 1: Create Backend API Routes
In your `server.ts` file, add new endpoints to handle the generation requests. For example:

```typescript
// Add this to your server.ts above the Vite middleware
import { GoogleGenAI } from "@google/genai";

// Initialize Vertex AI or Gemini (Backend)
// For Vertex AI (when deployed on Google Cloud):
// const ai = new GoogleGenAI({ vertexai: { project: 'your-project-id', location: 'us-central1' } });
// Or for standard Gemini API Key:
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/generate-plan", async (req, res) => {
  try {
    const { concept, rooms } = req.body;
    
    const prompt = `Create a 3-phase implementation plan for: ${concept.title}...`; // Your prompt logic here
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        responseMimeType: 'application/json',
        // responseSchema: projectPlanSchema // Define schema here
      },
    });
    
    // Parse the JSON safely and return it
    const cleanText = response.text.replace(/```json\\n?|```/g, "").trim();
    res.json(JSON.parse(cleanText));
  } catch (error) {
    console.error("Error generating plan:", error);
    res.status(500).json({ error: "Failed to generate plan" });
  }
});
```

### Step 2: Refactor the Frontend Service 
Update `src/services/geminiService.ts` to call your new local backend endpoints instead of the Gemini SDK directly:

```typescript
// Replace GoogleGenAI frontend imports and logic with simple fetch calls
export const generateProjectPlan = async (concept: DesignConcept, rooms: RoomSegment[]): Promise<ProjectPlan> => {
  const response = await fetch('/api/generate-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ concept, rooms })
  });
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  return response.json();
};
```

---

## Phase 3: Deploying to Google Cloud Run

Cloud Run is perfect for running Node.js + Express + Vite Full-Stack applications. We recommend using Google Cloud Buildpack source deployment.

### Prerequisites
1. Install the [Google Cloud CLI (`gcloud`)](https://cloud.google.com/sdk/docs/install).
2. Authenticate the CLI: `gcloud auth login`
3. Set your active project: `gcloud config set project [YOUR_PROJECT_ID]`
4. Ensure billing is enabled for your Google Cloud Project.
5. Enable required APIs: 
   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
   ```

### Step 1: Add a `Dockerfile` (Optional but highly recommended)
Create a `Dockerfile` in the root of your project:

```dockerfile
# Use the official lightweight Node.js 18 image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install all dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build the frontend assets for production
RUN npm run build

# Expose the standard Cloud Run port
EXPOSE 3000

# Start the Node Express server 
CMD ["npm", "start"]
```

### Step 2: Deploy the Application
Run the following command from your project root to build and deploy to Cloud Run:

```bash
gcloud run deploy my-arkiin-app \
  --source . \
  --port 3000 \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=your_production_api_key_here"
```

*Note: If you followed the steps to use Vertex AI instead of an API Key, you do not need to set the `GEMINI_API_KEY` environment variable. Cloud Run services automatically authenticate to Vertex AI using their attached Service Account configuration!*

### Step 3: Verify and Test
Once the deployment completes, the CLI will output a Service URL (e.g., `https://my-arkiin-app-xyz.a.run.app`). 
Navigate to that URL to see your production-ready, Vertex AI-powered application!
