// Basic Types
export interface Bead {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  textures: {
    diffuse: string;
    normal: string;
    roughness: string;
  };
}

export interface BeadPosition {
  index: number;
  bead: Bead;
  rotation: [number, number, number]; // [x, y, z] rotation in radians
}

// Context Types
export interface BeadState {
  availableBeads: Bead[];
  selectedBeads: BeadPosition[];
  selectedBeadIndex: number | null;
  isLoading: boolean;
  error: string | null;
}

export type BeadAction =
  | { type: 'SET_AVAILABLE_BEADS'; payload: Bead[] }
  | { type: 'ADD_SELECTED_BEAD'; payload: BeadPosition }
  | { type: 'UPDATE_BEAD_ROTATION'; payload: { index: number; rotation: [number, number, number] } }
  | { type: 'SELECT_BEAD'; payload: number | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Component Props Types
export interface BraceletBuilderProps {
  availableBeads: Bead[];
}

export interface BraceletSceneProps {
  beads: BeadPosition[];
  onBeadClick: (index: number) => void;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// Utility Types
export type Axis = 'x' | 'y' | 'z';
export type RotationValue = number; // in radians
