import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import Bead from './Bead';

const BeadWithTextures = ({ position, beadData, selected, onClick }) => {
  const textureProps = useTexture({
    map: beadData?.textures?.diffuse,
    normalMap: beadData?.textures?.normal,
    roughnessMap: beadData?.textures?.roughness
  });

  const meshRef = useRef();
  
  useEffect(() => {
    if (textureProps.map) {
      textureProps.map.encoding = THREE.sRGBEncoding;
      textureProps.map.needsUpdate = true;
    }
  }, [textureProps.map]);

  return (
    <Bead
      ref={meshRef}
      position={position}
      textureProps={textureProps}
      selected={selected}
      onClick={onClick}
    />
  );
};

const BraceletScene = ({ beads, selectedPosition, onBeadClick }) => {
  const sceneRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
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
          target={[0, 0, 0]}
        />
        
        <Environment preset="studio" intensity={1} />
        <ambientLight intensity={0.5} />
        
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        <directionalLight
          position={[-10, -10, -10]}
          intensity={0.2}
        />

        <group ref={sceneRef}>
          <mesh receiveShadow>
            <torusGeometry args={[BRACELET_RADIUS, 0.2, 16, 100]} />
            <meshStandardMaterial
              color={0xC0C0C0}
              metalness={0.8}
              roughness={0.2}
              envMapIntensity={1}
            />
          </mesh>
          
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
