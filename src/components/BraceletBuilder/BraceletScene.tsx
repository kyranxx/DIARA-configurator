import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Bead } from './Bead';
import type { BeadPosition } from '../../../types';

interface BraceletSceneProps {
  beads: BeadPosition[];
  onBeadClick?: (index: number) => void;
}

export const BraceletScene: React.FC<BraceletSceneProps> = ({ beads, onBeadClick }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ width: '100%', height: '400px' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.0} />
      
      {beads.map((beadPos, index) => (
        <Bead
          key={`${beadPos.bead.id}-${index}`}
          bead={beadPos.bead}
          position={[index * 1.2 - (beads.length - 1) * 0.6, 0, 0]}
          rotation={beadPos.rotation}
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
