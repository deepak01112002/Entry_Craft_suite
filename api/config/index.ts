import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'entry_craft';
const COMPANY_UNITS = process.env.COMPANY_UNITS || 'Company 1,Company 2';

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const client = await connectToDatabase();
    const db = client.db(DB_NAME);
    const configCollection = db.collection('config');

    if (req.method === 'GET') {
      const config = await configCollection.findOne({ type: 'app' });
      const projectName = config?.projectName || 'PPE Manager';
      
      // Parse company units from env
      const companyUnits = COMPANY_UNITS.split(',').map(unit => unit.trim()).filter(Boolean);

      res.status(200).json({
        projectName,
        companyUnits,
      });
    } else if (req.method === 'POST') {
      const { projectName } = req.body;

      if (!projectName || typeof projectName !== 'string') {
        res.status(400).json({ error: 'Project name is required' });
        return;
      }

      await configCollection.updateOne(
        { type: 'app' },
        { $set: { type: 'app', projectName, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );

      res.status(200).json({ success: true, projectName });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

