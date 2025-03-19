import express from 'express';
import multer from 'multer';
import path from 'path';
import type { Bead } from '../../../types';
import { TextureSize } from '../../utils/textureProcessor';
import { TextureProcessor as OriginalTextureProcessor } from '../../utils/textureProcessor';
import { TextureProcessorVercel } from '../../utils/textureProcessorVercel';

// Check if running on Vercel
const isVercel = process.env.VERCEL === '1';

// Use the appropriate TextureProcessor based on environment
// This helps avoid Sharp-related issues in Vercel
const TextureProcessor = isVercel ? TextureProcessorVercel : OriginalTextureProcessor;

const router = express.Router();

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type'));
      return;
    }
    cb(null, true);
  }
});

// In-memory store for beads (replace with database in production)
let beads: Bead[] = [];

// Get all beads
router.get('/', (_, res) => {
  res.json(beads);
});

// Add new bead
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const { name, price, stock } = req.body;
    if (!name || !price || !stock) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Process image and create variations using TextureProcessor
    const timestamp = Date.now();
    const filename = `bead-${timestamp}`;
    const imageBuffer = req.file.buffer;
    const outputDir = path.join(__dirname, '../../../src/assets/images');
    
    // Create texture processor with high quality settings
    const processor = new TextureProcessor({
      defaultSize: TextureSize.MEDIUM,
      quality: 90
    });
    
    // Process the image to generate textures
    const processedTextures = await processor.processBeadTexture(imageBuffer);
    
    // Save the processed textures to files
    if (isVercel) {
      // In Vercel, we'll use a simpler approach without Sharp
      // Using dynamic import to avoid ESLint errors
      const fsPromises = await import('fs/promises');
      await Promise.all([
        fsPromises.writeFile(path.join(outputDir, `${filename}-diffuse.jpg`), processedTextures.textures.diffuse),
        fsPromises.writeFile(path.join(outputDir, `${filename}-normal.jpg`), processedTextures.textures.normal),
        fsPromises.writeFile(path.join(outputDir, `${filename}-roughness.jpg`), processedTextures.textures.roughness)
      ]);
    } else {
      // In local development, use Sharp
      // Using dynamic import to avoid ESLint errors
      const sharpModule = await import('sharp');
      const sharp = sharpModule.default;
      await Promise.all([
        sharp(processedTextures.textures.diffuse)
          .toFile(path.join(outputDir, `${filename}-diffuse.jpg`)),
        sharp(processedTextures.textures.normal)
          .toFile(path.join(outputDir, `${filename}-normal.jpg`)),
        sharp(processedTextures.textures.roughness)
          .toFile(path.join(outputDir, `${filename}-roughness.jpg`))
      ]);
    }

    const newBead: Bead = {
      id: beads.length + 1,
      name,
      price: Number(price),
      stock: Number(stock),
      imageUrl: `/images/${filename}-diffuse.jpg`,
      textures: {
        diffuse: `/images/${filename}-diffuse.jpg`,
        normal: `/images/${filename}-normal.jpg`,
        roughness: `/images/${filename}-roughness.jpg`
      }
    };

    beads.push(newBead);
    res.status(201).json(newBead);
  } catch (error) {
    console.error('Error processing bead:', error);
    res.status(500).json({ error: 'Failed to process bead' });
  }
});

// Update bead
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;
  
  const index = beads.findIndex(b => b.id === Number(id));
  if (index === -1) {
    return res.status(404).json({ error: 'Bead not found' });
  }

  beads[index] = {
    ...beads[index],
    ...(name && { name }),
    ...(price && { price: Number(price) }),
    ...(stock && { stock: Number(stock) })
  };

  res.json(beads[index]);
});

// Delete bead
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = beads.findIndex(b => b.id === Number(id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Bead not found' });
  }

  beads = beads.filter(b => b.id !== Number(id));
  res.status(204).send();
});

export default router;
