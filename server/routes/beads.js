import express from 'express';
import { Shopify } from '@shopify/shopify-api';
import multer from 'multer';
import { processBeadTexture } from '../utils/textureProcessor';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all available beads
router.get('/beads', async (req, res) => {
  try {
    const client = new Shopify.Clients.Rest(req.shop, req.accessToken);
    
    const response = await client.get({
      path: 'products',
      query: { tag: 'bead' }
    });
    
    const beads = response.body.products.map(product => ({
      id: product.id,
      name: product.title,
      price: product.variants[0].price,
      imageUrl: product.images[0]?.src,
      textureUrl: product.metafields.find(m => m.key === 'texture_url')?.value,
      stock: product.variants[0].inventory_quantity
    }));
    
    res.json(beads);
  } catch (error) {
    console.error('Error fetching beads:', error);
    res.status(500).json({ error: 'Failed to fetch beads' });
  }
});

// Add new bead
router.post('/beads', upload.single('image'), async (req, res) => {
  try {
    const { name, price } = req.body;
    const image = req.file;

    const textureData = await processBeadTexture(image.buffer);
    
    const client = new Shopify.Clients.Rest(req.shop, req.accessToken);
    
    const productResponse = await client.post({
      path: 'products',
      body: {
        product: {
          title: name,
          variants: [{
            price: price,
            inventory_management: 'shopify'
          }],
          tags: ['bead'],
          images: [{
            attachment: image.buffer.toString('base64')
          }]
        }
      }
    });

    // Add texture maps as metafields
    await client.post({
      path: `products/${productResponse.body.product.id}/metafields`,
      body: {
        metafield: {
          namespace: 'texture',
          key: 'texture_url',
          value: textureData.textureUrl,
          type: 'single_line_text_field'
        }
      }
    });

    res.json({
      success: true,
      product: productResponse.body.product
    });
  } catch (error) {
    console.error('Error creating bead:', error);
    res.status(500).json({ error: 'Failed to create bead' });
  }
});

export default router;
