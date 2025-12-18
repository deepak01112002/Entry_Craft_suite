import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Helper to convert Express req/res to Vercel format
function createVercelHandler(handler) {
  return async (req, res, next) => {
    // Handle OPTIONS for CORS
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    const vercelReq = {
      method: req.method,
      url: req.url,
      // Merge query and params so handlers can read id from req.query.id
      query: { ...(req.query || {}), ...(req.params || {}) },
      body: req.body,
      headers: req.headers,
    };
    
    const vercelRes = {
      statusCode: 200,
      status: function(code) {
        this.statusCode = code;
        res.status(code);
        return this;
      },
      json: function(data) {
        res.json(data);
      },
      end: function() {
        res.end();
      },
      setHeader: function(name, value) {
        res.setHeader(name, value);
      },
    };

    try {
      await handler(vercelReq, vercelRes);
    } catch (error) {
      console.error('Handler error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
      }
    }
  };
}

// Setup server
async function setupServer() {
  try {
    // Import API handlers
    const { default: configHandler } = await import('./api/config/index.ts');
    const { default: entriesHandler } = await import('./api/entries/index.ts');
    const { default: entryByIdHandler } = await import('./api/entries/[id].ts');
    const { default: uploadHandler } = await import('./api/upload/index.ts');
    const { default: testHandler } = await import('./api/test.ts');

    // API Routes
    app.use('/api/test', createVercelHandler(testHandler));
    app.use('/api/config', createVercelHandler(configHandler));
    app.use('/api/upload', createVercelHandler(uploadHandler));
    app.use('/api/entries/:id', createVercelHandler(entryByIdHandler));
    app.use('/api/entries', createVercelHandler(entriesHandler));

    // Create Vite server for frontend
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    // Use Vite's middleware for all non-API routes
    app.use(vite.middlewares);

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📡 API routes available at http://localhost:${PORT}/api/*`);
      console.log(`🌐 Frontend available at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to setup server:', error);
    process.exit(1);
  }
}

setupServer();
