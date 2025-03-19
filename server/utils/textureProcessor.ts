// A simplified version of TextureProcessor that doesn't use Sharp
// This avoids native dependencies that cause issues in Vercel

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

export class TextureProcessor {
  private config: Required<TextureProcessorConfig>;

  constructor(config: TextureProcessorConfig = {}) {
    this.config = {
      defaultSize: config.defaultSize || TextureSize.MEDIUM,
      quality: config.quality || 80
    };
  }

  async validateImage(buffer: Buffer): Promise<{ width: number; height: number; format: string }> {
    try {
      // Simple validation - check if buffer is not empty
      if (!buffer || buffer.length === 0) {
        throw new Error('Invalid image: empty buffer');
      }
      
      // Return a simple metadata object
      return {
        width: 256,
        height: 256,
        format: 'jpeg'
      };
    } catch (error) {
      throw new Error(`Image validation failed: ${(error as Error).message}`);
    }
  }

  // In this version, we'll just pass through the original image
  // and use placeholders for normal and roughness maps
  async processBeadTexture(
    imageBuffer: Buffer, 
    options: ProcessBeadTextureOptions = {}
  ): Promise<ProcessedTextureResult> {
    try {
      await this.validateImage(imageBuffer);
      
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

  async generateNormalMap(_buffer: Buffer, _size: TextureSize): Promise<Buffer> {
    // Return placeholder normal map
    return NORMAL_SVG;
  }

  async generateRoughnessMap(_buffer: Buffer, _size: TextureSize): Promise<Buffer> {
    // Return placeholder roughness map
    return ROUGHNESS_SVG;
  }

  async optimizeTexture(buffer: Buffer, _size: TextureSize): Promise<Buffer> {
    // Just return the original buffer
    return buffer;
  }

  async generateMipMaps(buffer: Buffer): Promise<MipMaps> {
    // Return simple mipmaps using the same buffer for all sizes
    return {
      [TextureSize.SMALL]: buffer,
      [TextureSize.MEDIUM]: buffer,
      [TextureSize.LARGE]: buffer
    };
  }

  // Create placeholder
  async createPlaceholder(): Promise<Buffer> {
    return WHITE_SVG;
  }
}

// Create placeholder on init
const processor = new TextureProcessor();
processor.createPlaceholder()
  .then(async (buffer) => {
    try {
      // Write placeholder to file using fs instead of sharp
      const fs = await import('fs');
      const pathModule = await import('path');
      const outputPath = pathModule.join(__dirname, '../../public/images/placeholder-bead.jpg');
      fs.writeFileSync(outputPath, buffer);
    } catch (err) {
      console.error('Failed to write placeholder:', err);
    }
  })
  .catch(console.error);
