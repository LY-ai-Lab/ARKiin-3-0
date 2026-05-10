import { DesignStyle } from "./types";

export const DESIGN_STYLES: DesignStyle[] = [
  {
    id: "modern_minimalist",
    label: "Modern Minimalist",
    description: "Clean lines, functional furniture, and a monochromatic palette with open spaces.",
    images: {
      space: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1000",
      texture: "https://images.unsplash.com/photo-1615873968403-89e068629275?auto=format&fit=crop&q=80&w=600",
      pattern: "https://images.unsplash.com/photo-1518640027989-a1c3769c3605?auto=format&fit=crop&q=80&w=600"
    }
  },
  {
    id: "industrial_loft",
    label: "Industrial Loft",
    description: "Raw aesthetics featuring exposed brick, ductwork, metal accents, and utilitarian objects.",
    images: {
      space: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=1000",
      texture: "https://images.unsplash.com/photo-1520052203542-d3095f05888e?auto=format&fit=crop&q=80&w=600",
      pattern: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&q=80&w=600"
    }
  },
  {
    id: "scandinavian_hygge",
    label: "Scandinavian Hygge",
    description: "Cozy, functional, and simple. Emphasizes natural materials, light wood, and warmth.",
    images: {
      space: "https://images.unsplash.com/photo-1595514020180-272e03074697?auto=format&fit=crop&q=80&w=1000",
      texture: "https://images.unsplash.com/photo-1582094951336-7c014798c199?auto=format&fit=crop&q=80&w=600",
      pattern: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600"
    }
  },
  {
    id: "bohemian_chic",
    label: "Bohemian Chic",
    description: "Eclectic and free-spirited with layers of pattern, texture, and color.",
    images: {
      space: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1000",
      texture: "https://images.unsplash.com/photo-1594220377484-9db2b4ce7005?auto=format&fit=crop&q=80&w=600",
      pattern: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=600"
    }
  },
  {
    id: "mid_century_modern",
    label: "Mid-Century Modern",
    description: "Retro-futuristic look from the '50s and '60s. Organic shapes and functional form.",
    images: {
      space: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=1000",
      texture: "https://images.unsplash.com/photo-1611486212557-88be5ff6f941?auto=format&fit=crop&q=80&w=600",
      pattern: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&q=80&w=600"
    }
  },
  {
    id: "japandi",
    label: "Japandi",
    description: "A hybrid of Japanese rustic minimalism and Scandinavian functionality.",
    images: {
      space: "https://images.unsplash.com/photo-1616486341351-7025244f24c4?auto=format&fit=crop&q=80&w=1000",
      texture: "https://images.unsplash.com/photo-1591123725593-3d44d0840b37?auto=format&fit=crop&q=80&w=600",
      pattern: "https://images.unsplash.com/photo-1588636657929-22a0d9b4334c?auto=format&fit=crop&q=80&w=600"
    }
  },
  {
    id: "art_deco",
    label: "Art Deco",
    description: "Glamorous and elegant. Geometric patterns, rich colors, and metallic accents.",
    images: {
      space: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=1000",
      texture: "https://images.unsplash.com/photo-1507646870716-29b142004245?auto=format&fit=crop&q=80&w=600",
      pattern: "https://images.unsplash.com/photo-1585566088285-d858349b177d?auto=format&fit=crop&q=80&w=600"
    }
  },
  {
    id: "rustic_farmhouse",
    label: "Rustic Farmhouse",
    description: "Warm and inviting with reclaimed wood, vintage accessories, and practical design.",
    images: {
      space: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&q=80&w=1000",
      texture: "https://images.unsplash.com/photo-1601666624535-779872225381?auto=format&fit=crop&q=80&w=600",
      pattern: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600"
    }
  }
];

export const MOCK_LOADING_MESSAGES = [
  "Analyzing room geometry...",
  "Detecting light sources...",
  "Mapping circulation paths...",
  "Synthesizing style preferences...",
  "Generating 3D spatial concepts...",
  "Calculating material estimates...",
  "Curating furniture selection...",
];
