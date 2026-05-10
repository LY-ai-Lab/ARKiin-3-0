const fs = require('fs');
let code = fs.readFileSync('src/GeminiService.ts', 'utf8');

const schemas = `
const designConceptSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      rationale: { type: Type.STRING },
      furnitureLayout: { type: Type.STRING },
      colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
      lightingPlan: { type: Type.STRING }
    },
    required: ["id", "title", "rationale", "furnitureLayout", "colorPalette", "lightingPlan"]
  }
};

const projectPlanSchema = {
  type: Type.OBJECT,
  properties: {
    totalBudget: { type: Type.STRING },
    contingency: { type: Type.STRING },
    timeline: {
      type: Type.OBJECT,
      properties: {
        phases: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              tasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    task: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['DIY', 'PRO'] },
                    cost: { type: Type.STRING },
                    completed: { type: Type.BOOLEAN }
                  },
                  required: ["id", "task", "duration", "type", "cost"]
                }
              },
              estimatedCost: { type: Type.STRING }
            },
            required: ["title", "tasks", "estimatedCost"]
          }
        },
        shoppingList: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      required: ["phases", "shoppingList"]
    }
  },
  required: ["totalBudget", "contingency", "timeline"]
};

// --- API Functions ---
`;

code = code.replace('// --- API Functions ---', schemas);

code = code.replace(
  "config: { responseMimeType: 'application/json' },\n  });\n  return parseResponse(response.text);",
  "config: { responseMimeType: 'application/json', responseSchema: designConceptSchema },\n  });\n  return parseResponse(response.text);"
);

code = code.replace(
  "config: { responseMimeType: 'application/json' },\n  });\n  return parseResponse(response.text);",
  "config: { responseMimeType: 'application/json', responseSchema: projectPlanSchema },\n  });\n  return parseResponse(response.text);"
);

fs.writeFileSync('src/GeminiService.ts', code);
