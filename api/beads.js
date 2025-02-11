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

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(mockBeads);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
