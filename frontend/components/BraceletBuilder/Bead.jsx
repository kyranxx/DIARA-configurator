import React, { useRef, useEffect, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const Bead = React.forwardRef(({ position, textureProps, selected, onClick }, ref) => {
  const [textures, setTextures] = useState({
    map: null,
    normalMap: null,
    roughnessMap: null
  });

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    const defaultTexture = textureLoader.load('/images/placeholder-bead.jpg');
    defaultTexture.encoding = THREE.sRGBEncoding;

    setTextures({
      map: defaultTexture,
      normalMap: null,
      roughnessMap: null
    });
  }, []);

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={onClick}
    >
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial
        map={textures.map}
        normalMap={textures.normalMap}
        roughnessMap={textures.roughnessMap}
        metalness={0.5}
        roughness={0.5}
        color={selected ? '#ff0000' : '#ffffff'}
        envMapIntensity={1}
      />
    </mesh>
  );
});

Bead.displayName = 'Bead';
export default Bead;
