import { ReactThreeFiber } from '@react-three/fiber';
import type {
  Mesh,
  Group,
  Object3D,
  Material,
  BufferGeometry,
  Light,
  PointLight,
  AmbientLight,
  SphereGeometry,
  MeshStandardMaterial
} from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: ReactThreeFiber.Object3DNode<Group, typeof Group>;
      mesh: ReactThreeFiber.Object3DNode<Mesh, typeof Mesh>;
      ambientLight: ReactThreeFiber.Object3DNode<AmbientLight, typeof AmbientLight>;
      pointLight: ReactThreeFiber.Object3DNode<PointLight, typeof PointLight>;
      sphereGeometry: ReactThreeFiber.BufferGeometryNode<SphereGeometry, typeof SphereGeometry>;
      meshStandardMaterial: ReactThreeFiber.MaterialNode<MeshStandardMaterial, typeof MeshStandardMaterial>;
    }
  }
}
