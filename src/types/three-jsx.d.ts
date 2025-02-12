/// <reference types="@react-three/fiber" />
import { ThreeElements } from '@react-three/fiber';
import { Mesh, Group, SphereGeometry, MeshStandardMaterial } from 'three';

declare module '@react-three/fiber' {
  interface ThreeElements {
    ambientLight: JSX.IntrinsicElements['ambientLight'];
    pointLight: JSX.IntrinsicElements['pointLight'];
    mesh: JSX.IntrinsicElements['mesh'];
    sphereGeometry: JSX.IntrinsicElements['sphereGeometry'];
    meshStandardMaterial: JSX.IntrinsicElements['meshStandardMaterial'];
    group: JSX.IntrinsicElements['group'];
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: { intensity?: number };
      pointLight: { position?: [number, number, number]; intensity?: number };
      mesh: ThreeElements['mesh'];
      sphereGeometry: { args?: [number, number, number] };
      meshStandardMaterial: ThreeElements['meshStandardMaterial'] & {
        map?: THREE.Texture;
        normalMap?: THREE.Texture;
        roughnessMap?: THREE.Texture;
        metalness?: number;
        roughness?: number;
      };
      group: ThreeElements['group'];
    }
  }
}
