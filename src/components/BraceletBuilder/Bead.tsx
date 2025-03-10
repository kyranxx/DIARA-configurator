import React from 'react';
import { Sphere } from '@react-three/drei';
import { useMultipleTextures } from '@/hooks/useTextureCache';
import type { Bead as BeadType } from '@/types';
import { MeshStandardMaterial } from 'three';

interface BeadProps {
  bead: BeadType;
  position: [number, number, number];
  rotation: [number, number, number];
  onClick?: () => void;
}

export const Bead: React.FC<BeadProps> = ({ bead, position, rotation, onClick }) => {
  // Use the texture cache hook to load and cache textures
  const textures = useMultipleTextures({
    diffuse: bead.textures.diffuse,
    normal: bead.textures.normal,
    roughness: bead.textures.roughness
  });

  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      <Sphere args={[0.5, 32, 32]}>
        <primitive object={
          new MeshStandardMaterial({
            map: textures.diffuse,
            normalMap: textures.normal,
            roughnessMap: textures.roughness,
            metalness: 0.5,
            roughness: 0.7
          })
        } />
      </Sphere>
    </group>
  );
};
