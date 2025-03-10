import sharp from 'sharp';
import { Metadata } from 'sharp';

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

export class TextureProcessor {
  private config: Required<TextureProcessorConfig>;

  constructor(config: TextureProcessorConfig = {}) {
    this.config = {
      defaultSize: config.defaultSize || TextureSize.MEDIUM,
      quality: config.quality || 80
    };
  }

  async validateImage(buffer: Buffer): Promise<Metadata> {
    try {
      const metadata = await sharp(buffer).metadata();
      
      if (!metadata.width || !metadata.height) {
        throw new Error('Invalid image dimensions');
      }

      if (metadata.width < 256 || metadata.height < 256) {
        throw new Error('Image too small - minimum 256x256 pixels required');
      }

      return metadata;
    } catch (error) {
      throw new Error(`Image validation failed: ${(error as Error).message}`);
    }
  }

  async generateNormalMap(buffer: Buffer, size: TextureSize): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .resize(size, size, { fit: 'contain' })
        .greyscale()
        .normalize()
        .modulate({
          brightness: 1.2,
          saturation: 1.5
        })
        .toBuffer();
    } catch (error) {
      throw new Error(`Normal map generation failed: ${(error as Error).message}`);
    }
  }

  async generateRoughnessMap(buffer: Buffer, size: TextureSize): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .resize(size, size)
        .greyscale()
        .linear(1.5, -0.1)
        .normalize()
        .toBuffer();
    } catch (error) {
      throw new Error(`Roughness map generation failed: ${(error as Error).message}`);
    }
  }

  async optimizeTexture(buffer: Buffer, size: TextureSize): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .resize(size, size, { fit: 'contain' })
        .jpeg({ quality: this.config.quality })
        .toBuffer();
    } catch (error) {
      throw new Error(`Texture optimization failed: ${(error as Error).message}`);
    }
  }

  async processBeadTexture(
    imageBuffer: Buffer, 
    options: ProcessBeadTextureOptions = {}
  ): Promise<ProcessedTextureResult> {
    try {
      await this.validateImage(imageBuffer);

      const size = options.size || this.config.defaultSize;
      const generateMips = options.generateMips || false;

      const [diffuse, normal, roughness] = await Promise.all([
        this.optimizeTexture(imageBuffer, size),
        this.generateNormalMap(imageBuffer, size),
        this.generateRoughnessMap(imageBuffer, size)
      ]);

      const mipMaps = generateMips ? await this.generateMipMaps(imageBuffer) : null;

      return {
        textures: {
          diffuse,
          normal,
          roughness
        },
        mipMaps,
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

  async generateMipMaps(buffer: Buffer): Promise<MipMaps> {
    try {
      const sizes = [TextureSize.SMALL, TextureSize.MEDIUM, TextureSize.LARGE];
      
      const mipMaps = await Promise.all(
        sizes.map(size => this.optimizeTexture(buffer, size))
      );

      return sizes.reduce((acc, size, index) => {
        acc[size] = mipMaps[index];
        return acc;
      }, {} as MipMaps);
    } catch (error) {
      throw new Error(`Mipmap generation failed: ${(error as Error).message}`);
    }
  }

  // Add method to create placeholder
  async createPlaceholder(): Promise<Buffer> {
    const whiteBuffer = Buffer.from(
      '<svg><rect width="256" height="256" fill="#FFFFFF"/></svg>'
    );

    const jpgBuffer = await sharp(whiteBuffer)
      .resize(256, 256)
      .jpeg()
      .toBuffer();

    return jpgBuffer;
  }
}

// Create placeholder on init
const processor = new TextureProcessor();
processor.createPlaceholder()
  .then(buffer => sharp(buffer).toFile('public/images/placeholder-bead.jpg'))
  .catch(console.error);
