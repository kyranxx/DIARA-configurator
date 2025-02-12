const express = require('express');
const { Shopify } = require('@shopify/shopify-api');
const multer = require('multer');
const { TextureProcessor } = require('../utils/textureProcessor');

const router = express.Router();
const textureProcessor = new TextureProcessor({
  quality: 85,
  defaultSize: 512
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'));
      return;
    }
    cb(null, true);
  }
});

const handleErrors = (err, req, res, next) => {
  console.error('Error:', err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: 'File upload error',
      details: err.message
    });
  }
  res.status(500).json({
    error: 'Internal server error',
    details: err.message
  });
};

router.get('/beads', async (req, res, next) => {
  try {
    const client = new Shopify.Clients.Rest(req.shop, req.accessToken);
    
    const [productsResponse, metafieldsResponse] = await Promise.all([
      client.get({
        path: 'products',
        query: { 
          tag: 'bead',
          status: 'active',
          fields: 'id,title,variants,images,updated_at'
        }
      }),
      client.get({
        path: 'metafields',
        query: { namespace: 'texture' }
      })
    ]);
    
    const beadsWithTextures = productsResponse.body.products.map(product => {
      const textureMetafields = metafieldsResponse.body.metafields
        .filter(m => m.owner_id === product.id);

      return {
        id: product.id,
        name: product.title,
        price: product.variants[0].price,
        imageUrl: product.images[0]?.src,
        textures: {
          diffuse: textureMetafields.find(m => m.key === 'texture_diffuse')?.value,
          normal: textureMetafields.find(m => m.key === 'texture_normal')?.value,
          roughness: textureMetafields.find(m => m.key === 'texture_roughness')?.value
        },
        stock: product.variants[0].inventory_quantity,
        updatedAt: product.updated_at
      };
    });
    
    res.json(beadsWithTextures);
  } catch (error) {
    next(error);
  }
});

router.post('/beads', upload.single('image'), async (req, res, next) => {
  try {
    const { name, price, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const textureData = await textureProcessor.processBeadTexture(
      req.file.buffer,
      { generateMips: true }
    );

    const client = new Shopify.Clients.Rest(req.shop, req.accessToken);
    
    const productResponse = await client.post({
      path: 'products',
      body: {
        product: {
          title: name,
          body_html: description,
          vendor: 'Custom Beads',
          product_type: 'Bead',
          variants: [{
            price: price,
            inventory_management: 'shopify',
            inventory_policy: 'deny'
          }],
          tags: ['bead', 'custom'],
          status: 'active'
        }
      }
    });

    const productId = productResponse.body.product.id;

    const textureUrls = await Promise.all([
      uploadTextureToShopify(client, textureData.textures.diffuse, 'diffuse'),
      uploadTextureToShopify(client, textureData.textures.normal, 'normal'),
      uploadTextureToShopify(client, textureData.textures.roughness, 'roughness')
    ]);

    await Promise.all([
      createTextureMetafield(client, productId, 'texture_diffuse', textureUrls[0]),
      createTextureMetafield(client, productId, 'texture_normal', textureUrls[1]),
      createTextureMetafield(client, productId, 'texture_roughness', textureUrls[2])
    ]);

    res.json({
      success: true,
      product: {
        id: productId,
        name,
        price,
        textures: {
          diffuse: textureUrls[0],
          normal: textureUrls[1],
          roughness: textureUrls[2]
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

async function uploadTextureToShopify(client, textureBuffer, type) {
  const response = await client.post({
    path: 'files',
    body: {
      file: {
        attachment: textureBuffer.toString('base64'),
        filename: `bead-${type}-${Date.now()}.jpg`,
        content_type: 'image/jpeg'
      }
    }
  });
  
  return response.body.file.url;
}

async function createTextureMetafield(client, productId, key, value) {
  await client.post({
    path: `products/${productId}/metafields`,
    body: {
      metafield: {
        namespace: 'texture',
        key,
        value,
        type: 'url'
      }
    }
  });
}

router.use(handleErrors);

module.exports = router;
