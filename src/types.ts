
export type HeartRating = 1 | 2 | 3 | 'SKIP';

export interface StylePreference {
  styleId: string;
  styleName: string;
  imageType: 'space' | 'texture' | 'pattern';
  rating: HeartRating;
}

// Added DesignStyle interface to resolve constants.ts error
export interface DesignStyle {
  id: string;
  label: string;
  description: string;
  images: {
    space: string;
    texture: string;
    pattern: string;
  };
}

export type RoomType = 
  | 'Living Room' 
  | 'Bedroom' 
  | 'Kitchen' 
  | 'Bathroom' 
  | 'Dining Room' 
  | 'Entrance' 
  | 'Hallway' 
  | 'Balcony' 
  | 'Home Office' 
  | 'Storage';

export interface RoomSegment {
  id: string;
  type: RoomType;
  area: string;
  dimensions: {
    width: number;
    length: number;
  };
  ceilingHeight: number;
  bounds: { x: number, y: number, w: number, h: number }; // Percentage values 0-100
}

export interface UserTasteDNA {
  primaryStyle: string;
  elements: Record<string, string>;
  aesthifyScores: Record<string, number>;
  confidence: number;
}

export interface SpatialAnalysisReport {
  inputType: 'FLOOR_PLAN' | 'ROOM_PHOTO' | 'BLUEPRINT';
  roomSegments: RoomSegment[];
  estimatedDimensions: { width: string; length: string; area: string };
}

export interface DesignConcept {
  id: string;
  title: string;
  rationale: string;
  furnitureLayout: string;
  colorPalette: string[];
  lightingPlan: string;
  isometricImages?: Record<string, string>;
}

export interface ProjectTask {
  id: string;
  task: string;
  duration: string;
  type: 'DIY' | 'PRO';
  cost: string;
  completed?: boolean;
}

export interface ProjectPhase {
  title: string;
  tasks: ProjectTask[];
  estimatedCost: string;
}

export interface ProjectPlan {
  totalBudget: string;
  contingency: string;
  timeline: {
    phases: ProjectPhase[];
    shoppingList: string[];
  };
}

export enum AppStep {
  LANDING = 0,
  TASTE_DISCOVERY = 1,
  DNA_PROFILE = 1.5,
  SPACE_UPLOAD = 2,
  CONFIRM_LAYOUT = 2.5,
  DESIGN_CONCEPTS = 3,
  PROJECT_PLAN = 4,
}
