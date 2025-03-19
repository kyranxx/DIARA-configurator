// A simplified version of TextureProcessor for Vercel deployment
// This avoids using Sharp which has native dependencies that cause issues in Vercel

export enum TextureSize {
  LARGE = 1024,
  MEDIUM = 512,
  SMALL = 256
}

interface TextureProcessorConfig {
  defaultSize?: TextureSize;
  quality?: number;
}

interface TextureMetadata {
  size: TextureSize;
  quality: number;
  timestamp: string;
}

interface ProcessedTextures {
  diffuse: Buffer;
  normal: Buffer;
  roughness: Buffer;
}

interface MipMaps {
  [key: number]: Buffer;
}

interface ProcessedTextureResult {
  textures: ProcessedTextures;
  mipMaps: MipMaps | null;
  metadata: TextureMetadata;
}

interface ProcessBeadTextureOptions {
  size?: TextureSize;
  generateMips?: boolean;
}

// Placeholder SVG for white texture
const WHITE_SVG = Buffer.from(
  '<svg><rect width="256" height="256" fill="#FFFFFF"/></svg>'
);

// Placeholder SVG for normal map (blue)
const NORMAL_SVG = Buffer.from(
  '<svg><rect width="256" height="256" fill="#8080FF"/></svg>'
);

// Placeholder SVG for roughness map (gray)
const ROUGHNESS_SVG = Buffer.from(
  '<svg><rect width="256" height="256" fill="#808080"/></svg>'
);

export class TextureProcessorVercel {
  private config: Required<TextureProcessorConfig>;

  constructor(config: TextureProcessorConfig = {}) {
    this.config = {
      defaultSize: config.defaultSize || TextureSize.MEDIUM,
      quality: config.quality || 80
    };
  }

  // In Vercel, we'll just pass through the original image
  // and use placeholders for normal and roughness maps
  async processBeadTexture(
    imageBuffer: Buffer, 
    options: ProcessBeadTextureOptions = {}
  ): Promise<ProcessedTextureResult> {
    try {
      const size = options.size || this.config.defaultSize;
      
      return {
        textures: {
          diffuse: imageBuffer, // Pass through the original image
          normal: NORMAL_SVG,   // Use placeholder for normal map
          roughness: ROUGHNESS_SVG // Use placeholder for roughness map
        },
        mipMaps: null,
        metadata: {
          size,
          quality: this.config.quality,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      throw new Error(`Texture processing failed: ${(error as Error).message}`);
    }
  }

  // Create placeholder
  async createPlaceholder(): Promise<Buffer> {
    return WHITE_SVG;
  }
}
