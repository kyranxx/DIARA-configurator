import express from 'express';
import path from 'path';
import beadsRouter from './routes/api/beads';

const app = express();
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Serve uploaded images
app.use('/images', express.static(path.join(__dirname, '../src/assets/images')));

// API routes
app.use('/api/beads', beadsRouter);

// Handle SPA routing
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel
export default app;
