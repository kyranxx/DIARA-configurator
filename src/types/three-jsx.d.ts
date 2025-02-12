/// <reference types="@react-three/fiber" />
import { ThreeElements } from '@react-three/fiber';

declare module '@react-three/fiber' {
  interface ThreeElements {
    mesh: any;
    sphereGeometry: any;
    meshStandardMaterial: any;
    pointLight: any;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
