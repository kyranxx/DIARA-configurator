import sharp from 'sharp';

const TEXTURE_SIZES = {
  LARGE: 1024,
  MEDIUM: 512,
  SMALL: 256
};

/**
 * Processes bead images to generate texture maps for 3D rendering
 * Includes optimization, error handling, and multi-resolution support
 */
export class TextureProcessor {
  constructor(config = {}) {
    this.config = {
      defaultSize: TEXTURE_SIZES.MEDIUM,
      quality: 80,
      ...config
    };
  }

  /**
   * Validates input image and ensures it meets minimum requirements
   */
  async validateImage(buffer) {
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
      throw new Error(`Image validation failed: ${error.message}`);
    }
  }

  /**
   * Generates a normal map from the input image
   */
  async generateNormalMap(buffer, size) {
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
      throw new Error(`Normal map generation failed: ${error.message}`);
    }
  }

  /**
   * Generates a roughness map from the input image
   */
  async generateRoughnessMap(buffer, size) {
    try {
      return await sharp(buffer)
        .resize(size, size)
        .greyscale()
        .linear(1.5, -0.1) // Adjust contrast for better material properties
        .normalize()
        .toBuffer();
    } catch (error) {
      throw new Error(`Roughness map generation failed: ${error.message}`);
    }
  }

  /**
   * Optimizes the base texture for web delivery
   */
  async optimizeTexture(buffer, size) {
    try {
      return await sharp(buffer)
        .resize(size, size, { fit: 'contain' })
        .jpeg({ quality: this.config.quality })
        .toBuffer();
    } catch (error) {
      throw new Error(`Texture optimization failed: ${error.message}`);
    }
  }

  /**
   * Processes an image into all necessary texture maps with optional multi-resolution support
   */
  async processBeadTexture(imageBuffer, options = {}) {
    try {
      // Validate input image
      await this.validateImage(imageBuffer);

      const size = options.size || this.config.defaultSize;
      const generateMips = options.generateMips || false;

      // Generate all required textures
      const [diffuse, normal, roughness] = await Promise.all([
        this.optimizeTexture(imageBuffer, size),
        this.generateNormalMap(imageBuffer, size),
        this.generateRoughnessMap(imageBuffer, size)
      ]);

      // Generate mipmaps if requested
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
      throw new Error(`Texture processing failed: ${error.message}`);
    }
  }

  /**
   * Generates mipmap textures for progressive loading
   */
  async generateMipMaps(buffer) {
    try {
      const sizes = [TEXTURE_SIZES.SMALL, TEXTURE_SIZES.MEDIUM, TEXTURE_SIZES.LARGE];
      
      const mipMaps = await Promise.all(
        sizes.map(size => this.optimizeTexture(buffer, size))
      );

      return sizes.reduce((acc, size, index) => {
        acc[size] = mipMaps[index];
        return acc;
      }, {});
    } catch (error) {
      throw new Error(`Mipmap generation failed: ${error.message}`);
    }
  }
}

// Usage example:
// const processor = new TextureProcessor({ quality: 85 });
// const textureData = await processor.processBeadTexture(imageBuffer, { 
//   size: TEXTURE_SIZES.LARGE,
//   generateMips: true 
// });
