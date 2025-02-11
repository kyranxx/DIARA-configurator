import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Bead from './Bead';

const BeadWithTextures = ({ position, beadData, selected, onClick }) => {
  // Create placeholder texture if none provided
  const defaultTexture = new THREE.TextureLoader().load('/placeholder-bead.jpg');
  const meshRef = useRef();
  
  return (
    <Bead
      ref={meshRef}
      position={position}
      textureProps={{
        map: beadData?.textures?.diffuse || defaultTexture,
        normalMap: beadData?.textures?.normal,
        roughnessMap: beadData?.textures?.roughness
      }}
      selected={selected}
      onClick={onClick}
    />
  );
};

const BraceletScene = ({ beads = Array(12).fill(null), selectedPosition, onBeadClick }) => {
  const sceneRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const BRACELET_RADIUS = 5;
  const BEAD_POSITIONS = 12;
  
  const calculateBeadPosition = (index) => {
    const angle = (index / BEAD_POSITIONS) * Math.PI * 2;
    const x = Math.cos(angle) * BRACELET_RADIUS;
    const y = Math.sin(angle) * BRACELET_RADIUS;
    // Offset beads slightly outward from the bracelet band
    const offsetRadius = BRACELET_RADIUS + 0.5;
    return [
      Math.cos(angle) * offsetRadius,
      Math.sin(angle) * offsetRadius,
      0
    ];
  };

  useEffect(() => {
    if (sceneRef.current) {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
          <p className="text-lg font-medium">Loading 3D Scene...</p>
        </div>
      )}
      
      <Canvas>
        <PerspectiveCamera
          makeDefault
          position={[0, 0, 15]}
          fov={45}
          near={0.1}
          far={1000}
        />
        
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
          castShadow
        />

        <group ref={sceneRef}>
          {/* Bracelet band */}
          <mesh receiveShadow>
            <torusGeometry args={[BRACELET_RADIUS, 0.2, 16, 100]} />
            <meshStandardMaterial
              color={0xC0C0C0}
              metalness={0.8}
              roughness={0.2}
              envMapIntensity={1}
            />
          </mesh>
          
          {/* Bead positions */}
          {beads.map((bead, index) => (
            <BeadWithTextures
              key={`bead-${index}`}
              position={calculateBeadPosition(index)}
              beadData={bead}
              selected={selectedPosition === index}
              onClick={() => onBeadClick(index)}
            />
          ))}
        </group>
      </Canvas>
    </div>
  );
};

export default BraceletScene;
