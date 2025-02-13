import { Object3DNode, extend } from '@react-three/fiber';
import { 
  PointLight, 
  Mesh, 
  SphereGeometry, 
  MeshStandardMaterial,
  TextureLoader,
  Color,
  Vector3
} from 'three';

// Register Three.js elements
extend({ 
  PointLight, 
  Mesh, 
  SphereGeometry, 
  MeshStandardMaterial 
});

declare global {
  namespace JSX {
    interface IntrinsicElements {
      pointLight: Object3DNode<PointLight, typeof PointLight> & {
        position?: [number, number, number];
        intensity?: number;
        color?: Color | string | number;
      };
      mesh: Object3DNode<Mesh, typeof Mesh> & {
        position?: [number, number, number];
        rotation?: [number, number, number];
        onClick?: () => void;
      };
      sphereGeometry: Object3DNode<SphereGeometry, typeof SphereGeometry> & {
        args?: [radius?: number, widthSegments?: number, heightSegments?: number];
      };
      meshStandardMaterial: Object3DNode<MeshStandardMaterial, typeof MeshStandardMaterial> & {
        map?: THREE.Texture;
        normalMap?: THREE.Texture;
        roughnessMap?: THREE.Texture;
        metalness?: number;
        roughness?: number;
      };
    }
  }
}

// Add Three.js specific type augmentations
declare module '@react-three/fiber' {
  interface ThreeElements {
    pointLight: Object3DNode<PointLight, typeof PointLight>;
    mesh: Object3DNode<Mesh, typeof Mesh>;
    sphereGeometry: Object3DNode<SphereGeometry, typeof SphereGeometry>;
    meshStandardMaterial: Object3DNode<MeshStandardMaterial, typeof MeshStandardMaterial>;
  }
}
