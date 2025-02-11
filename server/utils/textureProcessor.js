const sharp = require('sharp');

const TEXTURE_SIZES = {
  LARGE: 1024,
  MEDIUM: 512,
  SMALL: 256
};

class TextureProcessor {
  constructor(config = {}) {
    this.config = {
      defaultSize: TEXTURE_SIZES.MEDIUM,
      quality: 80,
      ...config
    };
  }

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

  async generateRoughnessMap(buffer, size) {
    try {
      return await sharp(buffer)
        .resize(size, size)
        .greyscale()
        .linear(1.5, -0.1)
        .normalize()
        .toBuffer();
    } catch (error) {
      throw new Error(`Roughness map generation failed: ${error.message}`);
    }
  }

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

  async processBeadTexture(imageBuffer, options = {}) {
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
      throw new Error(`Texture processing failed: ${error.message}`);
    }
  }

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

  // Add method to create placeholder
  async createPlaceholder() {
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

module.exports = { TextureProcessor };
