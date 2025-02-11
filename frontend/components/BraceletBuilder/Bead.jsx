import React, { useRef, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

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
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
    >
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial
        {...textureProps}
        metalness={0.5}
        roughness={0.5}
        color={selected ? '#ff0000' : '#ffffff'}
        envMapIntensity={1}
      />
    </mesh>
  );
};

export default BeadWithTextures;
