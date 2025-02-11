import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Bead from './Bead';

const LoadingScreen = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-lg font-medium text-gray-700">Loading 3D Scene...</p>
    </div>
  </div>
);

const BraceletBand = () => (
  <mesh receiveShadow>
    <torusGeometry args={[5, 0.2, 16, 100]} />
    <meshStandardMaterial
      color={0xC0C0C0}
      metalness={0.8}
      roughness={0.2}
      envMapIntensity={1}
    />
  </mesh>
);

const BraceletScene = ({ beads = Array(12).fill(null), selectedPosition, onBeadClick }) => {
  const sceneRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const calculateBeadPosition = (index) => {
    const angle = (index / 12) * Math.PI * 2;
    const offsetRadius = 5.5; // Bracelet radius + offset
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

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50">
        <div className="text-center p-4">
          <p className="text-red-600 text-lg mb-4">Error loading 3D scene</p>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {isLoading && <LoadingScreen />}
      
      <Canvas
        shadows
        onError={(e) => setError(e)}
        camera={{ position: [0, 0, 15], fov: 45 }}
      >
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
            <BraceletBand />
            
            {beads.map((bead, index) => (
              <Bead
                key={`bead-${index}`}
                position={calculateBeadPosition(index)}
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
