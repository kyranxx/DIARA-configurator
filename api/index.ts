// This file serves as a proxy to the server code
// It's needed to match Vercel's serverless function conventions

import { default as serverHandler } from '../server/index';

// Export the server handler for Vercel serverless functions
export default serverHandler;
