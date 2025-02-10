import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import Bead from './Bead';

const BraceletScene = ({ beads, selectedPosition, onBeadClick }) => {
  const sceneRef = useRef();
  const BRACELET_RADIUS = 5;
  const BEAD_POSITIONS = 12;
  
  const calculateBeadPosition = (index) => {
    const angle = (index / BEAD_POSITIONS) * Math.PI * 2;
    return [
      Math.cos(angle) * BRACELET_RADIUS,
      Math.sin(angle) * BRACELET_RADIUS,
      0
    ];
  };

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} />
      <OrbitControls
        enablePan={false}
        minDistance={10}
        maxDistance={20}
        minPolarAngle={Math.PI/4}
        maxPolarAngle={Math.PI*3/4}
      />
      
      <Environment preset="studio" />
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
      />

      <group ref={sceneRef}>
        <mesh>
          <torusGeometry args={[BRACELET_RADIUS, 0.2, 16, 100]} />
          <meshStandardMaterial
            color={0xC0C0C0}
            metalness={0.8}
            roughness={0.2}
            envMapIntensity={1}
          />
        </mesh>
        
        {beads.map((bead, index) => (
          <Bead
            key={index}
            position={calculateBeadPosition(index)}
            texture={bead?.texture}
            selected={selectedPosition === index}
            onClick={() => onBeadClick(index)}
          />
        ))}
      </group>
    </Canvas>
  );
};

export default BraceletScene;
