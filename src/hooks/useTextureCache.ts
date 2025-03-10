import { useLoader } from '@react-three/fiber';
import { TextureLoader, Texture } from 'three';
import { useMemo } from 'react';

// Global texture cache to prevent reloading the same textures
const textureCache = new Map<string, Texture>();

/**
 * Custom hook to load and cache textures
 * @param url The URL of the texture to load
 * @returns The loaded texture
 */
export function useTextureCache(url: string): Texture {
  // Use the useLoader hook from @react-three/fiber
  const texture = useLoader(TextureLoader, url);
  
  // Store in cache if not already there
  if (!textureCache.has(url)) {
    textureCache.set(url, texture);
  }
  
  return texture;
}

/**
 * Custom hook to load and cache multiple textures at once
 * @param urls An object with texture URLs
 * @returns An object with the same keys but with loaded textures as values
 */
export function useMultipleTextures<T extends Record<string, string>>(
  urls: T
): { [K in keyof T]: Texture } {
  const keys = Object.keys(urls) as Array<keyof T>;
  const urlValues = Object.values(urls);
  
  // Create an array of textures using the useTextureCache hook
  const textures = urlValues.map(url => useTextureCache(url));
  
  // Map the loaded textures back to their keys
  return useMemo(() => {
    const result = {} as { [K in keyof T]: Texture };
    
    keys.forEach((key, index) => {
      result[key] = textures[index];
    });
    
    return result;
  }, [textures, keys]);
}
