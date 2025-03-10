import { Object3DNode } from '@react-three/fiber';
import { 
  PointLight, 
  Mesh, 
  SphereGeometry, 
  MeshStandardMaterial,
  Group,
  AmbientLight,
  Object3D
} from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: Object3DNode<AmbientLight, typeof AmbientLight>;
      pointLight: Object3DNode<PointLight, typeof PointLight>;
      group: Object3DNode<Group, typeof Group>;
      mesh: Object3DNode<Mesh, typeof Mesh>;
      sphereGeometry: Object3DNode<SphereGeometry, typeof SphereGeometry>;
      meshStandardMaterial: Object3DNode<MeshStandardMaterial, typeof MeshStandardMaterial>;
      primitive: { object: Object3D };
    }
  }
}
