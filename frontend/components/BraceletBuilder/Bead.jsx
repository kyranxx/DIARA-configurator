import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const Bead = ({ position, texture, selected, onClick }) => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (selected) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        map={texture}
        metalness={0.5}
        roughness={0.2}
        envMapIntensity={1}
        emissive={selected ? 0x666666 : undefined}
      />
    </mesh>
  );
};

export default Bead;
