import React from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import type { Bead as BeadType } from '../../../types';

interface BeadProps {
  bead: BeadType;
  position: [number, number, number];
  rotation: [number, number, number];
  onClick?: () => void;
}

export const Bead: React.FC<BeadProps> = ({ bead, position, rotation, onClick }) => {
  const diffuseMap = useLoader(TextureLoader, bead.textures.diffuse);
  const normalMap = useLoader(TextureLoader, bead.textures.normal);
  const roughnessMap = useLoader(TextureLoader, bead.textures.roughness);

  return (
    <mesh position={position} rotation={rotation} onClick={onClick}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        map={diffuseMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        metalness={0.5}
        roughness={0.7}
      />
    </mesh>
  );
};
