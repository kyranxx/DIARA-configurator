const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

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

app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/beads', (req, res) => {
  res.json(mockBeads);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
