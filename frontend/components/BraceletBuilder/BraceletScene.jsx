import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Bead from './Bead';

const BraceletScene = ({ beads = Array(12).fill(null), selectedPosition, onBeadClick }) => {
  const sceneRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const BRACELET_RADIUS = 5;
  const BEAD_POSITIONS = 12;
  
  const calculateBeadPosition = (index) => {
    const angle = (index / BEAD_POSITIONS) * Math.PI * 2;
    const offsetRadius = BRACELET_RADIUS + 0.5;
    return [
      Math.cos(angle) * offsetRadius,
      Math.sin(angle) * offsetRadius,
      0
    ];
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const LoadingScreen = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
      <p className="text-lg font-medium">Loading 3D Scene...</p>
    </div>
  );

  return (
    <div className="w-full h-full relative">
      {isLoading && <LoadingScreen />}
      
      <Canvas shadows>
        <Suspense fallback={null}>
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
              <Bead
                key={`bead-${index}`}
                position={calculateBeadPosition(index)}
                textureProps={{
                  map: bead?.textures?.diffuse,
                  normalMap: bead?.textures?.normal,
                  roughnessMap: bead?.textures?.roughness
                }}
                selected={selectedPosition === index}
                onClick={() => onBeadClick(index)}
              />
            ))}
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default BraceletScene;
