import express from 'express';
import { Shopify } from '@shopify/shopify-api';
import beadsRouter from './routes/beads';

const app = express();
app.use(express.json());

// Initialize Shopify
const shopify = new Shopify({
  // Your Shopify app credentials
});

// Routes
app.use('/api', beadsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
