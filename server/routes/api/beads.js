const express = require('express');
const router = express.Router();

const mockBeads = [
  {
    id: 1,
    name: "Pearl Bead",
    price: 29.99,
    imageUrl: "/images/placeholder-bead.jpg",
    stock: 10,
    textures: {
      diffuse: "/images/placeholder-bead.jpg",
      normal: "/images/placeholder-bead.jpg", 
      roughness: "/images/placeholder-bead.jpg"
    }
  }
];

// Get all beads
router.get('/', async (req, res, next) => {
  try {
    console.log('GET /api/beads - Fetching all beads');
    res.json(mockBeads);
  } catch (error) {
    console.error('Error fetching beads:', error);
    next(error);
  }
});

// Get single bead by ID
router.get('/:id', async (req, res, next) => {
  try {
    console.log(`GET /api/beads/${req.params.id} - Fetching single bead`);
    const bead = mockBeads.find(b => b.id === parseInt(req.params.id));
    
    if (!bead) {
      return res.status(404).json({
        error: 'Bead not found',
        id: req.params.id
      });
    }
    
    res.json(bead);
  } catch (error) {
    console.error('Error fetching bead:', error);
    next(error);
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;
