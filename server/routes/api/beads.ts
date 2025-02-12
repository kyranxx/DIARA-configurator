import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import type { Bead } from '../../../types';

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

    // Process image and create variations
    const timestamp = Date.now();
    const filename = `bead-${timestamp}`;
    const imageBuffer = req.file.buffer;

    // Save different texture maps
    const [diffuse, normal, roughness] = await Promise.all([
      sharp(imageBuffer)
        .resize(512, 512)
        .jpeg({ quality: 90 })
        .toFile(path.join(__dirname, `../../../src/assets/images/${filename}-diffuse.jpg`)),
      sharp(imageBuffer)
        .resize(512, 512)
        .greyscale()
        .normalise()
        .jpeg({ quality: 90 })
        .toFile(path.join(__dirname, `../../../src/assets/images/${filename}-normal.jpg`)),
      sharp(imageBuffer)
        .resize(512, 512)
        .greyscale()
        .jpeg({ quality: 90 })
        .toFile(path.join(__dirname, `../../../src/assets/images/${filename}-roughness.jpg`))
    ]);

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
