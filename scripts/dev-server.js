import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createServer() {
  const app = express();

  // Import API handlers
  const uploadHandler = (await import('../api/upload/index.ts')).default;
  const configHandler = (await import('../api/config/index.ts')).default;
  const entriesHandler = (await import('../api/entries/index.ts')).default;
  const entryByIdHandler = (await import('../api/entries/[id].ts')).default;

  // API routes
  app.use('/api/upload', express.json({ limit: '50mb' }), uploadHandler);
  app.use('/api/config', express.json(), configHandler);
  app.use('/api/entries', express.json(), (req, res, next) => {
    if (req.params?.id) {
      return entryByIdHandler(req, res, next);
    }
    return entriesHandler(req, res, next);
  });
  app.use('/api/entries/:id', express.json(), entryByIdHandler);

  // Create Vite server
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.ssrLoadModule);

  app.listen(8080, () => {
    console.log('🚀 Server running at http://localhost:8080');
  });
}

createServer().catch(console.error);

