import { ThreeElements, Object3DNode } from '@react-three/fiber';
import { AmbientLight } from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: {
        intensity?: number;
      }
    }
  }
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    ambientLight: Object3DNode<AmbientLight, typeof AmbientLight>;
  }
}
