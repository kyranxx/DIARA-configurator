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

router.get('/', (req, res) => {
  res.json(mockBeads);
});

module.exports = router;
