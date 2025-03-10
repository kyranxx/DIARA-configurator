import { ReactThreeFiber } from '@react-three/fiber';
import { 
  PointLight, 
  Mesh, 
  SphereGeometry, 
  MeshStandardMaterial,
  TextureLoader,
  Color,
  Vector3
} from 'three';

// Extend the JSX namespace to include Three.js elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      pointLight: ReactThreeFiber.Object3DNode<PointLight, typeof PointLight>;
      mesh: ReactThreeFiber.Object3DNode<Mesh, typeof Mesh>;
      sphereGeometry: ReactThreeFiber.Object3DNode<SphereGeometry, typeof SphereGeometry>;
      meshStandardMaterial: ReactThreeFiber.Object3DNode<MeshStandardMaterial, typeof MeshStandardMaterial>;
    }
  }
}

// This file doesn't export anything, it just augments the global namespace
