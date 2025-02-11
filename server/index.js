const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// Mock beads data
const mockBeads = [
  {
    id: 1,
    name: "Pearl Bead",
    price: 29.99,
    imageUrl: "/placeholder-bead.jpg",
    stock: 10
  },
  {
    id: 2,
    name: "Crystal Bead",
    price: 39.99,
    imageUrl: "/placeholder-bead.jpg",
    stock: 15
  }
];

// Serve static files from public directory
app.use(express.static('public'));

// API routes
app.get('/api/beads', (req, res) => {
  res.json(mockBeads);
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
