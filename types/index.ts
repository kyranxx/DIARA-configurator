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
  rotation: [number, number, number];
  bead: Bead;
}

export interface BraceletConfig {
  beads: BeadPosition[];
  totalPrice: number;
}
