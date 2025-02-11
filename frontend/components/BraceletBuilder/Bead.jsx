import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';

const Bead = React.forwardRef(({ position, selected, onClick }, ref) => {
  const [texture, setTexture] = useState(null);
  const meshRef = useRef();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/images/placeholder-bead.jpg',
      (loadedTexture) => {
        loadedTexture.encoding = THREE.sRGBEncoding;
        loadedTexture.needsUpdate = true;
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
      }
    );
  }, []);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.5,
      roughness: 0.5,
      color: selected ? '#ff0000' : '#ffffff',
      envMapIntensity: 1
    });
  }, [texture, selected]);

  return (
    <mesh
      ref={(node) => {
        meshRef.current = node;
        if (ref) {
          if (typeof ref === 'function') {
            ref(node);
          } else {
            ref.current = node;
          }
        }
      }}
      position={position}
      onClick={onClick}
    >
      <sphereGeometry args={[0.4, 32, 32]} />
      {material && <primitive object={material} attach="material" />}
    </mesh>
  );
});

Bead.displayName = 'Bead';
export default Bead;
