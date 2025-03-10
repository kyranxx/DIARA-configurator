import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMultipleTextures } from '@/hooks/useTextureCache';
import type { BeadPosition } from '@/types';
import '../../../src/types/three-jsx.d.ts';

interface BraceletSceneProps {
  beads: BeadPosition[];
  onBeadClick?: (index: number) => void;
}

// Separate Bead component to use within the Canvas
const BeadMesh: React.FC<{
  bead: BeadPosition;
  position: [number, number, number];
  onClick: () => void;
}> = ({ bead, position, onClick }) => {
  // Use our custom texture caching hook
  const textures = useMultipleTextures({
    diffuse: bead.bead.textures.diffuse,
    normal: bead.bead.textures.normal,
    roughness: bead.bead.textures.roughness,
  });

  return (
    <mesh position={position} rotation={bead.rotation} onClick={onClick}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial 
        map={textures.diffuse}
        normalMap={textures.normal}
        roughnessMap={textures.roughness}
        metalness={0.5}
        roughness={0.7}
      />
    </mesh>
  );
};

export const BraceletScene: React.FC<BraceletSceneProps> = ({ beads, onBeadClick }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ width: '100%', height: '400px' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.0} />
      
      {beads.map((beadPos, index) => (
        <BeadMesh
          key={`${beadPos.bead.id}-${index}`}
          bead={beadPos}
          position={[index * 1.2 - (beads.length - 1) * 0.6, 0, 0]}
          onClick={() => onBeadClick?.(index)}
        />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={10}
      />
    </Canvas>
  );
};
